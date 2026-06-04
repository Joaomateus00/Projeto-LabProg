const request = require('supertest');
const app = require('../server');

describe('Integridade e Restrições do Banco de Dados', () => {
    let db;
    let colecaoTransacoes;

    beforeAll(async () => {
        
        while (!app.get('mongoClient')) {
            await new Promise(resolve => setTimeout(resolve, 50));
        }

        const client = app.get('mongoClient');
        if (client) {
            db = client.db();
            colecaoTransacoes = db.collection('transacoes');
        }
    });

    afterAll(async () => {
        const client = app.get('mongoClient');
        if (client) {
            await client.close();
        }
    });

    test('Deve persistir e ler uma transação diretamente na coleção do MongoDB', async () => {
        expect(colecaoTransacoes).toBeDefined();

        const novaMovimentacao = {
            descricao: 'Inserção Direta Banco',
            valor: 250,
            tipo: 'despesa',
            categoria: 'Alimentação',
            data: new Date()
        };

        const resultadoInsercao = await colecaoTransacoes.insertOne(novaMovimentacao);
        expect(resultadoInsercao.acknowledged).toBe(true);

        const documentoPersistido = await colecaoTransacoes.findOne({ _id: resultadoInsercao.insertedId });
        expect(documentoPersistido).toBeTruthy();
        expect(documentoPersistido.descricao).toBe('Inserção Direta Banco');

        await colecaoTransacoes.deleteOne({ _id: resultadoInsercao.insertedId });
    });
});