const mysql = require("mysql2");
const dbConfig = require("../config");
const bcrypt = require('bcrypt');

class CadastroUsuario {
    constructor() {
        this.conexao = mysql.createConnection(dbConfig.db);
    }

    inserir(nome_usuario, tipo_usuario, login, senha) {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(senha, salt);

        return new Promise((resolve, reject) => {
            const sql = `
                INSERT INTO usuario (nome_usuario, tipo_usuario, login, senha)
                VALUES (?, ?, ?, ?)
            `;
            this.conexao.query(sql, [nome_usuario, tipo_usuario, login, hash], (erro, retorno) => {
                if (erro) reject([400, erro]);
                resolve([201, "Inserido"]);
            });
        });
    }

    verificaUsuarioSenha(login, senha) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM usuario WHERE login = ?';
    
            this.conexao.query(sql, [login], (erro, resultado) => {
                if (erro) {
                    reject([400, erro]);
                } else if (resultado.length === 0) {
                    resolve([401, "Usuário ou senha inválidos"]);
                } else {
                    const usuario = resultado[0];
    
                    if (!usuario.ativo) {
                        return resolve([403, "Usuário desativado."]);
                    }
    
                    const senhaCorreta = bcrypt.compareSync(senha, usuario.senha);
    
                    if (senhaCorreta) {
                        resolve([
                            200,
                            "Logado com sucesso",
                            usuario.id_usuario,
                            usuario.tipo_usuario,
                            usuario.nome_usuario
                        ]);
                    } else {
                        resolve([401, "Usuário ou senha inválidos"]);
                    }
                }
            });
        });
    }
    
    desativarUsuario(id_usuario) {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE usuario SET ativo = false WHERE id_usuario = ?';
            this.conexao.query(sql, [id_usuario], (erro, resultado) => {
                if (erro) reject([400, erro]);
                else resolve([200, "Usuário desativado com sucesso"]);
            });
        });
    }
    listarUsuarios() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT id_usuario, nome_usuario, tipo_usuario, login, ativo FROM usuario';
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

module.exports = new CadastroUsuario();
