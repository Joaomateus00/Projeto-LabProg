import { useState } from 'react';
import image from './assets/loginback.jpg';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import RegisterPage from './registerpage';

function App() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');


    const [mostrarPopup, setMostrarPopup] = useState(false);
    const botaoDesabilitado = email.trim() === '' || senha.trim() === '';

    const handleSubmit = async (e) => {
        e.preventDefault();

        const dadosLogin = { email, senha };

        try {
            const resposta = await fetch('http://localhost:3001/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosLogin)
            });
            if (resposta.ok) {
                setMostrarPopup(true);
            } else {
                alert('Login ou senha inválidos');
            }
        } catch (error) {
            console.error('Erro ao tentar fazer login:', error);
        }

    };

    return (
        <Router>
            <Routes>
                {/* ROTA PRINCIPAL: LOGIN */}
                <Route path="/" element={
                    <div className="container-login" style={{ backgroundImage: `url(${image})` }}>
                        <form className="form-login" onSubmit={handleSubmit}>
                            <h2 className="login">Login</h2>

                            <label>E-mail:</label>
                            <input 
                                type="email"
                                placeholder="Digite seu e-mail"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)} 
                            />

                            <label>Senha:</label>
                            <input 
                                type="password"
                                placeholder="Digite sua senha"
                                required
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                            />

                            <button className="botton-submit" type="submit" style={{
                                cursor: botaoDesabilitado ? 'not-allowed' : 'pointer',
                                backgroundColor: botaoDesabilitado ? '#555' : '#007bff',
                            }}>
                                Entrar
                            </button>

                            {/* LINK PARA A PÁGINA DE REGISTRO */}
                            <p style={{ marginTop: '15px', textAlign: 'center', color: 'white' }}>
                                Não tem uma conta? <Link to="/registrar" style={{ color: '#007bff', fontWeight: 'bold', textDecoration: 'none' }}>Registre-se aqui</Link>
                            </p>
                        </form>

                        {mostrarPopup && (
                            <div className="pop-up">
                                <div className="container-popup">
                                    <h3 style={{ color: 'green' }}>✅ Logado!</h3>
                                    <p style={{ color: 'black' }}>Login realizado com sucesso.</p>
                                    <button className="botton-popup" onClick={() => setMostrarPopup(false)}>
                                        Fechar
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                } />

                {/* ROTA PARA A PÁGINA DE REGISTRO */}
                <Route path="/registrar" element={<RegisterPage />} />
            </Routes>
        </Router>
    );
}



export default App;