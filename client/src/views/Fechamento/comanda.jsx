import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function FechamentoComanda() {
  const [mesas, setMesas] = useState([]);
  const [mesaSelecionada, setMesaSelecionada] = useState('');
  const [itens, setItens] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");
    try {
      const decoded = jwtDecode(token);
      // Permitir gerente (a) e talvez garçom (g) fechar comanda? 
      // O usuário pediu a funcionalidade, geralmente gerente ou garçom fazem isso.
      // Vou permitir ambos ou apenas o que estiver definido no sistema.
      if (decoded.usuario_tipo !== "a" && decoded.usuario_tipo !== "g") return navigate("/login");
    } catch {
      return navigate("/login");
    }
    fetchMesas();
  }, []);

  const fetchMesas = async () => {
    try {
      const response = await axios.get('http://localhost:3000/pedidos/mesas');
      setMesas(response.data);
    } catch (err) {
      console.error("Erro ao buscar mesas:", err);
    }
  };

  const fetchComanda = async (mesa) => {
    if (!mesa) return;
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:3000/pedidos/mesa/${mesa}`);
      setItens(response.data);
      const t = response.data.reduce((acc, item) => acc + Number(item.subtotal), 0);
      setTotal(t);
    } catch (err) {
      console.error(err);
      setError('Erro ao buscar itens da comanda.');
    } finally {
      setLoading(false);
    }
  };

  const handleMesaChange = (e) => {
    const mesa = e.target.value;
    setMesaSelecionada(mesa);
    fetchComanda(mesa);
  };

  const finalizarPagamento = async () => {
    if (!mesaSelecionada) return;
    if (!window.confirm(`Deseja realmente fechar a comanda da mesa ${mesaSelecionada}?`)) return;

    try {
      await axios.put(`http://localhost:3000/pedidos/pagar/${mesaSelecionada}`);
      alert('Comanda fechada com sucesso!');
      setItens([]);
      setTotal(0);
      setMesaSelecionada('');
      fetchMesas();
    } catch (err) {
      console.error(err);
      alert('Erro ao fechar comanda.');
    }
  };

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4">💳 Fechamento de Comanda</h2>

      <div className="row justify-content-center mb-4">
        <div className="col-md-4">
          <label className="form-label fw-bold">Selecione a Mesa</label>
          <select 
            className="form-select" 
            value={mesaSelecionada} 
            onChange={handleMesaChange}
          >
            <option value="">Selecione...</option>
            {mesas.map((m) => (
              <option key={m.mesa} value={m.mesa}>Mesa {m.mesa}</option>
            ))}
          </select>
        </div>
      </div>

      {loading && <p className="text-center">Carregando...</p>}
      {error && <div className="alert alert-danger">{error}</div>}

      {itens.length > 0 ? (
        <div className="card shadow-sm">
          <div className="card-body">
            <h5 className="card-title mb-3">Resumo da Mesa {mesaSelecionada}</h5>
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th className="text-center">Qtd</th>
                    <th className="text-end">Preço Unit.</th>
                    <th className="text-end">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {itens.map((item, index) => (
                    <tr key={index}>
                      <td>{item.item}</td>
                      <td className="text-center">{item.quantidade}</td>
                      <td className="text-end">R$ {Number(item.preco).toFixed(2)}</td>
                      <td className="text-end">R$ {Number(item.subtotal).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="table-light">
                    <td colSpan="3" className="text-end fw-bold">TOTAL DA COMANDA:</td>
                    <td className="text-end fw-bold text-success">R$ {total.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <div className="text-end mt-3">
              <button 
                className="btn btn-success btn-lg" 
                onClick={finalizarPagamento}
              >
                Finalizar e Pagar
              </button>
            </div>
          </div>
        </div>
      ) : mesaSelecionada && !loading && (
        <p className="text-center text-muted">Nenhum pedido pendente para esta mesa.</p>
      )}
    </div>
  );
}

export default FechamentoComanda;
