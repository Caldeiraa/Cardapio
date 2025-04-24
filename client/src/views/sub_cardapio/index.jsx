import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function SubCardapio() {
  const { id_cardapio } = useParams();
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    async function fetchProdutos() {
      const resposta = await fetch(`http://localhost:3000/subCategoria/${id_cardapio}`);
      const dados = await resposta.json();
      setProdutos(dados);
    }

    fetchProdutos();
  }, [id_cardapio]);

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">Cardápio</h1>
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {produtos.map((produto) => (
          <div className="col" key={produto.id_sup_cardapio}>
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{produto.nome}</h5>
                <p>{produto.descricao_prod}</p>
                <p><strong>R$ {parseFloat(produto.preco).toFixed(2)}</strong></p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SubCardapio;
