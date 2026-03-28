const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { MongoClient } = require('mongodb');
const app = express();
const jwt = require('jsonwebtoken');
const secretKey = "lab_programacao";
const router = express.Router();

router.post('/login',async (req, res)=>{
    const {email,senha} = req.body;

    try{
        const client = req.app.get('mongoClient')

        if (!client) {
            console.error("Erro de Conexao MongoClient");
            return res.status(500).json({ message: 'Erro de conexão com o banco de dados' });
        }

        const database = client.db("ClusterFacul");

        const usuarios = database.collection('usuarios');

        const userExists = await usuarios.findOne({ email });
        
        if(userExists){
            const passwordMatch = await bcrypt.compare(senha,userExists.senha);

            if (passwordMatch) {
                const token = jwt.sign ({
                    userId: userExists._id,
                    email: userExists.email
                }, secretKey, { expiresIn: '10s'}
                ); 
                return res.status(200).json({
                    message: 'Login bem sucedido'
                });
            } else{
                return res.status(400).json({
                    message: 'senha incorreta'
                });
            }            
        }else {
                return res.status(400).json({
                    message: 'usuario incorreto'
                });
            }

    } catch (error) {
        console.log("Erro no login", error);
        res.status(500).json({
            message: 'Erro interno no servidor'
        });
    }
});

module.exports = router;
