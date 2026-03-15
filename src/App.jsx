import { useState } from 'react';
import image from './assets/loginback.jpg';

function App() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');


    const [mostrarPopup, setMostrarPopup] = useState(false);
    const botaoDesabilitado = email.trim() === '' || senha.trim() === '';

    const handleSubmit = (e) => {
        e.preventDefault();
        setMostrarPopup(true);
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh', 
            width: '100%',      
            fontFamily: 'Arial, sans-serif',
            backgroundImage: `url(${image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            color: 'white'      
        }}>
            <form onSubmit={handleSubmit} style={{
                border: '1px solid #444', 
                padding: '30px',
                borderRadius: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '15px',
                width: '320px',
                backgroundColor: 'rgba(0, 0, 0, 0.85)', 
                boxShadow: '0 8px 32px rgba(0,0,0,1)'
            }}>
                <h2 style={{ textAlign: 'center' }}>Login</h2>

                <label>E-mail:</label>
                <input type="email"
                    placeholder="Digite seu e-mail"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} />

                <label>Senha:</label>
                <input type="password"
                    placeholder="Digite sua senha"
                    required
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}/>

                <button type="submit" style={{
                    marginTop: '10px',
                    padding: '10px',
                    cursor: botaoDesabilitado ? 'not-allowed' : 'pointer',
                    backgroundColor: botaoDesabilitado ? '#555' : '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    transition: 'background-color 0.3s'
                }}>
                    Entrar
                </button>
            </form>

            {mostrarPopup && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '30px',
                        borderRadius: '10px',
                        textAlign: 'center',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                    }}>
                        <h3 style={{ color: 'green' }}>✅ Sucesso!</h3>
                        <p style={{ color: 'black' }}>O login foi realizado com êxito.</p>
                        <button
                            onClick={() => setMostrarPopup(false)}
                            style={{
                                padding: '8px 20px',
                                cursor: 'pointer',
                                backgroundColor: '#333',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px'
                            }}
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;