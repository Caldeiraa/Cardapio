const Pedido = require("../model/pedidos");
const Estoque = require("../model/estoque"); 
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
            .then(respostaPedido => {
                // O status do pedido mudou para 'preparado' com sucesso!
                // 🔥 Agora disparamos a baixa automática de todos os itens desse pedido no estoque
                return Estoque.baixarEstoque(id)
                    .then(respostaEstoque => {
                        // Se deu tudo certo, responde ao frontend
                        res.status(200).json({ 
                            mensagem: "Pedido pronto e estoque atualizado com sucesso!" 
                        });
                    });
            })
            .catch(erro => {
                console.error("Erro ao preparar pedido ou baixar estoque:", erro);
                
                // Tratamento de erro seguindo o padrão do seu projeto (Array [status, erro])
                if (Array.isArray(erro)) {
                    res.status(erro[0]).json("Erro: " + (erro[1].sqlMessage || erro[1]));
                } else {
                    res.status(500).json("Erro interno no servidor.");
                }
            });
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
