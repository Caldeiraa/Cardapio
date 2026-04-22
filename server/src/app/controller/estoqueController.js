const Estoque = require("../model/estoque");

class EstoqueController {

    listar(req, res) {
        Estoque.listarIngredientes()
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
}

module.exports = new EstoqueController();