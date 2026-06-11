const express = require('express');
const router = express.Router();
const verificarToken = require('../middleware/auth');
const { MongoClient, ObjectId } = require('mongodb');

router.post('/', verificarToken, async (req, res) => {
    try {
        const corpo = req.body || {};
        const { descricao, valor, tipo, categoria } = corpo;

        // 1. Primeiro transformamos o valor em número (resolve o problema das aspas "45")
        const valorNumerico = Number(valor);

        // 2. Agora fazemos a validação correta e segura
        if (!descricao || descricao.trim() === '' || isNaN(valorNumerico) || valor === undefined || valor === null || valor === '') {
            return res.status(400).json({ message: 'Descrição e valor são obrigatórios.' });
        }

        const usuarioId = req.usuario.userId || req.usuario.id;
        if (!usuarioId) {
            return res.status(401).json({ message: 'Usuário não identificado no Token de segurança.' });
        }

        const client = req.app.get('mongoClient');
        const db = client.db('ClusterFacul');
        const transacoesCollection = db.collection('transacoes');

        const novaTransacao = {
            usuarioId,
            descricao: descricao.trim(),
            valor: valorNumerico, // Salva como número puro no MongoDB
            tipo: tipo || 'despesa',
            categoria: categoria || 'alimentação',
            data: new Date()
        };

        await transacoesCollection.insertOne(novaTransacao);
        return res.status(201).json({ message: 'Transação registrada com sucesso!' });

    } catch (error) {
        console.error('Erro ao registrar transação:', error);
        return res.status(500).json({ message: 'Erro interno do Servidor', error: error.message });
    }
});



router.get('/', verificarToken, async (req, res) => {
    try {
        console.log("ID BUSCADO:", req.usuario);
        const client = req.app.get('mongoClient');
        const db = client.db('ClusterFacul');
        const transacoesCollection = db.collection('transacoes');

        const transacoes = await transacoesCollection.
            find({ usuarioId: req.usuario.userId }).sort({ data: -1 }).toArray();

        let totalReceitas = 0;
        let totalDespesas = 0;

        transacoes.forEach(t => {
            if (t.tipo === 'receita') totalReceitas += t.valor;
            if (t.tipo === 'despesa') totalDespesas += t.valor;
        });
        const saldoAtual = totalReceitas - totalDespesas;

        res.json({
            resumo: { totalReceitas, totalDespesas, saldoAtual },
            transacoes
        });
    } catch (error) {
        console.error('Erro ao buscar transações:', error);
        res.status(500).json({ message: 'Erro interno do Servidor' });
    }
});

router.delete('/:id', verificarToken, async (req, res) => {
    try {
        const client = req.app.get('mongoClient');
        const db = client.db('ClusterFacul');
        const transacoesCollection = db.collection('transacoes');


        const result = await transacoesCollection.deleteOne({
            _id: new ObjectId(req.params.id),
            usuarioId: req.usuario.userId
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Transação não encontrada' });
        }

        res.json({ message: 'Transação deletada com sucesso' });

    } catch (error) {
        console.error('Erro ao deletar transação:', error);
        res.status(500).json({ message: 'Erro interno do Servidor' });
    }
});

module.exports = router;



