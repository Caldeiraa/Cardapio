import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function SubCardapio() {
  const { id_cardapio } = useParams();
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    async function carregarSubCardapio() {
      try {
        const resposta = await fetch(`http://localhost:3000/subCategoria/${id_cardapio}`);
          if (!resposta.ok) {
          throw new Error(`Erro na requisição: ${resposta.status}`);
        }
        const dados = await resposta.json();
        setProdutos(dados);
      } catch (error) {
        setErro(error.message);
      } finally {
        setLoading(false);
      }
    }

    carregarSubCardapio();
  }, [id_cardapio]);

  if (loading) {
    return <div className="text-center mt-5">Carregando...</div>;
  }

  if (erro) {
    return <div className="text-danger text-center mt-5">Erro: {erro}</div>;
  }

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">Subcardápio</h1>
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {produtos.map((produto, index) => (
          <div className="col" key={index}>
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{produto.nome}</h5>
                <p className="card-text">
                  <strong>Descrição:</strong> {produto.descricao_prod}
                </p>
                <p className="card-text">
                  <strong>Preço:</strong> R$ {parseFloat(produto.preco).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SubCardapio;
