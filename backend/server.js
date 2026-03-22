const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.post('/login', (req, res) => {
    const { email, senha } = req.body;
    console.log(`Tentativa de login: ${email}`);

    if (email === "admin@admin.com" && senha === "123456") {
        return res.status(200).json({ message: 'Login bem-sucedido!' });
    } else {
        return res.status(401).json({ message: 'Login ou senha inválidos' });
    }
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta: ${PORT}`);
});


