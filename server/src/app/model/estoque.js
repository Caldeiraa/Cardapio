const mysql = require("mysql2");
const dbConfig = require("../config");

class Estoque {
    constructor() {
        this.conexao = mysql.createConnection(dbConfig.db);
    }

    listarIngredientes() {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM ingredientes";
            this.conexao.query(sql, (erro, resultado) => {
                if (erro) reject([500, erro]);
                else resolve([200, resultado]);
            });
        });
    }

    listarReceita() {
        return new Promise((resolve, reject) => {
            const sql = `SELECT 
    p.nome AS produto,
    i.nome AS ingrediente,
    r.quantidade,
    i.unidade
FROM receita r
JOIN sub_cardapio p ON r.sub_cardapio_id = p.id_sup_cardapio
JOIN ingredientes i ON r.ingrediente_id = i.id_ingrediente;`
            this.conexao.query(sql, (erro, resultado) => {
                if (erro) reject([500, erro]);
                else resolve([200, resultado]);
            });
        });
    }

    inserirIngrediente(nome, unidade, quantidade, minimo) {
        return new Promise((resolve, reject) => {
            const sql = `
                INSERT INTO ingredientes (nome, unidade, quantidade, minimo)
                VALUES (?, ?, ?, ?)
            `;
            this.conexao.query(sql, [nome, unidade, quantidade, minimo], (erro) => {
                if (erro) reject([400, erro]);
                else resolve([201, "Ingrediente cadastrado"]);
            });
        });
    }

    // 🔥 BAIXA AUTOMÁTICA
    baixarEstoque(pedidoId) {
        return new Promise((resolve, reject) => {
            const sqlItens = `
                SELECT * FROM itens_pedido WHERE pedido_id = ?
            `;

            this.conexao.query(sqlItens, [pedidoId], (erro, itens) => {
                if (erro) return reject([500, erro]);

                let promises = [];

                itens.forEach(item => {
                    const sqlReceita = `
                        SELECT * FROM receita WHERE sub_cardapio_id = ?
                    `;

                    const p = new Promise((res, rej) => {
                        this.conexao.query(sqlReceita, [item.sub_cardapio_id], (erro, receitas) => {
                            if (erro) return rej(erro);

                            let updates = receitas.map(r => {
                                return new Promise((rslv, rjct) => {
                                    const sqlUpdate = `
                                        UPDATE ingredientes 
                                        SET quantidade = quantidade - (? * ?)
                                        WHERE id_ingrediente = ?
                                    `;
                                    this.conexao.query(
                                        sqlUpdate,
                                        [r.quantidade, item.quantidade, r.ingrediente_id],
                                        (erro) => {
                                            if (erro) rjct(erro);
                                            else rslv();
                                        }
                                    );
                                });
                            });

                            Promise.all(updates).then(res).catch(rej);
                        });
                    });

                    promises.push(p);
                });

                Promise.all(promises)
                    .then(() => resolve([200, "Estoque atualizado"]))
                    .catch(err => reject([500, err]));
            });
        });
    }

    verificarEstoqueBaixo() {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT * FROM ingredientes 
                WHERE quantidade <= minimo
            `;
            this.conexao.query(sql, (erro, resultado) => {
                if (erro) reject([500, erro]);
                else resolve([200, resultado]);
            });
        });
    }

    buscarProdId(id_categoria) {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT * FROM sub_cardapio 
                WHERE cardapio_id = ?
            `;

            this.conexao.query(sql, [id_categoria], (erro, resultado) => {
                if (erro) reject([500, erro]);
                else resolve([200, resultado]);
            });
        });
    }

    // NOVO: Método para ligar o Produto ao Ingrediente (cadastrar a Receita)
    // 🔥 NOVO: Método que salva vários ingredientes de uma vez
    inserirReceitaEmLote(sub_cardapio_id, listaIngredientes) {
        return new Promise((resolve, reject) => {
            
            // Cria uma array de Promises para cada insert no banco
            let promessas = listaIngredientes.map(item => {
                return new Promise((res, rej) => {
                    const sql = `
                        INSERT INTO receita (sub_cardapio_id, ingrediente_id, quantidade)
                        VALUES (?, ?, ?)
                    `;
                    this.conexao.query(sql, [sub_cardapio_id, item.ingrediente_id, item.quantidade], (erro) => {
                        if (erro) rej(erro);
                        else res();
                    });
                });
            });

            // Executa todas as inserções
            Promise.all(promessas)
                .then(() => resolve([201, { mensagem: "Receita completa salva com sucesso!" }]))
                .catch((erro) => reject([500, { erro: "Falha ao gravar receita", detalhes: erro }]));
        });
    }
}

module.exports = new Estoque();