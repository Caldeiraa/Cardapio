const mysql = require("mysql2");
const path = require("path");
const dbConfig = require("../config");

class CadastroItem {
  constructor() {
    this.conexao = mysql.createConnection(dbConfig.db);
  }

  // Inserir item
  inserir(nome_item, preco_item, foto_item, descricao_item, cardapio_id, arquivo) {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO sub_cardapio (nome, preco, imagem, descricao_prod, cardapio_id) 
        VALUES (?, ?, ?, ?, ?)
      `;

      this.conexao.query(sql, [nome_item, preco_item, foto_item, descricao_item, cardapio_id], (erro, retorno) => {
        if (erro) {
          reject([400, erro]); // erro
        } else {
          // Movendo a imagem para o diretório correto
          arquivo.mv(path.resolve(__dirname, '../Public/img', foto_item), (err) => {
            if (err) reject([500, 'Erro ao mover o arquivo']);
          });
          resolve([201, "Item Inserido com sucesso"]);
        }
      });
    });
  }

  // Listar todos os itens
  listarItens() {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM sub_cardapio ';
      this.conexao.query(sql, (erro, resultado) => {
        if (erro) {
          reject([500, erro]);
        } else {
          resolve([200, resultado]);
        }
      });
    });
  }

  // Ativar item
  ativarItem(id_sub_cardapio) {
    return new Promise((resolve, reject) => {
      const sql = 'UPDATE sub_cardapio SET ativo = true WHERE id_sup_cardapio = ?';
      this.conexao.query(sql, [id_sub_cardapio], (erro, resultado) => {
        if (erro) reject([500, erro]);
        else resolve([200, "Item ativado com sucesso"]);
      });
    });
  }

  // Desativar item
  desativarItem(id_sub_cardapio) {
    return new Promise((resolve, reject) => {
      const sql = 'UPDATE sub_cardapio SET ativo = false WHERE id_sup_cardapio = ?';
      this.conexao.query(sql, [id_sub_cardapio], (erro, resultado) => {
        if (erro) reject([500, erro]);
        else resolve([200, "Item desativado com sucesso"]);
      });
    });
  }
}

module.exports = new CadastroItem();
