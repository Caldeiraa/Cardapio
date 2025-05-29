const CadastroUsuario = require("../model/usuarios");
const jwt = require("jsonwebtoken");
const secret = "123";

class UsuarioController {
    async create(req, res) {
        const usuarios = await CadastroUsuario.listarUsuarios();

        /*if (usuarios[1].length > 0) {
            const token = req.headers['x-access-token'];
            if (!token) return res.status(401).json("Token não fornecido");

            try {
                const decoded = jwt.verify(token, secret);
                if (decoded.usuario_tipo !== 'a') {
                    return res.status(403).json("Acesso negado");
                }
            } catch (err) {
                return res.status(401).json("Token inválido");
            }
        }*/

        // Se for o primeiro cadastro ou admin logado, continua
        let { nome_usuario, tipo_usuario, login, senha } = req.body;

        CadastroUsuario.inserir(nome_usuario, tipo_usuario, login, senha)
            .then(resposta => res.status(resposta[0]).json(resposta[1]))
            .catch(resposta => res.status(resposta[0]).json("Erro: " + resposta[1].errno));
    }


    listar(req, res) {
        CadastroUsuario.listarUsuarios()
            .then(resposta => {
                res.status(resposta[0]).json(resposta[1]);
            })
            .catch(resposta => {
                res.status(resposta[0]).json("Erro: " + resposta[1].errno);
            });
    }



    logar(req, res) {
        let { login, senha } = req.body;

        CadastroUsuario.verificaUsuarioSenha(login, senha)
            .then(resposta => {
                if (resposta[0] === 200) {
                    let usuario_id = resposta[2];
                    let usuario_tipo = resposta[3];
                    let nome_user_usuario = resposta[4];

                    let token = jwt.sign(
                        { usuario_id, usuario_tipo, nome_user_usuario },
                        secret,
                        { expiresIn: 300 }
                    );

                    return res.status(200).json({ token });
                } else {
                    return res.status(resposta[0]).json({ erro: resposta[1] });
                }
            })
            .catch(resposta => {
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

    desativar(req, res) {
        let id_usuario = req.params.id_usuario;

        CadastroUsuario.desativarUsuario(id_usuario)
            .then(resposta => {
                res.status(resposta[0]).json(resposta[1]);
            })
            .catch(resposta => {
                res.status(resposta[0]).json("Erro: " + resposta[1].errno);
            });
    }

}

module.exports = new UsuarioController();
