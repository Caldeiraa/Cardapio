const Pedido = require("../model/pedidos");

class PedidoController {
    criar(req, res) {
        const pedido = req.body;

        if (!pedido.nome_cliente || !pedido.mesa || !pedido.total || !pedido.itens || pedido.itens.length === 0) {
            return res.status(400).json("Dados do pedido incompletos.");
        }

        Pedido.salvarPedido(pedido).then(resposta => {
            res.status(resposta[0]).json(resposta[1]);
        }).catch(erro => {
            res.status(erro[0]).json("Erro: " + erro[1].errno);
        });
    }

    listar(req, res) {
        Pedido.listarPedidosComItens().then(resposta => {
            res.status(resposta[0]).json(resposta[1]);
        }).catch(erro => {
            res.status(erro[0]).json("Erro: " + erro[1].errno);
        });
    }
}

module.exports = new PedidoController();
