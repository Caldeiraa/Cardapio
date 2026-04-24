const Estoque = require("../model/estoque");

class EstoqueController {

    listar(req, res) {
        Estoque.listarIngredientes()
            .then(r => res.status(r[0]).json(r[1]))
            .catch(r => res.status(r[0]).json(r[1]));
    }
    listarRe(req, res) {
        Estoque.listarReceita()
            .then(r => res.status(r[0]).json(r[1]))
            .catch(r => res.status(r[0]).json(r[1]));
    }
    inserir(req, res) {
        const { nome, unidade, quantidade, minimo } = req.body;

        Estoque.inserirIngrediente(nome, unidade, quantidade, minimo)
            .then(r => res.status(r[0]).json(r[1]))
            .catch(r => res.status(r[0]).json(r[1]));
    }

    verificarBaixo(req, res) {
        Estoque.verificarEstoqueBaixo()
            .then(r => res.status(r[0]).json(r[1]))
            .catch(r => res.status(r[0]).json(r[1]));
    }

    // Corrigido: req.paramns para req.params e nome da variável ajustado
    buscarPorCategoria(req, res) {
        const { id_categoria } = req.params; 
        Estoque.buscarProdId(id_categoria) 
            .then(r => res.status(r[0]).json(r[1]))
            .catch(r => res.status(r[0]).json(r[1]));
    }

    // NOVO: Método para receber o POST do frontend e salvar na tabela receita
    // Ajuste o método inserirReceita para receber o array
    inserirReceita(req, res) {
        const { sub_cardapio_id, ingredientes } = req.body;

        // "ingredientes" agora é um array: [{ingrediente_id: 1, quantidade: 2}, ...]
        Estoque.inserirReceitaEmLote(sub_cardapio_id, ingredientes)
            .then(r => res.status(r[0]).json(r[1]))
            .catch(r => res.status(r[0]).json(r[1]));
    }
}

module.exports = new EstoqueController();