const CadastroUsuario = require("../model/usuarios");
const jwt = require("jsonwebtoken");
const secret = "123";

class UsuarioController {
    create(req, res) {
        console.log(req.body);
        let { nome_usuario, tipo_usuario, login, senha } = req.body;

        CadastroUsuario.inserir(nome_usuario, tipo_usuario, login, senha)
            .then(resposta => {
                res.status(resposta[0]).json(resposta[1]);
            })
            .catch(resposta => {
                console.debug(resposta[1]);
                res.status(resposta[0]).json("Erro: " + resposta[1].errno);
            });
    }

    /*index(req,res){
        CadastroUsuario.mostrarTodos()
            .then(resposta => {
                console.log(resposta[1]);
                res.status(resposta[0]).json(resposta[1]);
            })
            .catch(resposta => {
                res.status(resposta[0]).json("Erro: " + resposta[1].errno);
            });
    }

    update(req,res){
        let id_usuario = parseInt(req.params.id_usuario);
        let nome_usuario = req.body.nome_usuario;

        console.debug("PUT :: /usuarios/:id");
        CadastroUsuario.atualizar(nome_usuario,id_usuario)
            .then(resposta => {
                res.status(resposta[0]).json(resposta[1]);
            })
            .catch(resposta => {
                res.status(resposta[0]).json("Erro: " + resposta[1].errno);
            });
    }

    destroy(req,res){
        let id_usuario = req.params.id_usuario;

        console.debug(id_usuario);
        CadastroUsuario.deletar(id_usuario)
            .then(resposta => {
                res.status(resposta[0]).json(resposta[1]);
            })
            .catch(resposta => {
                res.status(resposta[0]).json("Erro: " + resposta[1].errno);
            });
    }*/

    logar(req, res) {
        let { login, senha } = req.body;

        CadastroUsuario.verificaUsuarioSenha(login, senha)
            .then(resposta => {
                let usuario_id = resposta[2];
                let usuario_tipo = resposta[3];
                let nome_user_usuario = resposta[4];
                let token = '';

                if (resposta[0] === 200) {
                    token = jwt.sign(
                        { usuario_id, usuario_tipo, nome_user_usuario },
                        secret,
                        { expiresIn: 300 }
                    );
                }

                res.status(resposta[0]).json({ token });
            })
            .catch(resposta => {
                console.debug(resposta);
                res.status(resposta[0]).json("erro: " + resposta[1]);
            });
    }

    verificaToken(req, res, next) {
        const token = req.headers['x-access-token'];

        jwt.verify(token, secret, (erro, decoded) => {
            if (erro) {
                return res.status(401).json("Usuário não autenticado");
            } else {
                req.usuario_id = decoded.usuario_id;
                req.usuario_tipo = decoded.usuario_tipo;

                CadastroUsuario.buscarNomeUsuario(decoded.usuario_id)
                    .then(nomeUsuario => {
                        res.status(200).json({ nome_usuario: nomeUsuario });
                    })
                    .catch(error => {
                        console.error("Erro ao buscar nome do usuário:", error);
                        res.status(500).json("Erro ao buscar nome do usuário");
                    });
            }
        });
    }

    /*recuperarSenha(req,res){
      
    }*/
}

module.exports = new UsuarioController();
