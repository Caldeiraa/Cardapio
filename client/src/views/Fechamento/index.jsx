import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';

// Função para formatar a data para o formato YYYY-MM-DD HH:mm:ss
const formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:00`;
};

function FechamentoCaixa() {
  const [pedidos, setPedidos] = useState([]);
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (dataInicio && dataFim) {
      fetchPedidos();
    }
  }, [dataInicio, dataFim]);

  const fetchPedidos = async () => {
    setLoading(true);
    setError(null);

    try {
      // Verifique os dados que estão sendo enviados para garantir que a data está no formato correto
      const formattedDataInicio = formatDate(dataInicio);
      const formattedDataFim = formatDate(dataFim);

      console.log("Consultando pedidos entre:", formattedDataInicio, "e", formattedDataFim);

      const response = await axios.get('http://localhost:3000/fechamento-caixa', {
        params: { inicio: formattedDataInicio, fim: formattedDataFim },
      });

      if (response.data.length === 0) {
        setError('Nenhum pedido encontrado para o intervalo selecionado.');
      }

      setPedidos(response.data);
    } catch (error) {
      setError('Erro ao buscar pedidos. Tente novamente.');
      console.error("Erro ao buscar pedidos:", error);
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = () => {
    if (pedidos.length === 0) {
      alert("Não há dados para exportar.");
      return;
    }

    const ws = XLSX.utils.json_to_sheet(pedidos);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Pedidos");

    XLSX.writeFile(wb, "fechamento_caixa.xlsx");
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Fechamento de Caixa</h2>
      <div className="row mb-4">
        <div className="col">
          <input
            type="datetime-local"
            className="form-control"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
          />
        </div>
        <div className="col">
          <input
            type="datetime-local"
            className="form-control"
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
          />
        </div>
        <div className="col">
          <button
            className="btn btn-primary"
            onClick={fetchPedidos}
            disabled={loading}
          >
            Buscar Pedidos
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="text-center mb-4">
        <button
          className="btn btn-success"
          onClick={exportToExcel}
          disabled={pedidos.length === 0}
        >
          Exportar para Excel
        </button>
      </div>

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
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.length > 0 ? (
                pedidos.map((pedido, index) => (
                  <tr key={index}>
                    <td>{pedido.nome_cliente}</td>
                    <td>{pedido.mesa}</td>
                    <td>{new Date(pedido.data_hora).toLocaleString()}</td>
                    <td>R$ {Number(pedido.total).toFixed(2)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">Nenhum pedido encontrado</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default FechamentoCaixa;
