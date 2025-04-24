import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function SubCardapio() {
  const { id_cardapio } = useParams();
  const [produtos, setProdutos] = useState([]);
  const [quantidades, setQuantidades] = useState({});
  const [nomeCliente, setNomeCliente] = useState('');
  const [mesa, setMesa] = useState('');
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    async function carregarSubCardapio() {
      try {
        const resposta = await fetch(`http://localhost:3000/subCategoria/${id_cardapio}`);
        if (!resposta.ok) throw new Error(`Erro na requisição: ${resposta.status}`);
        const dados = await resposta.json();
        setProdutos(dados);
        const inicial = {};
        dados.forEach((item) => {
          inicial[item.id_sup_cardapio] = 0;
        });
        setQuantidades(inicial);
      } catch (error) {
        setErro(error.message);
      } finally {
        setLoading(false);
      }
    }

    carregarSubCardapio();
  }, [id_cardapio]);

  const alterarQuantidade = (id, delta) => {
    setQuantidades((prev) => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + delta),
    }));
  };

  const calcularTotal = () => {
    return produtos.reduce((total, produto) => {
      const qtd = quantidades[produto.id_sup_cardapio] || 0;
      return total + qtd * parseFloat(produto.preco);
    }, 0).toFixed(2);
  };

  const enviarPedido = async () => {
    const itensSelecionados = produtos
      .filter((produto) => quantidades[produto.id_sup_cardapio] > 0)
      .map((produto) => ({
        sub_cardapio_id: produto.id_sup_cardapio,
        quantidade: quantidades[produto.id_sup_cardapio],
        preco: produto.preco,
      }));

    const pedido = {
      nome_cliente: nomeCliente,
      mesa: mesa,
      itens: itensSelecionados,
      total: calcularTotal(),
    };

    try {
      const resposta = await fetch('http://localhost:3000/pedido', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pedido),
      });

      const resultado = await resposta.json();
      if (resposta.ok) {
        alert("Pedido enviado com sucesso!");
        setQuantidades({});
        setNomeCliente('');
        setMesa('');
      } else {
        alert("Erro ao enviar pedido: " + resultado);
      }
    } catch (erro) {
      alert("Erro de rede: " + erro.message);
    }
  };

  if (loading) return <div className="text-center mt-5">Carregando...</div>;
  if (erro) return <div className="text-danger text-center mt-5">Erro: {erro}</div>;

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">Subcardápio</h1>

      <div className="row mb-4">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Nome do Cliente"
            value={nomeCliente}
            onChange={(e) => setNomeCliente(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Número da Mesa"
            value={mesa}
            onChange={(e) => setMesa(e.target.value)}
          />
        </div>
      </div>

      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {produtos.map((produto) => (
          <div className="col" key={produto.id_sup_cardapio}>
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{produto.nome}</h5>
                <p><strong>Descrição:</strong> {produto.descricao_prod}</p>
                <p><strong>Preço:</strong> R$ {parseFloat(produto.preco).toFixed(2)}</p>
                <div className="d-flex align-items-center gap-2">
                  <button onClick={() => alterarQuantidade(produto.id_sup_cardapio, -1)} className="btn btn-outline-danger btn-sm">-</button>
                  <span className="px-2">{quantidades[produto.id_sup_cardapio] || 0}</span>
                  <button onClick={() => alterarQuantidade(produto.id_sup_cardapio, 1)} className="btn btn-outline-success btn-sm">+</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 d-flex justify-content-between align-items-center">
        <h4>Total: R$ {calcularTotal()}</h4>
        <button
          className="btn btn-primary"
          onClick={enviarPedido}
          disabled={!nomeCliente || !mesa}
        >
          Enviar Pedido
        </button>
      </div>
    </div>
  );
}

export default SubCardapio;
