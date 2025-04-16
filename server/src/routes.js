const express = require('express');
const routes = express.Router();

const SubCardapio = require('../src/app/controller/subCardapioController');

routes.get('/getCadastroUs', (req, res) => {
  res.sendFile('usuario2.html', { root: './public' });
});

routes.get('/subCategoria/:id_cardapio', SubCardapio.index);

module.exports = routes;
