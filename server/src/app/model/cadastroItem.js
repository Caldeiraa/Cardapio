const mysql = require("mysql2");
const dbConfig = require("../config");
const path = require("path");

class CadastroProdMercado {
    constructor() {
        this.conexao = mysql.createConnection(dbConfig.db);
    }

    inserir(nome_item, preco_item, foto_item, descricao_item, cardapio_id, arquivo) {
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO sub_cardapio (nome, preco, imagem, descricao_prod, cardapio_id) VALUES (?, ?, ?, ?, ?)`;
            this.conexao.query(sql, [nome_item, preco_item, foto_item, descricao_item, cardapio_id], (erro, retorno) => {
                if (erro) {
                    reject([400, erro]);
                } else {
                    const caminho = path.join(__dirname, "..", "..", "Public", "img", foto_item);
                    arquivo.mv(caminho, (err) => {
                        if (err) {
                            reject([500, err]);
                        } else {
                            resolve([201, "Inserido"]);
                        }
                    });
                }
            });
        });
    }
}

module.exports = new CadastroProdMercado();
