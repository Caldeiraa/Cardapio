const mysql = require("mysql2")
const dbConfig = require("../config")

const caminhoServer = require("path")

class SubCardapio{
    constructor(){
        this.conexao = mysql.createConnection(dbConfig.db)
    }
    mostrar(id_cardapio) {
        return new Promise((resolve, reject) => {
            let sql = `SELECT * FROM sub_cardapio WHERE cardapio_id = ${id_cardapio} AND ativo = true ;`
            
            this.conexao.query(sql, function(erro, resultado) {
                if (erro) {
                    reject([400, erro]);
                } else {
                    resolve([200, resultado]);
                }
            });
        });
    }
    
}

module.exports = new SubCardapio()