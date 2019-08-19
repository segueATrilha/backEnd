// Importação de Bibliotecas
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Instaciando bibliotecas
const app = express();

// Conexão com banco de dados
mongoose.connect('mongodb+srv://mongoST:UNVNbr0z6zIKCShs@dbsegueatrilha-kix1u.mongodb.net/test?retryWrites=true&w=majority', {
    useNewUrlParser: true
}).catch((error) => {
    app.use((req, res) => {
        return res.status(404).json(error);
    });
});

// Gerenciando o Cors
app.use(cors());

// Configurando o tipo de entrada de dados
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json({
    limit: '5mb'
}));

// Rotas de Acesso
app.use('/', require('./routes/index')); // Rota de Apresentação
app.use('*', require('./routes/index')); // Rota Inválida

// Ponto de Acesso da Aplicação
const URL = process.env.URL || "http://localhost";
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server Running in ${URL}:${PORT}`);
});