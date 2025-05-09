const CadastroItem = require('../model/CadastroItem'); // ajuste o path se preciso

class CadastroItemController {
  // Criar novo item
  async create(req, res) {
    let nome_item = req.body.nome_item;
    let preco_item = req.body.preco_item;
    let foto_item = req.files.foto_item.name;
    let descricao_item = req.body.descricao_item;
    let cardapio_id = req.body.cardapio_id;

    // Validar a extensão do arquivo
    foto_item = foto_item.split(".");
    let extensao = foto_item[foto_item.length - 1];

    if (extensao === "jpg" || extensao === "png" || extensao === "jpeg") {
      foto_item = new Date().getTime() + "." + extensao; // Renomeando a imagem para garantir que não haja conflito de nomes

      let arquivo = req.files.foto_item;

      try {
        const resposta = await CadastroItem.inserir(nome_item, preco_item, foto_item, descricao_item, cardapio_id, arquivo);
        res.status(resposta[0]).json(resposta[1]);
      } catch (erro) {
        console.debug(erro);
        res.status(erro[0]).json("Erro: " + erro[1].errno);
      }
    } else {
      res.status(415).json({ alert: "Arquivo não suportado" });
    }
  }

  // Listar todos os itens
  async listar(req, res) {
    try {
      const itens = await CadastroItem.listarItens();
      res.json(itens);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao listar os itens.' });
    }
  }

  // Ativar um item
  async ativar(req, res) {
    try {
      await CadastroItem.ativarItem(req.params.id);
      res.json({ message: 'Item ativado com sucesso.' });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao ativar item.' });
    }
  }

  // Desativar um item
  async desativar(req, res) {
    try {
      await CadastroItem.desativarItem(req.params.id);
      res.json({ message: 'Item desativado com sucesso.' });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao desativar item.' });
    }
  }
}

module.exports = new CadastroItemController();
