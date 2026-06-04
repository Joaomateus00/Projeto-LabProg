const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();


router.post('/register', async (req, res) => {
    const { email, senha } = req.body;
    try {
        const client = req.app.get('mongoClient');

        if (!client) {
            return res.status(500).json({ message: 'Erro de conexão com o banco de dados' });
        }

        const database = client.db("ClusterFacul");
        const usuarios = database.collection("usuarios");
        const userExists = await usuarios.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'Usuário já existe' });
        }
        

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(senha, saltRounds);

        const newUser = {
            email,
            senha: hashedPassword,
            dateCreation: new Date()
        };

        await usuarios.insertOne(newUser);
        res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao cadastrar usuario' });
    }
});


module.exports = router;
