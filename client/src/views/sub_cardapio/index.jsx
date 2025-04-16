import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './subCardapio.css';

function SubCardapio() {
  const { id_cardapio } = useParams();
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    async function carregarSubCardapio() {
      try {
        const resposta = await fetch(`http://localhost:3000/subCategoria/${id_cardapio}`);
        const respostaClone = resposta.clone(); // Cria uma cópia do fluxo da resposta
        const dados = await respostaClone.json(); // Lê o corpo da resposta
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
    return <div>Carregando...</div>;
  }

  if (erro) {
    return <div>Erro: {erro}</div>;
  }

  return (
    <div className="subcardapio-container">
      <h1>Subcardápio</h1>
      <div className="produtos-lista">
        {produtos.map((produto, index) => {
          const chaveUnica = produto.id_produto || `produto-${index}`;
          return (
            <div key={chaveUnica} className="produto-card">
              <img
                src={`http://localhost:3000/img/${produto.foto_produto}`}
                alt={produto.nome_produto}
                className="produto-imagem"
              />
              <h2>{produto.nome_produto}</h2>
              <p><strong>Descrição:</strong> {produto.descricao_produto}</p>
              <p><strong>Preço:</strong> R$ {produto.preco_produto}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SubCardapio;
