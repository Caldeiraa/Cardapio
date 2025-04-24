import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function SubCardapioGarcom() {
  const { id_cardapio } = useParams();
  const [produtos, setProdutos] = useState([]);
  const [quantidades, setQuantidades] = useState({});
  const [nomeCliente, setNomeCliente] = useState('');
  const [mesa, setMesa] = useState('');

  useEffect(() => {

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Efetue login");
      window.location.href = "/login";
    } else {
      try {
        const decodedToken = jwtDecode(token);
        const usuario_id = decodedToken.usuario_id;
        console.log("Usuario ID:", usuario_id);
      } catch (error) {
        console.error("Erro ao decodificar token:", error);
        alert("Erro ao decodificar token");
        window.location.href = "/login";
      }
    }
    
    async function fetchProdutos() {
      const resposta = await fetch(`http://localhost:3000/subCategoria/${id_cardapio}`);
      const dados = await resposta.json();
      setProdutos(dados);
      const inicial = {};
      dados.forEach((item) => {
        inicial[item.id_sup_cardapio] = 0;
      });
      setQuantidades(inicial);
    }

    fetchProdutos();
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
      .filter((p) => quantidades[p.id_sup_cardapio] > 0)
      .map((p) => ({
        sub_cardapio_id: p.id_sup_cardapio,
        quantidade: quantidades[p.id_sup_cardapio],
        preco: p.preco,
      }));

    const pedido = {
      nome_cliente: nomeCliente,
      mesa,
      total: calcularTotal(),
      itens: itensSelecionados,
    };

    const resposta = await fetch("http://localhost:3000/pedido", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pedido)
    });

    const resultado = await resposta.json();
    if (resposta.ok) {
      alert("Pedido enviado!");
      setQuantidades({});
    } else {
      alert("Erro ao enviar pedido: " + resultado);
    }
  };

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">Pedido do Garçom</h1>
      <div className="row mb-3">
        <div className="col-md-6">
          <input className="form-control" placeholder="Nome do Cliente" value={nomeCliente} onChange={(e) => setNomeCliente(e.target.value)} />
        </div>
        <div className="col-md-6">
          <input className="form-control" placeholder="Mesa" value={mesa} onChange={(e) => setMesa(e.target.value)} />
        </div>
      </div>
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {produtos.map((produto) => (
          <div className="col" key={produto.id_sup_cardapio}>
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{produto.nome}</h5>
                <p>{produto.descricao_prod}</p>
                <p><strong>R$ {parseFloat(produto.preco).toFixed(2)}</strong></p>
                <div className="d-flex align-items-center gap-2">
                  <button className="btn btn-outline-danger btn-sm" onClick={() => alterarQuantidade(produto.id_sup_cardapio, -1)}>-</button>
                  <span>{quantidades[produto.id_sup_cardapio] || 0}</span>
                  <button className="btn btn-outline-success btn-sm" onClick={() => alterarQuantidade(produto.id_sup_cardapio, 1)}>+</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 d-flex justify-content-between">
        <h4>Total: R$ {calcularTotal()}</h4>
        <button className="btn btn-primary" onClick={enviarPedido} disabled={!nomeCliente || !mesa}>Enviar Pedido</button>
      </div>
    </div>
  );
}

export default SubCardapioGarcom;
