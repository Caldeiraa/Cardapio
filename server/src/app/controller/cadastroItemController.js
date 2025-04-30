const CadastroItem = require('../model/CadastroItem'); // ajuste o path se preciso

class CadastroItemController{
    create(req, res) {
        let nome_item = req.body.nome_item;
        let preco_item = req.body.preco_item;
        let foto_item = req.files.foto_item.name;
        let descricao_item = req.body.descricao_item;
        let cardapio_id = req.body.cardapio_id;
        
        foto_item = foto_item.split(".");
        let extensao = foto_item[foto_item.length - 1];
    
        if (extensao === "jpg" || extensao === "png" || extensao === "jpeg") {
            foto_item = new Date().getTime() + "." + extensao;
            let arquivo = req.files.foto_item;
  
            CadastroItem.inserir(nome_item, preco_item, foto_item, descricao_item, cardapio_id, arquivo).then(resposta => {
                res.status(resposta[0]).json(resposta[1]);
            }).catch(resposta => {
                console.debug(resposta[1]);
                res.status(resposta[0]).json("Erro: " + resposta[1].errno);
            });
        } else {
            res.status(415).json({ alert: "Arquivo não suportado" });
        }
    }
    
};
module.exports = new CadastroItemController()