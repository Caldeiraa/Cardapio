const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

const routes = require('./src/routes'); // Ajuste o caminho conforme necessário

app.use(cors());
app.use(express.json());
app.use(routes); // Registra as rotas

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
