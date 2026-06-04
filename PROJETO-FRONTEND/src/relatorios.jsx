import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export const Relatorios = ({ transacoes }) => {
    
    const dadosAgrupados = (transacoes || [])
        .filter(t => t.tipo === 'despesa')
        .reduce((acc, t) => {
            const index = acc.findIndex(item => item.name === t.categoria);
            if (index > -1) {
                acc[index].value += Number(t.valor);
            } else {
                acc.push({ name: t.categoria || 'Outros', value: Number(t.valor) });
            }
            return acc;
        }, []);

    const CORES = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

    return (
        <div style={{ width: '100%', height: 400 }}>
            <h3>Gastos por Categoria</h3>
            <ResponsiveContainer>
                <PieChart>
                    <Pie
                        data={dadosAgrupados}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {dadosAgrupados.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={CORES[index % CORES.length]} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value) => `R$ ${value.toFixed(2)}`} />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};