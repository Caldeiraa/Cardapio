import React, { useState } from 'react';
import { FaMinus, FaPlus, FaTrash, FaShoppingCart, FaTimes } from 'react-icons/fa';

function CarrinhoFlutuante({ pedido, alterarQuantidade, removerItem, enviarPedido }) {
  const [aberto, setAberto] = useState(false);

  if (!pedido || pedido.itens.length === 0) {
    return (
      <button
        onClick={() => setAberto(true)}
        className="btn btn-primary"
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 1001,
          borderRadius: '50%',
          padding: '15px',
        }}
      >
        <FaShoppingCart />
      </button>
    );
  }

  return (
    <div>
      {!aberto ? (
        <button
          onClick={() => setAberto(true)}
          className="btn btn-primary"
          style={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            zIndex: 1001,
            borderRadius: '50%',
            padding: '15px',
          }}
        >
          <FaShoppingCart />
        </button>
      ) : (
        <div style={{
          position: 'fixed',
          bottom: 0,
          right: 0,
          left: 0,
          background: '#fff',
          borderTop: '1px solid #ccc',
          padding: '15px',
          zIndex: 1000,
          boxShadow: '0 -2px 10px rgba(0,0,0,0.2)',
          maxHeight: '50vh',
          overflowY: 'auto'
        }}>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h6 className="mb-0">Carrinho</h6>
            <button className="btn btn-sm btn-outline-secondary" onClick={() => setAberto(false)}>
              <FaTimes />
            </button>
          </div>

          {pedido.itens.map((item) => (
            <div key={item.sub_cardapio_id} className="d-flex justify-content-between align-items-center mb-2 border-bottom pb-2">
              <div>
                <strong>{item.nome}</strong><br />
                <small>Quantidade: {item.quantidade}</small>
              </div>
              <div className="d-flex align-items-center">
                <button className="btn btn-sm btn-outline-danger me-1" onClick={() => alterarQuantidade(item.sub_cardapio_id, -1)}>
                  <FaMinus />
                </button>
                <button className="btn btn-sm btn-outline-success me-1" onClick={() => alterarQuantidade(item.sub_cardapio_id, 1)}>
                  <FaPlus />
                </button>
                <button className="btn btn-sm btn-outline-dark" onClick={() => removerItem(item.sub_cardapio_id)}>
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}

          <div className="d-flex justify-content-between mt-3">
            <strong>Total: R$ {pedido.total.toFixed(2)}</strong>
            <button className="btn btn-primary btn-sm" onClick={enviarPedido}>Enviar Pedido</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CarrinhoFlutuante;
