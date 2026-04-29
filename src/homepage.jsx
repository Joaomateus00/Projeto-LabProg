import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './homepage.css';

export const HomePage = () => {
    const navigate = useNavigate();

    
    const [resumo, setResumo] = useState({ totalReceitas: 0, totalDespesas: 0, saldoAtual: 0 });
    const [transacoes, setTransacoes] = useState([]);
    const [carregando, setCarregando] = useState(true);

    
    const [novaDescricao, setNovaDescricao] = useState('');
    const [novoValor, setNovoValor] = useState('');
    const [novoTipo, setNovoTipo] = useState('receita'); 
    const [novaCategoria, setNovaCategoria] = useState('alimentação');
    const [novaCategoria, setNovaCategoria] = useState('streamings');
    const [novaCategoria, setNovaCategoria] = useState('combustivel');
    const [novaCategoria, setNovaCategoria] = useState('saude');
    const [novaCategoria, setNovaCategoria] = useState('lazer');
    const [novaCategoria, setNovaCategoria] = useState('parcelados');
    
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
                setNovaCategoria('streamings');
                setNovaCategoria('combustivel');
                setNovaCategoria('saude');
                setNovaCategoria('lazer');
                setNovaCategoria('parcelados');
                
                carregarDadosFinanceiros();
            } else {
                alert("Erro ao registrar transação.");
            }
        } catch (error) {
            console.error("Erro ao enviar dados:", error);
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
                <div className="sidebar-logo">
                    <h2>Finanças</h2>
                </div>
                <nav className="sidebar-nav">
                    <ul>
                        <li className="active"><a href="#home">Dashboard</a></li>
                    </ul>
                </nav>
            </aside>

            <main className="main-content">
                <header className="top-header">
                    <div className="header-title">
                        <h1>Visão Geral</h1>
                    </div>
                    <div className="header-user">
                        <span>Meu Perfil</span>
                        <button onClick={handleLogout} className="btn-logout">Sair</button>
                    </div>
                </header>

                <section className="widgets-grid">
                    <div className="widget-card">
                        <h3>Saldo Atual</h3>
                        <p className="widget-value">{formatarMoeda(resumo.saldoAtual)}</p>
                    </div>
                    <div className="widget-card">
                        <h3>Total de Receitas</h3>
                        <p className="widget-value" style={{ color: '#27ae60' }}>{formatarMoeda(resumo.totalReceitas)}</p>
                    </div>
                    <div className="widget-card">
                        <h3>Total de Despesas</h3>
                        <p className="widget-value" style={{ color: '#e74c3c' }}>{formatarMoeda(resumo.totalDespesas)}</p>
                    </div>
                </section>

                
                <section className="dashboard-details" style={{ marginBottom: '20px' }}>
                    <div className="detail-panel">
                        <h3>Adicionar Nova Transação</h3>
                        <form onSubmit={handleAdicionarTransacao} className="transaction-form">
                            <input
                                type="text"
                                placeholder="Descrição (ex: Supermercado)"
                                value={novaDescricao}
                                onChange={(e) => setNovaDescricao(e.target.value)}
                                required
                            />
                            <input
                                type="number"
                                placeholder="Valor (R$)"
                                value={novoValor}
                                onChange={(e) => setNovoValor(e.target.value)}
                                required
                                step="0.01" 
                            />
                            <select value={novoTipo} onChange={(e) => setNovoTipo(e.target.value)}>
                                <option value="despesa">Despesa</option>
                                <option value="receita">Receita</option>
                            </select>
                            <select value={novaCategoria} onChange={(e) => setNovaCategoria(e.target.value)}>
                                <option value="alimentação">Alimentação</option>
                                <option value="streamings">Streamings</option>
                                <option value="combustivel">Combustível</option>
                                <option value="saude">Saúde</option>
                                <option value="lazer">Lazer</option>
                                <option value="parcelados">Parcelados</option>
                            </select>
                            <button type="submit" className="btn-add">Adicionar</button>
                        </form>
                    </div>
                </section>

                <section className="dashboard-details">
                    <div className="detail-panel">
                        <h3>Últimas Transações</h3>
                        {transacoes.length === 0 ? (
                            <p style={{ textAlign: 'center', color: '#7f8c8d' }}>Nenhuma transação registrada ainda.</p>
                        ) : (
                            <ul className="activity-list">
                                {transacoes.map((t) => (
                                    <li key={t._id} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span>{t.descricao}</span>
                                        <strong style={{ color: t.tipo === 'receita' ? '#27ae60' : '#e74c3c' }}>
                                            {t.tipo === 'receita' ? '+' : '-'} {formatarMoeda(t.valor)}
                                        </strong>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default HomePage;