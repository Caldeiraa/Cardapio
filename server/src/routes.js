const express = require('express');
const routes = express.Router();

const SubCardapio = require('../src/app/controller/subCardapioController');
const Usuarios = require('../src/app/controller/usuarioController');

routes.get('/getCadastroUs', (req, res) => {
  res.sendFile('usuario2.html', { root: './public' });
});

routes.get('/subCategoria/:id_cardapio', SubCardapio.index);

routes.post('/usuarioC',Usuarios.create)
routes.post('/login',Usuarios.logar)
module.exports = routes;
