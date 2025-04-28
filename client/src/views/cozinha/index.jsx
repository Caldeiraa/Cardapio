import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

function Index() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      if (decoded.usuario_tipo !== "c" && decoded.usuario_tipo !== "a") {
        navigate("/login"); // Se não for "c" nem "a", redireciona
        return;
      }
    } catch (error) {
      navigate("/login");
      return;
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
  }, [navigate]);

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
