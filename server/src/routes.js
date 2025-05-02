const express = require('express');
const routes = express.Router();

const SubCardapio = require('../src/app/controller/subCardapioController');
const Usuarios = require('../src/app/controller/usuarioController');
const PedidoController = require("../src/app/controller/pedidosController");
const CadastroItem = require("../src/app/controller/cadastroItemController");

routes.get('/getCadastroUs', (req, res) => {
  res.sendFile('usuario2.html', { root: './public' });
});

routes.get('/subCategoria/:id_cardapio', SubCardapio.index);
routes.get("/pedidos", PedidoController.listar);
routes.get("/fechamento-caixa", PedidoController.buscarPorDataHora);

routes.put("/pedidos/:id/preparar", PedidoController.atualizarStatus);
routes.put("/itens-pedido/:id_item/preparar", PedidoController.marcarComoPreparado);

routes.post('/usuarioC', Usuarios.create);
routes.post('/login', Usuarios.logar);
routes.post("/pedido", PedidoController.criar);
routes.post("/cadastroI", CadastroItem.create);

module.exports = routes;
