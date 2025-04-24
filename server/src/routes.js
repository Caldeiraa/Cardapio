const express = require('express');
const routes = express.Router();

const SubCardapio = require('../src/app/controller/subCardapioController');
const Usuarios = require('../src/app/controller/usuarioController');
const PedidoController = require("../src/app/controller/pedidosController");

routes.get('/getCadastroUs', (req, res) => {
  res.sendFile('usuario2.html', { root: './public' });
});

routes.get('/subCategoria/:id_cardapio', SubCardapio.index);
routes.get("/pedidos", PedidoController.listar);

routes.post('/usuarioC',Usuarios.create)
routes.post('/login',Usuarios.logar)
routes.post("/pedido", PedidoController.criar);

module.exports = routes;