import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import CarrinhoFlutuante from '../../components/carrinhoFlutuate';

function SubCardapioGarcom() {
  const { id_cardapio } = useParams();
  const navigate = useNavigate();
  const [produtos, setProdutos] = useState([]);
  const [pedido, setPedido] = useState({ nome_cliente: '', mesa: '', total: 0, itens: [] });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      if (decoded.usuario_tipo !== "g" && decoded.usuario_tipo !== "a") {
        navigate("/login");
        return;
      }
    } catch (error) {
      navigate("/login");
      return;
    }

    async function fetchProdutos() {
      const res = await fetch(`http://192.168.0.68:3000/subCategoria/${id_cardapio}`);
      const data = await res.json();
      setProdutos(data);
    }

    const pedidoSalvo = JSON.parse(localStorage.getItem("pedido_em_progresso"));
    if (pedidoSalvo) setPedido(pedidoSalvo);

    fetchProdutos();
  }, [id_cardapio]);

  const alterarQuantidade = (id, delta) => {
    const produto = produtos.find(p => p.id_sup_cardapio === id);
    if (!produto) return;

    const novaLista = [...pedido.itens];
    const index = novaLista.findIndex(item => item.sub_cardapio_id === id);

    if (index >= 0) {
      novaLista[index].quantidade += delta;
      if (novaLista[index].quantidade <= 0) novaLista.splice(index, 1);
    } else if (delta > 0) {
      novaLista.push({
        sub_cardapio_id: produto.id_sup_cardapio,
        nome: produto.nome,
        quantidade: 1,
        preco: parseFloat(produto.preco)
      });
    }

    const novoTotal = novaLista.reduce((acc, item) => acc + item.preco * item.quantidade, 0);
    const novoPedido = { ...pedido, itens: novaLista, total: novoTotal };
    setPedido(novoPedido);
    localStorage.setItem("pedido_em_progresso", JSON.stringify(novoPedido));
  };

  const enviarPedido = async () => {
    if (!pedido.nome_cliente || !pedido.mesa || pedido.itens.length === 0) {
      alert("Complete os dados do pedido!");
      return;
    }

    const res = await fetch("http://192.168.0.68:3000/pedido", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pedido)
    });

    if (res.ok) {
      alert("Pedido enviado!");
      setPedido({ nome_cliente: '', mesa: '', total: 0, itens: [] });
      localStorage.removeItem("pedido_em_progresso");
      navigate("/garcom/cardapio");
    } else {
      alert("Erro ao enviar pedido");
    }
  };

  return (
    <>
      <div className="container mt-3 mb-5 pb-5">
        <h4 className="text-center mb-3">Pedido do Garçom</h4>
        <div className="row mb-3">
          <div className="col-6">
            <input className="form-control" placeholder="Cliente" value={pedido.nome_cliente} onChange={(e) => setPedido({ ...pedido, nome_cliente: e.target.value })} />
          </div>
          <div className="col-6">
            <input className="form-control" placeholder="Mesa" value={pedido.mesa} onChange={(e) => setPedido({ ...pedido, mesa: e.target.value })} />
          </div>
        </div>

        <div className="row row-cols-1 row-cols-sm-2 g-3">
          {produtos.map((p) => {
            const qtd = pedido.itens.find(item => item.sub_cardapio_id === p.id_sup_cardapio)?.quantidade || 0;
            return (
              <div className="col" key={p.id_sup_cardapio}>
                <div className="card h-100">
                  <img
                    src={`http://192.168.0.68:3000/img/${p.imagem}`}
                    className="card-img-top"
                    alt={p.nome}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                  <div className="card-body p-2">
                    <h6 className="card-title">{p.nome}</h6>
                    <p className="card-text" style={{ fontSize: '12px' }}>{p.descricao_prod}</p>
                    <p><strong>R$ {parseFloat(p.preco).toFixed(2)}</strong></p>
                    <div className="d-flex align-items-center gap-2">
                      <button className="btn btn-sm btn-outline-danger" onClick={() => alterarQuantidade(p.id_sup_cardapio, -1)}>-</button>
                      <span>{qtd}</span>
                      <button className="btn btn-sm btn-outline-success" onClick={() => alterarQuantidade(p.id_sup_cardapio, 1)}>+</button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <CarrinhoFlutuante pedido={pedido} alterarQuantidade={alterarQuantidade} enviarPedido={enviarPedido} />
    </>
  );
}

export default SubCardapioGarcom;
