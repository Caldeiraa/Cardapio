const mysql = require("mysql2");
const path = require("path");
const dbConfig = require("../config");

class CadastroCategoria {
  constructor() {
    this.conexao = mysql.createConnection(dbConfig.db);
  }

  inserir(nome_categoria, imagem, arquivo) {
    return new Promise((resolve, reject) => {
      const sql = `INSERT INTO cardapio (nome_item, imagem_item) VALUES (?, ?)`;

      this.conexao.query(sql, [nome_categoria, imagem], (erro, resultado) => {
        if (erro) {
          reject([400, erro]);
        } else {
          // Move a imagem para a pasta pública
          arquivo.mv(path.resolve(__dirname, '../../../Public/img', imagem), (err) => {
            if (err) reject([500, 'Erro ao mover o arquivo']);
          });

          resolve([201, "Categoria inserida com sucesso"]);
        }
      });
    });
  }

  listarCategorias() {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM cardapio';
      this.conexao.query(sql, (erro, resultado) => {
        if (erro) {
          reject([500, erro]);
        } else {
          resolve([200, resultado]);
        }
      });
    });
  }
}

module.exports = new CadastroCategoria();
