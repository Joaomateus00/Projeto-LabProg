import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './homepage.css';
import { Relatorios } from './relatorios';
import api from './services/api';

export const HomePage = () => {
    const navigate = useNavigate();
    
    const [abaAtiva, setAbaAtiva] = useState('dashboard');
    const [resumo, setResumo] = useState({ totalReceitas: 0, totalDespesas: 0, saldoAtual: 0 });
    const [transacoes, setTransacoes] = useState([]);
    const [carregando, setCarregando] = useState(true);

    const [novaDescricao, setNovaDescricao] = useState('');
    const [novoValor, setNovoValor] = useState('');
    const [novoTipo, setNovoTipo] = useState('receita'); 
    const [novaCategoria, setNovaCategoria] = useState('alimentação');

    // 1. Função assíncrona separada para buscar os dados
    const carregarDadosFinanceiros = async () => {
        const token = localStorage.getItem('token');

        if (!token) {
            navigate('/');
            return;
        }

        try {
            // O Axios já usa a porta 3001
            const resposta = await api.get('/api/transacoes');
            const dados = resposta.data;

            setResumo(dados.resumo || { totalReceitas: 0, totalDespesas: 0, saldoAtual: 0 });
            setTransacoes(dados.transacoes || []);
            
        } catch (error) {
            console.error("Erro na comunicação com a API:", error);
            
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                localStorage.removeItem('token');
                navigate('/');
            } else {
                setResumo({ totalReceitas: 0, totalDespesas: 0, saldoAtual: 0 });
                setTransacoes([]);
            }
        } finally {
            setCarregando(false);
        }
    };

    // 2. useEffect chamando a função (sem usar await direto nele)
    useEffect(() => {
        carregarDadosFinanceiros();
    }, []); 

    const handleAdicionarTransacao = async (e) => {
        e.preventDefault();

        // LOG DE RASTREAMENTO: Vamos ver o que tem nos inputs agora
        console.log("--- DADOS REAIS DO FORMULÁRIO ---");
        console.log("Descrição:", novaDescricao, "Tipo:", typeof novaDescricao);
        console.log("Valor:", novoValor, "Tipo:", typeof novoValor);
        console.log("---------------------------------");

        try {
            await api.post('/api/transacoes', {
                descricao: novaDescricao.trim(), // Remove espaços vazios acidentais
                valor: novoValor,
                tipo: novoTipo,
                categoria: novaCategoria
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            setNovaDescricao('');
            setNovoValor('');
            setNovoTipo('despesa');
            setNovaCategoria('alimentação');

            carregarDadosFinanceiros();

        } catch (error) {
            console.error("Erro ao enviar dados:", error);
            alert("Erro ao registrar transação.");
        }
    };

    const handleExcluirTransacao = async (id) => {
        if (!window.confirm("Tem a certeza que deseja eliminar esta transação?")) return;

        try {
            await api.delete(`/api/transacoes/${id}`);
            carregarDadosFinanceiros();
        } catch (error) {
            console.error("Erro ao eliminar:", error);
            alert("Erro ao eliminar a transação.");
        }
    };

    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem('token');
        navigate('/');
    };

    const formatarMoeda = (valor) => {
        const valorNumerico = Number(valor) || 0;
        return valorNumerico.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    if (carregando) {
        return <div className="dashboard-container"><h2 style={{ margin: 'auto' }}>Carregando seus dados...</h2></div>;
    }

    return (
        <div className="dashboard-container">
            <aside className="sidebar">
                <div className="sidebar-logo"><h2>Finanças</h2></div>
                <nav className="sidebar-nav">
                    <ul>
                        <li className={abaAtiva === 'dashboard' ? 'active' : ''}>
                            <button className="nav-button" onClick={() => setAbaAtiva('dashboard')}>Dashboard</button>
                        </li>
                        <li className={abaAtiva === 'relatorios' ? 'active' : ''}>
                            <button className="nav-button" onClick={() => setAbaAtiva('relatorios')}>Relatórios</button>
                        </li>
                    </ul>
                </nav>
            </aside>

            <main className="main-content">
                <header className="top-header">
                    <h1>{abaAtiva === 'dashboard' ? 'Visão Geral' : 'Relatórios Detalhados'}</h1>
                    <button onClick={handleLogout} className="btn-logout">Sair</button>
                </header>

                {abaAtiva === 'dashboard' && (
                    <>
                        <section className="widgets-grid">
                            <div className="widget-card">
                                <h3>Saldo Atual</h3>
                                <p className="widget-value">{formatarMoeda(resumo.saldoAtual)}</p>
                            </div>
                            <div className="widget-card">
                                <h3>Receitas</h3>
                                <p className="widget-value" style={{ color: '#27ae60' }}>{formatarMoeda(resumo.totalReceitas)}</p>
                            </div>
                            <div className="widget-card">
                                <h3>Despesas</h3>
                                <p className="widget-value" style={{ color: '#e74c3c' }}>{formatarMoeda(resumo.totalDespesas)}</p>
                            </div>
                        </section>

                        <section className="dashboard-details">
                            <div className="detail-panel">
                                <h3>Nova Transação</h3>
                                <form onSubmit={handleAdicionarTransacao} className="transaction-form">
                                    <input type="text" placeholder="Descrição" value={novaDescricao} onChange={e => setNovaDescricao(e.target.value)} required />
                                    <input type="number" placeholder="Valor" value={novoValor} onChange={e => setNovoValor(e.target.value)} required step="0.01" />
                                    <select value={novoTipo} onChange={e => setNovoTipo(e.target.value)}>
                                        <option value="despesa">Despesa</option>
                                        <option value="receita">Receita</option>
                                    </select>
                                    <select value={novaCategoria} onChange={e => setNovaCategoria(e.target.value)}>
                                        <option value="alimentação">Alimentação</option>
                                        <option value="streamings">Streamings</option>
                                        <option value="combustivel">Combustível</option>
                                        <option value="saude">Saúde</option>
                                        <option value="lazer">Lazer</option>
                                        <option value="parcelados">Parcelados</option>
                                        <option value="receita">Receita</option>
                                    </select>
                                    <button type="submit" className="btn-add">Adicionar</button>
                                </form>
                            </div>
                        </section>
                        
                        <section className="dashboard-details">
                            <div className="detail-panel">
                                <h3>Últimas Transações</h3>
                                <ul className="activity-list">
                                    {transacoes.map((t) => (
                                        <li key={t._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                            <div>
                                                <span>{t.descricao}</span>
                                                <small style={{ marginLeft: '10px', color: '#95a5a6' }}>({t.categoria})</small>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                <strong style={{ color: t.tipo === 'receita' ? '#27ae60' : '#e74c3c' }}>
                                                    {t.tipo === 'receita' ? '+' : '-'} {formatarMoeda(t.valor)}
                                                </strong>

                                                <button
                                                    onClick={() => handleExcluirTransacao(t._id)}
                                                    style={{ backgroundColor: 'transparent', border: 'none', color: '#e74c3c', cursor: 'pointer', fontSize: '18px' }}
                                                    title="Eliminar"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </section>
                    </>
                )}

                {abaAtiva === 'relatorios' && (
                    <section className="dashboard-details">
                        <div className="detail-panel">
                            <Relatorios transacoes={transacoes} />
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
};

export default HomePage;