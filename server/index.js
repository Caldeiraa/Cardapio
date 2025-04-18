const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware para permitir requisições do frontend
app.use(cors());

// Middleware para parsear JSON
app.use(express.json());

// Servir arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Importar e usar as rotas definidas em 'src/routes/index.js'
const routes = require('./src/routes');
app.use(routes);

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
