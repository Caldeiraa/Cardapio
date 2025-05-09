import { useState, useEffect } from 'react';
import axios from 'axios';
import { Spinner } from 'react-bootstrap';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

function SubCardapioList() {
  const [itens, setItens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [alterando, setAlterando] = useState(null); // ID em alteração

  // Alternar status ativo/inativo
  async function toggleAtivo(id, ativoAtual) {
    setAlterando(id);
    try {
      const url = `/subcardapio/${id}/${ativoAtual ? 'desativar' : 'ativar'}`;
      await axios.put(url);
      setItens(prev => prev.map(item =>
        item.id_sup_cardapio === id ? { ...item, ativo: !ativoAtual } : item
      ));
    } catch (err) {
      console.error('Erro ao atualizar status:', err);
      alert('Erro ao alterar o status do item.');
    } finally {
      setAlterando(null);
    }
  }

  // Buscar dados no carregamento inicial
  useEffect(() => {
    async function fetchItens() {
      try {
        const res = await 
        axios.get('http://localhost:3000/subcardapio')

        setItens(res.data[1] || []); // considerando que retorna [200, dados]
      } catch (err) {
        console.error('Erro ao obter itens:', err);
        setErro('Erro ao carregar os itens.');
      } finally {
        setLoading(false);
      }
    }
    fetchItens();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Lista de Itens do Cardápio</h2>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
          <p className="mt-2">Carregando itens...</p>
        </div>
      ) : erro ? (
        <div className="alert alert-danger">{erro}</div>
      ) : itens.length === 0 ? (
        <div className="alert alert-warning">Nenhum item encontrado.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover table-bordered align-middle text-center">
            <thead className="table-dark">
              <tr>
                <th>Nome</th>
                <th>Descrição</th>
                <th>Preço</th>
                <th>Imagem</th>
                <th>Status</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {itens.map(item => (
                <tr key={item.id_sup_cardapio}>
                  <td>{item.nome}</td>
                  <td>{item.descricao_prod}</td>
                  <td>R$ {Number(item.preco).toFixed(2)}</td>
                  <td>
                    {item.imagem ? (
                      <img 
                        src={`/img/${item.imagem}`} 
                        alt={item.nome} 
                        style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 5 }}
                      />
                    ) : '—'}
                  </td>
                  <td>
                    {item.ativo ? (
                      <span className="badge bg-success">
                        <FaCheckCircle className="me-1" /> Ativo
                      </span>
                    ) : (
                      <span className="badge bg-secondary">
                        <FaTimesCircle className="me-1" /> Inativo
                      </span>
                    )}
                  </td>
                  <td>
                    <button 
                      className={`btn btn-sm ${item.ativo ? 'btn-danger' : 'btn-success'}`}
                      onClick={() => toggleAtivo(item.id_sup_cardapio, item.ativo)}
                      disabled={alterando === item.id_sup_cardapio}
                    >
                      {alterando === item.id_sup_cardapio ? 'Aguarde...' : item.ativo ? 'Desativar' : 'Ativar'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default SubCardapioList;
