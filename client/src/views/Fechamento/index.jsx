import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const formatDate = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}:00`;
};

function FechamentoCaixa() {
  const [pedidos, setPedidos] = useState([]);
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalFinal, setTotalFinal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");
    try {
      const decoded = jwtDecode(token);
      if (decoded.usuario_tipo !== "a") return navigate("/login");
    } catch {
      return navigate("/login");
    }

    if (dataInicio && dataFim) fetchPedidos();
  }, [dataInicio, dataFim]);

  const fetchPedidos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:3000/fechamento-caixa', {
        params: {
          inicio: formatDate(dataInicio),
          fim: formatDate(dataFim)
        }
      });

      if (response.data.length === 0) {
        setError('Nenhum pedido encontrado.');
      } else {
        setPedidos(response.data);
        const total = response.data.reduce((acc, pedido) => acc + pedido.total_item, 0);
        setTotalFinal(total);
      }
    } catch (err) {
      console.error(err);
      setError('Erro ao buscar pedidos.');
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = () => {
    if (pedidos.length === 0) return alert("Nenhum dado para exportar.");
    const wsData = [
      ["ID Pedido", "Cliente", "Mesa", "Data/Hora", "Item", "Qtd", "Total (R$)"],
      ...pedidos.map(p => [
        p.id_pedido,
        p.nome_cliente,
        p.mesa,
        new Date(p.data_hora).toLocaleString(),
        p.item,
        p.quantidade,
        Number(p.total_item).toFixed(2)
      ]),
      ["", "", "", "", "", "Total Geral", totalFinal.toFixed(2)]
    ];

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Fechamento");
    XLSX.writeFile(wb, "fechamento_caixa.xlsx");
  };

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4">📊 Fechamento de Caixa</h2>

      <div className="row g-3 mb-4">
        <div className="col-md-5">
          <label className="form-label">Início</label>
          <input
            type="datetime-local"
            className="form-control"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
          />
        </div>
        <div className="col-md-5">
          <label className="form-label">Fim</label>
          <input
            type="datetime-local"
            className="form-control"
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
          />
        </div>
        <div className="col-md-2 d-grid align-items-end">
          <button className="btn btn-primary" onClick={fetchPedidos} disabled={loading}>
            {loading ? "Buscando..." : "Buscar"}
          </button>
        </div>
      </div>

      {error && <div className="alert alert-warning text-center">{error}</div>}

      <div className="text-end mb-3">
        <button className="btn btn-success" onClick={exportToExcel} disabled={pedidos.length === 0}>
          📁 Exportar para Excel
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th>Cliente</th>
              <th>Mesa</th>
              <th>Data/Hora</th>
              <th>Total (R$)</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.length > 0 ? (
              pedidos.map((pedido, index) => (
                <tr key={index}>
                  <td>{pedido.nome_cliente}</td>
                  <td>{pedido.mesa}</td>
                  <td>{new Date(pedido.data_hora).toLocaleString()}</td>
                  <td>R$ {Number(pedido.total_item).toFixed(2)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">Nenhum pedido exibido</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pedidos.length > 0 && (
        <div className="text-end mt-3 fw-bold">
          Total Final: <span className="text-success">R$ {totalFinal.toFixed(2)}</span>
        </div>
      )}
    </div>
  );
}

export default FechamentoCaixa;
