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
        p.id_pedido, p.nome_cliente, p.mesa, p.data_hora,
        ip.id_item, ip.quantidade, ip.preco, ip.preparado,
        sc.nome AS item
    FROM pedido p
    JOIN itens_pedido ip ON p.id_pedido = ip.pedido_id
    JOIN sub_cardapio sc ON ip.sub_cardapio_id = sc.id_sup_cardapio
    WHERE p.status = 'pendente'
    ORDER BY p.data_hora DESC
`;



            this.conexao.query(sql, (erro, resultado) => {
                if (erro) reject([500, erro]);
                else resolve([200, resultado]);
            });
        });
    }

    atualizarStatus(pedidoId) {
        return new Promise((resolve, reject) => {
            const sql = "UPDATE pedido SET status = 'preparado' WHERE id_pedido = ?";
            this.conexao.query(sql, [pedidoId], (erro, resultado) => {
                if (erro) return reject([500, erro]);
                resolve([200, { mensagem: "Pedido marcado como preparado!" }]);
            });
        });
    }
    marcarItemComoPreparado(id_item) {
        return new Promise((resolve, reject) => {
            const sql = "UPDATE itens_pedido SET preparado = true WHERE id_item = ?";
            this.conexao.query(sql, [id_item], (erro, resultado) => {
                if (erro) reject([500, erro]);
                else resolve([200, { mensagem: "Item marcado como preparado!" }]);
            });
        });
    }

    buscarPedidosPorDataHora(inicio, fim) {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT 
                    p.id_pedido,
                    p.nome_cliente,
                    p.mesa,
                    p.data_hora,
                    p.total AS total_pedido,
                    sc.nome AS item,
                    ip.quantidade,
                    (ip.quantidade * sc.preco) AS total_item
                FROM pedido p
                JOIN itens_pedido ip ON p.id_pedido = ip.pedido_id
                JOIN sub_cardapio sc ON ip.sub_cardapio_id = sc.id_sup_cardapio
                WHERE p.data_hora BETWEEN ? AND ?
                  AND p.status = 'preparado'
                ORDER BY p.data_hora ASC, p.id_pedido, sc.nome
            `;
    
            this.conexao.query(sql, [inicio, fim], (erro, resultado) => {
                if (erro) reject([500, erro]);
                else resolve([200, resultado]);
            });
        });
        
    }
    
    
    
}

module.exports = new Pedido();
