import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import image from './assets/loginback.jpg'; 
import './App.css'; 
import { useNavigate } from 'react-router-dom';


function RegisterPage() {

  const [email,setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();

  const [mostrarPopup,setMostrarPopup] = useState(false);
  const botaoDesabilitado = email.trim() === '' || senha.trim() === '';

    const handleRegister = async (e) => {
        e.preventDefault();

        const response = await fetch('http://localhost:3001/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha }),
        });

        const data = await response.json();

        if (response.ok) {
            alert("Cadastro realizado!");
            // Redirecionar para o login, por exemplo
        } else {
            alert(data.message);
        }
    };

  const Redirecionarlogin = () => {
    setMostrarPopup(false);
    navigate('/');
  };  

    return (
        <div className="container-login" style={{ backgroundImage: `url(${image})` }}>
            <form className="form-login" onSubmit={handleRegister}>
                <h2 className="login">Criar Conta</h2>

                <label>E-mail:</label>
                <input type="email" placeholder="Escolha seu e-mail" required value={email} onChange={(e) => setEmail(e.target.value)} />

                <label>Senha:</label>
                <input type="password" placeholder="Crie uma senha" required value={senha} onChange={(e) => setSenha(e.target.value)}/>

                <button className="botton-submit" type="submit" style={{
                  cursor: botaoDesabilitado ? 'not-allowed' : 'pointer',
                  backgroundColor : botaoDesabilitado ? '#555' : '#007bff'
                }}>
                    Registrar
                </button>

                <p style={{ marginTop: '15px', textAlign: 'center', color: 'white' }}>
                    Já tem conta? <Link to="/" style={{ color: '#007bff', fontWeight: 'bold' }}>Faça Login</Link>
                </p>
            </form>

            {mostrarPopup && (
               <div className="pop-up">
                  <div className="container-popup">
                      <p style={{ color: 'black' }}>Conta Criada com Sucesso.</p>
                          <button className="botton-popup" onClick={Redirecionarlogin}>
                             Ir para Login
                          </button>
                  </div>
                </div>
            )}
        </div>
    );
}

export default RegisterPage;