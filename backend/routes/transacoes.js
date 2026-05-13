const express = require('express');
const router = express.Router();
const verificarToken = require('../middleware/auth');
const { MongoClient, ObjectId } = require('mongodb');

router.post('/', verificarToken, async (req, res) => {

    try {
        const { descricao, valor, tipo, categoria} = req.body;
        const client = req.app.get('mongoClient');
        const db = client.db('ClusterFacul');
        const transacoesCollection = db.collection('transacoes');


        const novaTransacao = {
            usuarioId: req.usuario.userId,
            descricao,
            valor: Number(valor),
            tipo,
            categoria,
            data: new Date()
        };

        await transacoesCollection.insertOne(novaTransacao);
        res.status(201).json({ message: 'Transação registrada com sucesso!' });

    } catch (error) {
        console.error('Erro ao registrar transação:', error);
        res.status(500).json({ message: 'Erro interno do Servidor' });
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



