import { render, screen, waitFor } from '@testing-library/react';
import { Relatorios } from '../relatorios';


jest.mock('recharts', () => {
    const OriginalModule = jest.requireActual('recharts');
    return {
        ...OriginalModule,
        ResponsiveContainer: ({ children }) => (
            <div style={{ width: 500, height: 500 }}>{children}</div>
        ),
    };
});

describe('Componente de Relatórios', () => {
    test('Deve renderizar os componentes de cabeçalho do relatório', async () => {
        const listaMock = [
            { id: 1, descricao: 'Salário', valor: 5000, tipo: 'receita', categoria: 'Trabalho' },
            { id: 2, descricao: 'Mercado', valor: 400, tipo: 'despesa', categoria: 'Alimentação' }
        ];

        render(<Relatorios transacoes={listaMock} />);

        await waitFor(() => {
            expect(screen.getByText(/Gastos por Categoria/i)).toBeInTheDocument();
        });
    });
});