const mysql = require("mysql2");
const dbConfig = require("../config");

class Pedido {
    constructor() {
        this.conexao = mysql.createConnection(dbConfig.db);
    }

    salvarPedido(pedido) {
        return new Promise((resolve, reject) => {
            const { nome_cliente, mesa, total, itens } = pedido;

            // REGRA DE NEGÓCIO: Verificar se a mesa já possui uma comanda aberta
            const sqlCheckMesa = "SELECT id_pedido FROM pedido WHERE mesa = ? AND status != 'pago' LIMIT 1";
            this.conexao.query(sqlCheckMesa, [mesa], (erroCheck, resultadoCheck) => {
                if (erroCheck) return reject([500, erroCheck]);
                
                if (resultadoCheck.length > 0) {
                    return reject([400, `A mesa ${mesa} ainda está aberta. Feche a comanda antes de abrir um novo pedido.`]);
                }

                const sqlPedido = "INSERT INTO pedido (nome_cliente, mesa, total) VALUES (?, ?, ?)";
                this.conexao.query(sqlPedido, [nome_cliente, mesa, total], (erro, resultado) => {
                    if (erro) return reject([500, erro]);

                    const pedido_id = resultado.insertId;

                    // Agora vamos buscar o preço atual de cada item para garantir que o preço gravado seja o correto
                    const valores = [];
                    let count = 0;
                    let erroEncontrado = false;

                    itens.forEach(item => {
                        const sqlPreco = "SELECT preco FROM sub_cardapio WHERE id_sup_cardapio = ?";
                        this.conexao.query(sqlPreco, [item.sub_cardapio_id], (erroPreco, resultadoPreco) => {
                            if (erroPreco) {
                                if (!erroEncontrado) {
                                    erroEncontrado = true;
                                    return reject([500, erroPreco]);
                                }
                            } else if (resultadoPreco.length === 0) {
                                if (!erroEncontrado) {
                                    erroEncontrado = true;
                                    return reject([400, `Produto não encontrado: id ${item.sub_cardapio_id}`]);
                                }
                            } else {
                                const precoAtual = resultadoPreco[0].preco;
                                valores.push([item.quantidade, precoAtual, pedido_id, item.sub_cardapio_id, item.observacao || null]);
                            }

                            count++;
                            if (count === itens.length && !erroEncontrado) {
                                const itensQuery = "INSERT INTO itens_pedido (quantidade, preco, pedido_id, sub_cardapio_id, observacao) VALUES ?";

                                this.conexao.query(itensQuery, [valores], (erro2, resultado2) => {
                                    if (erro2) return reject([500, erro2]);
                                    resolve([201, { id_pedido: pedido_id, mensagem: "Pedido realizado com sucesso!" }]);
                                });
                            }
                        });
                    });
                });
            });
        });
    }


    listarPedidosComItens() {
        return new Promise((resolve, reject) => {
            const sql = `
    SELECT 
        p.id_pedido, p.nome_cliente, p.mesa, p.data_hora,
        ip.id_item, ip.quantidade, ip.preco, ip.preparado, ip.observacao,
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

    buscarPorMesa(mesa) {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT 
                    p.id_pedido, p.nome_cliente, p.mesa, p.data_hora, p.status,
                    ip.id_item, ip.quantidade, ip.preco, ip.observacao,
                    sc.nome AS item,
                    (ip.quantidade * ip.preco) AS subtotal
                FROM pedido p
                JOIN itens_pedido ip ON p.id_pedido = ip.pedido_id
                JOIN sub_cardapio sc ON ip.sub_cardapio_id = sc.id_sup_cardapio
                WHERE p.mesa = ? AND p.status != 'pago'
                ORDER BY p.data_hora ASC
            `;
            this.conexao.query(sql, [mesa], (erro, resultado) => {
                if (erro) reject([500, erro]);
                else resolve([200, resultado]);
            });
        });
    }

    pagarMesa(mesa) {
        return new Promise((resolve, reject) => {
            const sql = "UPDATE pedido SET status = 'pago' WHERE mesa = ? AND status != 'pago'";
            this.conexao.query(sql, [mesa], (erro, resultado) => {
                if (erro) reject([500, erro]);
                else resolve([200, { mensagem: `Comanda da mesa ${mesa} fechada com sucesso!` }]);
            });
        });
    }

    listarMesasAtivas() {
        return new Promise((resolve, reject) => {
            const sql = "SELECT DISTINCT mesa FROM pedido WHERE status != 'pago' ORDER BY mesa";
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
                p.data_hora,
                sc.nome AS item,
                ip.quantidade,
                (ip.quantidade * ip.preco) AS total_item
            FROM pedido p
            JOIN itens_pedido ip ON p.id_pedido = ip.pedido_id
            JOIN sub_cardapio sc ON ip.sub_cardapio_id = sc.id_sup_cardapio
            WHERE p.data_hora BETWEEN ? AND ?
              AND p.status = 'pago'
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
