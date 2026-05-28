const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const app = express();
const registroRoute = require('./routes/registro');
const loginRoute = require('./routes/login');
const verificarToken = require('./middleware/auth');
const transacoesRoute = require('./routes/transacoes');


app.use(cors());
app.use(express.json());

const uri = "mongodb://joaomateus_db_user:thesedays@ac-nwbhssp-shard-00-00.wejdmok.mongodb.net:27017/ClusterFacul?authSource=admin&ssl=true";
const client = new MongoClient(uri, {
    family: 4
});

async function connectDB() {
    try {
        await client.connect();
        app.set('mongoClient', client);
        console.log("Conectado ao MongoDB ");
    } catch (error) {
        console.log("Erro ao conectar ao MongoDB: ", error);
    }
}

connectDB();

app.get('/public', (req, res) => {
    res.json({ message: 'Acesso público' });
});

app.get('/dados-dashboard', verificarToken, (req, res) => {
    res.json({
        message: 'Acesso Permitido',
        dadosUsuario: req.usuario
    });
});


app.use('/auth', registroRoute);
app.use('/auth',loginRoute);
app.use('/api/transacoes', transacoesRoute);

const PORT = 3001;

if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta: ${PORT}`);
    });
}


module.exports = app;