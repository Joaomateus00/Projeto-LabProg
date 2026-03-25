import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import image from './assets/loginback.jpg'; 
import './App.css'; 




export const HomePage = () => (
    <div className='container-login' style={{ backgroundImage: `url(${image})` }}>
        <div className='home-page'>
            <h1>Bem-vindo!</h1>
            <p>Você foi redirecionado após o login.</p>
            <Link to="/" style={{ color: '#007bff' }}>Sair</Link>
        </div>
    </div>
);

export default HomePage;
