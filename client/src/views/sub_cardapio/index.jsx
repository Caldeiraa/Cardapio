import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function SubCardapio() {
  const { id_cardapio } = useParams();
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    async function fetchProdutos() {
      try {
        console.log("ID do cardápio recebido:", id_cardapio);

        const resposta = await fetch(`http://localhost:3000/subCategoria/${id_cardapio}`);
        const dados = await resposta.json();

        console.log("Resposta da API:", dados);

        // Garante que dados seja um array antes de setar
        if (Array.isArray(dados)) {
          setProdutos(dados);
        } else {
          setProdutos([]);
          console.warn("Resposta não é um array. Verifique o formato da resposta.");
        }
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
        setProdutos([]);
      }
    }

    if (id_cardapio) {
      fetchProdutos();
    }
  }, [id_cardapio]);

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">Produtos da Categoria</h1>
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
        {produtos.map((produto) => (
          <div className="col" key={produto.id_sup_cardapio}>
            <div className="card h-100">
              <img
                src={`http://localhost:3000/img/${produto.imagem}`}
                className="card-img-top"
                alt={produto.nome}
                style={{ height: '200px', objectFit: 'cover' }}
              />
              <div className="card-body">
                <h5 className="card-title">{produto.nome}</h5>
                <p className="card-text">{produto.descricao_prod}</p>
                <p className="card-text fw-bold">R$ {parseFloat(produto.preco).toFixed(2)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SubCardapio;
