const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { MongoClient } = require('mongodb');
const app = express();

app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://joaomateus_db_user:thesedays@clusterfacul.wejdmok.mongodb.net/?appName=ClusterFacul";
const client = new MongoClient(uri);

async function connectDB() {
    try {
        await client.connect();
        console.log("Conectado ao MongoDB ");
    } catch (error) {
        console.log("Erro ao conectar ao MongoDB: ", error);
    }
}

connectDB();


app.post('/register', async (req, res) => {
    const { email, senha } = req.body;
    try {
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
            dateCriation: new Date()
        };

        await usuarios.insertOne(newUser);
        res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao cadastrar usuario' });
    }
});


app.post('/login', async (req, res)=>{
    const {email,senha} = req.body;

    try{
        const database = client.db('ClusterFacul');
        const usuarios = database.collection('usuarios');

        const userExists = await usuarios.findOne({ email });

        if(userExists){
            const passwordMatch = await bcrypt.compare(senha,userExists.senha);

            if(passwordMatch){
                return res.status(200).json({
                    message: 'Login bem sucedido'
                });
            }else{
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


const PORT = 3001;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta: ${PORT}`);
});


