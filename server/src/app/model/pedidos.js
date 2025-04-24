const mysql = require("mysql2");
const dbConfig = require("../config");

class Pedido {
    constructor() {
        this.conexao = mysql.createConnection(dbConfig.db);
    }

    salvarPedido(pedido) {
        return new Promise((resolve, reject) => {
            const { nome_cliente, mesa, total, itens } = pedido;

            const sqlPedido = "INSERT INTO pedido (nome_cliente, mesa, total) VALUES (?, ?, ?)";
            this.conexao.query(sqlPedido, [nome_cliente, mesa, total], (erro, resultado) => {
                if (erro) return reject([500, erro]);

                const pedido_id = resultado.insertId;

                const itensQuery = "INSERT INTO itens_pedido (quantidade, preco, pedido_id, sub_cardapio_id) VALUES ?";
                const valores = itens.map(item => [item.quantidade, item.preco, pedido_id, item.sub_cardapio_id]);

                this.conexao.query(itensQuery, [valores], (erro2, resultado2) => {
                    if (erro2) return reject([500, erro2]);
                    resolve([201, { id_pedido: pedido_id, mensagem: "Pedido realizado com sucesso!" }]);
                });
            });
        });
    }

    listarPedidosComItens() {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT 
                    p.nome_cliente, p.mesa, p.data_hora,
                    ip.quantidade, ip.preco,
                    sc.nome AS item
                FROM pedido p
                JOIN itens_pedido ip ON p.id_pedido = ip.pedido_id
                JOIN sub_cardapio sc ON ip.sub_cardapio_id = sc.id_sup_cardapio
                ORDER BY p.data_hora DESC
            `;

            this.conexao.query(sql, (erro, resultado) => {
                if (erro) reject([500, erro]);
                else resolve([200, resultado]);
            });
        });
    }
}

module.exports = new Pedido();
