import React from 'react';

function CarrinhoFlutuante({ pedido, alterarQuantidade, enviarPedido }) {
  if (!pedido || pedido.itens.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: '#fff',
      borderTop: '1px solid #ccc',
      padding: '10px',
      zIndex: 1000,
      boxShadow: '0 -2px 10px rgba(0,0,0,0.1)'
    }}>
      <h6 className="mb-2">Carrinho</h6>
      {pedido.itens.map((item) => (
        <div key={item.sub_cardapio_id} className="d-flex justify-content-between align-items-center mb-2">
          <div style={{ fontSize: '14px' }}>
            {item.nome} x{item.quantidade}
          </div>
          <div>
            <button className="btn btn-sm btn-outline-danger me-1" onClick={() => alterarQuantidade(item.sub_cardapio_id, -1)}>-</button>
            <button className="btn btn-sm btn-outline-success" onClick={() => alterarQuantidade(item.sub_cardapio_id, 1)}>+</button>
          </div>
        </div>
      ))}
      <div className="d-flex justify-content-between mt-2">
        <strong>Total: R$ {pedido.total.toFixed(2)}</strong>
        <button className="btn btn-primary btn-sm" onClick={enviarPedido}>Enviar Pedido</button>
      </div>
    </div>
  );
}

export default CarrinhoFlutuante;
