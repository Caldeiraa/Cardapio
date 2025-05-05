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

    atualizarStatus(req, res) {
        const { id } = req.params;

        Pedido.atualizarStatus(id)
            .then(resposta => res.status(resposta[0]).json(resposta[1]))
            .catch(erro => res.status(erro[0]).json("Erro: " + erro[1].errno));
    }
    marcarComoPreparado(req, res) {
        const id_item = req.params.id_item;
    
        Pedido.marcarItemComoPreparado(id_item).then(resposta => {
            res.status(resposta[0]).json(resposta[1]);
        }).catch(erro => {
            res.status(erro[0]).json("Erro: " + erro[1].errno);
        });
    }
    
    buscarPorDataHora(req, res) {
        const { inicio, fim } = req.query;
    
        if (!inicio || !fim) {
            return res.status(400).json("Data e hora de início e fim são obrigatórias.");
        }
    
        const formattedInicio = inicio.replace('T', ' ').substring(0, 19);
        const formattedFim = fim.replace('T', ' ').substring(0, 19);
    
        Pedido.buscarPedidosPorDataHora(formattedInicio, formattedFim)
            .then(resposta => {
                res.status(resposta[0]).json(resposta[1]);
            })
            .catch(erro => {
                res.status(erro[0]).json("Erro: " + erro[1].errno);
            });
    }
    
    

}

module.exports = new PedidoController();
