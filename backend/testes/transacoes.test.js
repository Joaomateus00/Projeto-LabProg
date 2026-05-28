const request = require('supertest');
const app = require('../server');

// Mock do middleware de autenticação
jest.mock('../middleware/auth', () => (req, res, next) => {
    req.usuario = { id: 'usuario_teste_123' };
    next();
});

describe('Testes de Endpoints de Transações', () => {

    beforeAll(async () => {
        // Laço dinâmico: Espera até que o app tenha guardado a instância ativa do mongoClient
        while (!app.get('mongoClient')) {
            await new Promise(resolve => setTimeout(resolve, 50));
        }
    });

    afterAll(async () => {
        const client = app.get('mongoClient');
        if (client) {
            await client.close();
        }
    });

    test('POST /api/transacoes - Deve registrar uma nova movimentação com sucesso', async () => {
        const response = await request(app)
            .post('/api/transacoes')
            .set('Authorization', 'Bearer token_valido_teste')
            .send({
                descricao: 'Recebimento de Freelance',
                valor: 1200,
                tipo: 'receita',
                categoria: 'Trabalho'
            });

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('message', 'Transação registrada com sucesso!');
    });

    test('POST /api/transacoes - Deve processar a requisição de criação', async () => {
        const response = await request(app)
            .post('/api/transacoes')
            .set('Authorization', 'Bearer token_valido_teste')
            .send({
                descricao: 'Compra Sem Valor',
                tipo: 'despesa'
            });

        expect(response.statusCode).toBe(201);
    });
});