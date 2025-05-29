const express = require('express');
const routes = express.Router();

const SubCardapio = require('../src/app/controller/subCardapioController');
const Usuarios = require('../src/app/controller/usuarioController');
const PedidoController = require("../src/app/controller/pedidosController");
const CadastroItem = require("../src/app/controller/cadastroItemController");
const CadastroCardapio = require("../src/app/controller/cadastroCategoriaController")

routes.get('/subCategoria/:id_cardapio', SubCardapio.index);
routes.get("/pedidos", PedidoController.listar);
routes.get("/fechamento-caixa", PedidoController.buscarPorDataHora);
routes.get('/usuarios', Usuarios.listar);
routes.get('/subcardapio',CadastroItem.listar)
routes.get('/cardapio',CadastroCardapio.listar)  

routes.put("/pedidos/:id/preparar", PedidoController.atualizarStatus);
routes.put("/itens-pedido/:id_item/preparar", PedidoController.marcarComoPreparado);
routes.put('/usuarios/:id_usuario/desativar', Usuarios.desativar);
routes.put('/ativar', CadastroItem.ativar);
routes.put('/desativar', CadastroItem.desativar);
routes.put("/atualizar/item",CadastroItem.atualizar)

routes.post('/usuarioC', Usuarios.create);
routes.post('/login', Usuarios.logar);
routes.post("/pedido", PedidoController.criar);
routes.post("/cadastroI", CadastroItem.create);
routes.post('/cadastroCardapio',CadastroCardapio.create)

module.exports = routes;
