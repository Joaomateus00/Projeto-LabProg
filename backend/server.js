const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const app = express();
const registroRoute = require('./routes/registro');
const loginRoute = require('./routes/login');

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


app.use('/auth', registroRoute);
app.use('/auth',loginRoute);


const PORT = 3001;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta: ${PORT}`);
});


