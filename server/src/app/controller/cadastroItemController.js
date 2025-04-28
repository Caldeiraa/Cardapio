const CadastroProdMercado = require("../model/cadastroItem");

class CadastroPMercadoController {
    create(req, res) {
        const { nome_item, preco_item, descricao_item, cardapio_id } = req.body;
    
        // Verifique se todos os dados necessários estão presentes
        if (!nome_item || !preco_item || !descricao_item || !cardapio_id) {
            console.error("Erro: Dados faltando na requisição.", {
                nome_item, 
                preco_item, 
                descricao_item, 
                cardapio_id
            });
            return res.status(400).json({ error: 'Requisição inválida. Dados faltando.' });
        }
    
        // Verificando o arquivo de imagem
        let foto_item = req.files && req.files.foto_item ? req.files.foto_item.name : null;
    
        if (foto_item) {
            foto_item = foto_item.split(".");
            let extensao = foto_item[foto_item.length - 1];
    
            // Verificando se a extensão do arquivo é permitida
            if (extensao === "jpg" || extensao === "png" || extensao === "JPEG") {
                foto_item = new Date().getTime() + "." + extensao;
                let arquivo = req.files.foto_item;
    
                // Inserindo os dados no banco de dados
                CadastroProdMercado.inserir(nome_item, preco_item, foto_item, descricao_item, cardapio_id, arquivo)
                    .then(resposta => {
                        console.log("Item inserido com sucesso:", resposta);
                        res.status(resposta[0]).json(resposta[1]);
                    })
                    .catch(error => {
                        console.error("Erro ao inserir no banco de dados:", error);
                        res.status(500).json({ error: "Erro ao inserir no banco de dados." });
                    });
            } else {
                console.error("Erro: Arquivo não suportado. Extensão do arquivo:", extensao);
                res.status(415).json({ alert: "Arquivo não suportado" });
            }
        } else {
            // Se não houver imagem, insere os dados sem a foto
            CadastroProdMercado.inserir(nome_item, preco_item, null, descricao_item, cardapio_id)
                .then(resposta => {
                    console.log("Item inserido sem foto:", resposta);
                    res.status(resposta[0]).json(resposta[1]);
                })
                .catch(error => {
                    console.error("Erro ao inserir no banco de dados (sem foto):", error);
                    res.status(500).json({ error: "Erro ao inserir no banco de dados." });
                });
        }
    }
    
}

module.exports = new CadastroPMercadoController();
