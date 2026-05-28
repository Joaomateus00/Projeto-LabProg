import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './homepage.css';
import { Relatorios } from './relatorios';

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
    
    
    const carregarDadosFinanceiros = async () => {
        const token = localStorage.getItem('token');

        if (!token) {
            navigate('/');
            return;
        }

        try {
            const resposta = await fetch('http://localhost:3001/api/transacoes', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (resposta.status === 401 || resposta.status === 403) {
                localStorage.removeItem('token');
                navigate('/');
                return;
            }

            const dados = await resposta.json();

            // Verifica se deu tudo certo no backend
            if (resposta.ok) {
                setResumo(dados.resumo);
                setTransacoes(dados.transacoes);
            } else {
                // Se o backend retornou erro, mostra no console e impede a tela branca
                console.error("O Backend retornou um erro:", dados);
                setResumo({ totalReceitas: 0, totalDespesas: 0, saldoAtual: 0 });
                setTransacoes([]);
                alert("Erro ao buscar dados do servidor: " + (dados.message || "Desconhecido"));
            }
        } catch (error) {
            console.error("Erro na comunicação com a API:", error);
            setResumo({ totalReceitas: 0, totalDespesas: 0, saldoAtual: 0 });
            setTransacoes([]);
        } finally {
            setCarregando(false);
        }
    };

    
    useEffect(() => {
        carregarDadosFinanceiros();
    }, [navigate]);

    
    const handleAdicionarTransacao = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const resposta = await fetch('http://localhost:3001/api/transacoes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    descricao: novaDescricao,
                    valor: novoValor,
                    tipo: novoTipo,
                    categoria: novaCategoria
                })
            });
            
            if (resposta.ok) {
                
                setNovaDescricao('');
                setNovoValor('');
                setNovoTipo('despesa');
                setNovaCategoria('alimentação');                
                carregarDadosFinanceiros();
            } else {
                alert("Erro ao registrar transação.");
            }
        } catch (error) {
            console.error("Erro ao enviar dados:", error);
        }
    };

    const handleExcluirTransacao = async (id) => {
        if (!window.confirm("Tem a certeza que deseja eliminar esta transação?")) return;

        const token = localStorage.getItem('token');
        try {
            const resposta = await fetch(`http://localhost:3001/api/transacoes/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (resposta.ok) {
               
                carregarDadosFinanceiros();
            } else {
                alert("Erro ao eliminar a transação.");
            }
        } catch (error) {
            console.error("Erro ao eliminar:", error);
        }
    };

    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem('token');
        navigate('/');
    };

    const formatarMoeda = (valor) => {
        const valorNumerico = Number(valor);
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
                    <button onClick={() => { localStorage.removeItem('token'); navigate('/'); }} className="btn-logout">Sair</button>
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
                        {
                            transacoes.map((t) => (
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
                            ))
                        }
                        <section className="dashboard-details">
                            <div className="detail-panel">
                                <h3>Últimas Transações</h3>
                                <ul className="activity-list">
                                    {transacoes.map(t => (
                                        <li key={t._id} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span>{t.descricao} ({t.categoria})</span>
                                            <strong style={{ color: t.tipo === 'receita' ? '#27ae60' : '#e74c3c' }}>
                                                {t.tipo === 'receita' ? '+' : '-'} {formatarMoeda(t.valor)}
                                            </strong>
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