const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const app = express();


async function runGetStarted() {
    const uri = '<mongodb+srv://joaomateus_db_user:thesedays@clusterfacul.wejdmok.mongodb.net/?appName=ClusterFacul>';
    const client = new MongoClient(uri);


    try {
        const database = client.db('login');
        const movies = database.collection('movies');


    }
    
}


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

const PORT = 3001;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta: ${PORT}`);
});


