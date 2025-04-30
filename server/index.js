const express = require('express');
const cors = require('cors');
const path = require('path');
const fileUpload = require('express-fileupload'); // <--- IMPORTANTE!!!

const app = express();
const PORT = 3000;

// MIDDLEWARES
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload()); // <--- AQUI ESTÁ O SEGREDO!!!

// Servir arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Importar e usar as rotas definidas em 'src/routes/index.js'
const routes = require('./src/routes');
app.use(routes);

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
