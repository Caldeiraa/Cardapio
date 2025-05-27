import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

const formatDate = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:00`;
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
        setPedidos([]);
        setTotalFinal(0);
      } else {
        setPedidos(response.data);
        const total = response.data.reduce((acc, pedido) => acc + Number(pedido.total_item), 0);
        setTotalFinal(total);
      }
    } catch (err) {
      console.error(err);
      setError('Erro ao buscar pedidos.');
      setPedidos([]);
      setTotalFinal(0);
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = () => {
    if (pedidos.length === 0) return alert("Nenhum dado para exportar.");

    // Montar os dados da planilha
    const wsData = [
      ["Numero do pedido", "Cliente", "Data/Hora", "Item", "Qtd", "Total (R$)"],
      ...pedidos.map(p => [
        p.id_pedido,
        p.nome_cliente,
        new Date(p.data_hora).toLocaleString(),
        p.item,
        p.quantidade,
        Number(p.total_item)
      ]),
      ["", "", "", "", "Total Geral", Number(totalFinal)]
    ];

    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Definir estilos básicos
    const headerRange = XLSX.utils.decode_range(ws['!ref']);
    for (let C = headerRange.s.c; C <= headerRange.e.c; ++C) {
      const cellAddress = XLSX.utils.encode_cell({r:0, c:C});
      if(!ws[cellAddress]) continue;
      ws[cellAddress].s = {
        font: { bold: true, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: "0070C0" } },
        alignment: { horizontal: "center", vertical: "center" },
        border: {
          top: { style: "thin", color: { rgb: "000000" } },
          bottom: { style: "thin", color: { rgb: "000000" } },
          left: { style: "thin", color: { rgb: "000000" } },
          right: { style: "thin", color: { rgb: "000000" } },
        }
      };
    }

    // Estilo para total (última linha)
    const lastRow = headerRange.e.r;
    for(let C = headerRange.s.c; C <= headerRange.e.c; ++C){
      const cellAddress = XLSX.utils.encode_cell({r:lastRow, c:C});
      if(!ws[cellAddress]) continue;
      ws[cellAddress].s = {
        font: { bold: true },
        fill: { fgColor: { rgb: "D9E1F2" } },
        border: {
          top: { style: "thin", color: { rgb: "000000" } },
          bottom: { style: "thin", color: { rgb: "000000" } },
          left: { style: "thin", color: { rgb: "000000" } },
          right: { style: "thin", color: { rgb: "000000" } },
        },
        alignment: { horizontal: C === 5 ? "right" : "center" }
      };
    }

    // Alinhar colunas (Qtd e Total)
    for (let R = 1; R < lastRow; R++) {
      // Quantidade (col 4)
      let cellQtd = XLSX.utils.encode_cell({r:R, c:4});
      if(ws[cellQtd]) ws[cellQtd].s = { alignment: { horizontal: "center" } };
      // Total (col 5)
      let cellTotal = XLSX.utils.encode_cell({r:R, c:5});
      if(ws[cellTotal]) ws[cellTotal].s = { alignment: "right", numFmt: 'R$ #,##0.00' };
    }

    // Ajustar largura das colunas
    ws['!cols'] = [
      { wch: 10 }, // ID Pedido
      { wch: 20 }, // Cliente
      { wch: 20 }, // Data/Hora
      { wch: 25 }, // Item
      { wch: 6 },  // Qtd
      { wch: 12 }, // Total (R$)
    ];

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
              <th>Data/Hora</th>
              <th>Item</th>
              <th>Qtd</th>
              <th>Total (R$)</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.length > 0 ? (
              pedidos.map((pedido, index) => (
                <tr key={index}>
                  <td>{pedido.nome_cliente}</td>
                  <td>{new Date(pedido.data_hora).toLocaleString()}</td>
                  <td>{pedido.item}</td>
                  <td>{pedido.quantidade}</td>
                  <td>R$ {Number(pedido.total_item).toFixed(2)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">Nenhum pedido exibido</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pedidos.length > 0 && (
        <div className="text-end mt-3 fw-bold">
          Total Final: <span className="text-success">R$ {Number(totalFinal).toFixed(2)}</span>
        </div>
      )}
    </div>
  );
}

export default FechamentoCaixa;
