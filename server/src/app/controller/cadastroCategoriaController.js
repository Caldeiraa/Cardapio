const CadastroCategoria = require('../model/CadastroCategoria');

class CadastroCategoriaController {
  async create(req, res) {
    let nome_categoria = req.body.nome_categoria;
    let imagem = req.files.imagem.name;

    imagem = imagem.split(".");
    let extensao = imagem[imagem.length - 1];

    if (["jpg", "jpeg", "png"].includes(extensao)) {
      imagem = new Date().getTime() + "." + extensao;
      let arquivo = req.files.imagem;

      try {
        const resposta = await CadastroCategoria.inserir(nome_categoria, imagem, arquivo);
        res.status(resposta[0]).json(resposta[1]);
      } catch (erro) {
        console.debug(erro);
        res.status(erro[0]).json("Erro: " + erro[1].errno);
      }
    } else {
      res.status(415).json({ alert: "Arquivo não suportado" });
    }
  }

  async listar(req, res) {
    try {
      const categorias = await CadastroCategoria.listarCategorias();
      res.status(categorias[0]).json(categorias[1]);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao listar as categorias.' });
    }
  }
}

module.exports = new CadastroCategoriaController();
