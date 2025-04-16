const SubCardapio = require("../model/subCardapio")

class SubCategoriaController{

    index(req,res){
        let {id_cardapio} = req.params
        if (isNaN(id_cardapio)) {
            return res.status(400).json("ID inválido");
        }        
        SubCardapio.mostrar(id_cardapio).then(resposta=>{
            
            res.status(resposta[0]).json(resposta[1])
        }).catch(
            resposta =>{
                res.status(resposta[0]).json("Erro: "+resposta[1].errno)
            }
        )
    }
    
}

module.exports = new SubCategoriaController()