import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Index() {
  const [pedidos, setPedidos] = useState([]); // Estado para armazenar os pedidos
  const [loading, setLoading] = useState(true); // Estado para controle de loading

  useEffect(() => {
    // Função para buscar os dados da API
    const fetchPedidos = async () => {
      try {
        const response = await axios.get('http://localhost:3000/pedidos');
        setPedidos(response.data); // Atualiza o estado com os dados recebidos
      } catch (error) {
        console.error('Erro ao buscar os pedidos:', error);
      } finally {
        setLoading(false); // Finaliza o carregamento
      }
    };

    fetchPedidos();
  }, []); // O array vazio faz com que a requisição seja feita uma vez ao montar o componente

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Pedidos Realizados</h2>
      
      {loading ? (
        <div className="text-center">Carregando...</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>Nome Cliente</th>
                <th>Mesa</th>
                <th>Data/Hora</th>
                <th>Item</th>
                <th>Quantidade</th>
                <th>Preço</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((pedido, index) => (
                <tr key={index}>
                  <td>{pedido.nome_cliente}</td>
                  <td>{pedido.mesa}</td>
                  <td>{new Date(pedido.data_hora).toLocaleString()}</td>
                  <td>{pedido.item}</td>
                  <td>{pedido.quantidade}</td>
                  <td>R$ {pedido.preco}</td>
                  <td>R$ {(pedido.quantidade * parseFloat(pedido.preco)).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Index;
