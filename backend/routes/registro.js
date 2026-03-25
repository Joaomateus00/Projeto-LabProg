import express from 'express';
import db from "../db/connection.js"; 

const router = express.Router();

router.post('/registro', async (req, res) => {
    let collection = db.collection('usuarios');
    let { email, senha } = req.body;
    res.send(`Registro recebido: ${email} - ${senha}`)
};

router.get('/registro', async (req, res) => {
    try {
        let collection = db.collection('usuarios');
        let query = {
            user: "Joao";

        };
    }