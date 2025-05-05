import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importando o Bootstrap
import './Pedidos.css'
function Index() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    try {
      const decoded = jwtDecode(token);
      if (decoded.usuario_tipo !== "c" && decoded.usuario_tipo !== "a") {
        return navigate("/login");
      }
    } catch {
      return navigate("/login");
    }

    const fetchPedidos = async () => {
      try {
        const response = await axios.get('http://localhost:3000/pedidos');
        setPedidos(response.data);
      } catch (error) {
        console.error('Erro ao buscar os pedidos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPedidos();
    const interval = setInterval(fetchPedidos, 5000);
    return () => clearInterval(interval);
  }, [navigate]);

  const marcarItemComoPronto = async (id_item, id_pedido) => {
    try {
      await axios.put(`http://localhost:3000/itens-pedido/${id_item}/preparar`);

      setPedidos(prev =>
        prev.map(p =>
          p.id_item === id_item ? { ...p, preparado: true } : p
        )
      );

      const itensDoPedido = pedidos.filter(p => p.id_pedido === id_pedido);
      const todosPreparados = itensDoPedido.every(p =>
        p.id_item === id_item ? true : p.preparado
      );

      if (todosPreparados) {
        await axios.put(`http://localhost:3000/pedidos/${id_pedido}/preparar`);
        setPedidos(prev => prev.filter(p => p.id_pedido !== id_pedido));
      }
    } catch (error) {
      console.error('Erro ao marcar item como preparado:', error);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center">Pedidos Realizados</h2>

      {loading ? (
        <div className="text-center">Carregando...</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-striped table-hover">
            <thead className="thead-dark">
              <tr>
                <th>Cliente</th>
                <th>Mesa</th>
                <th>Data/Hora</th>
                <th>Item</th>
                <th>Qtd</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((pedido, index) => (
                <tr key={index} className={pedido.preparado ? 'table-success' : ''}>
                  <td>{pedido.nome_cliente}</td>
                  <td>{pedido.mesa}</td>
                  <td>{new Date(pedido.data_hora).toLocaleString()}</td>
                  <td>{pedido.item}</td>
                  <td>{pedido.quantidade}</td>
                  <td>
                    {pedido.preparado ? (
                      <span className="badge badge-success">Pronto</span>
                    ) : (
                      <button
                        className="btn btn-success"
                        onClick={() => marcarItemComoPronto(pedido.id_item, pedido.id_pedido)}
                      >
                        Marcar como Pronto
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {pedidos.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center text-muted">Nenhum pedido pendente</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Index;
