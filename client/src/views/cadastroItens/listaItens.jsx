import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCheckCircle, FaTimesCircle, FaEdit } from 'react-icons/fa';
import * as bootstrap from 'bootstrap';

function SubCardapioList() {
  const [itens, setItens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [alterando, setAlterando] = useState(null);
  const [modalItem, setModalItem] = useState(null);
  const [formEdit, setFormEdit] = useState({ nome: '', descricao_prod: '', preco: '' });

  const API_URL = 'http://localhost:3000';

  useEffect(() => {
    async function fetchItens() {
      try {
        const res = await axios.get(`${API_URL}/subcardapio`);
        setItens(res.data[1] || []);
      } catch (err) {
        setErro('Erro ao carregar os itens.');
      } finally {
        setLoading(false);
      }
    }
    fetchItens();
  }, []);

  async function toggleAtivo(id, ativoAtual) {
    setAlterando(id);
    try {
      const rota = ativoAtual ? 'desativar' : 'ativar';
      // Passando o id no corpo da requisição, conforme o backend espera
      await axios.put(`${API_URL}/desativar/${rota}`, { id_sub_cardapio: id });
      
      // Atualizando a lista de itens no frontend após a alteração
      setItens(prev =>
        prev.map(item =>
          item.id_sup_cardapio === id ? { ...item, ativo: !ativoAtual } : item
        )
      );
    } catch (err) {
      alert('Erro ao alterar o status do item.');
    } finally {
      setAlterando(null);
    }
  }

  const abrirModal = (item) => {
    setModalItem(item);
    setFormEdit({
      nome: item.nome,
      descricao_prod: item.descricao_prod,
      preco: item.preco
    });
    const modal = new bootstrap.Modal(document.getElementById('editModal'));
    modal.show();
  };

  async function salvarEdicao() {
    try {
      await axios.put(`${API_URL}/subcardapio/${modalItem.id_sup_cardapio}`, formEdit);
      setItens(prev =>
        prev.map(item =>
          item.id_sup_cardapio === modalItem.id_sup_cardapio
            ? { ...item, ...formEdit }
            : item
        )
      );
      const modal = bootstrap.Modal.getInstance(document.getElementById('editModal'));
      modal.hide();
    } catch (err) {
      alert('Erro ao salvar alterações.');
    }
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4 fw-bold">Lista de Itens do Cardápio</h2>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border" />
          <p>Carregando itens...</p>
        </div>
      ) : erro ? (
        <div className="alert alert-danger">{erro}</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle text-center">
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
                        src={`${API_URL}/img/${item.imagem}`}
                        alt={item.nome}
                        className="img-thumbnail"
                        style={{ width: 60, height: 60, objectFit: 'cover' }}
                      />
                    ) : '—'}
                  </td>
                  <td>
                    <span className={`badge rounded-pill ${item.ativo ? 'bg-success' : 'bg-secondary'}`}>
                      {item.ativo ? <FaCheckCircle className="me-1" /> : <FaTimesCircle className="me-1" />}
                      {item.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td>
                    <button
                      className={`btn btn-sm me-2 ${item.ativo ? 'btn-danger' : 'btn-success'}`}
                      onClick={() => toggleAtivo(item.id_sup_cardapio, item.ativo)}
                      disabled={alterando === item.id_sup_cardapio}
                    >
                      {alterando === item.id_sup_cardapio ? 'Aguarde...' : item.ativo ? 'Desativar' : 'Ativar'}
                    </button>
                    <button
                      className="btn btn-sm text-white"
                      style={{ backgroundColor: '#4da6ff', border: 'none' }}
                      onClick={() => abrirModal(item)}
                    >
                      <FaEdit className="me-1" /> Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de Edição */}
      <div className="modal fade" id="editModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Editar Item</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Nome</label>
                <input
                  type="text"
                  className="form-control"
                  value={formEdit.nome}
                  onChange={e => setFormEdit({ ...formEdit, nome: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Descrição</label>
                <textarea
                  className="form-control"
                  value={formEdit.descricao_prod}
                  onChange={e => setFormEdit({ ...formEdit, descricao_prod: e.target.value })}
                ></textarea>
              </div>
              <div className="mb-3">
                <label className="form-label">Preço</label>
                <input
                  type="number"
                  className="form-control"
                  step="0.01"
                  value={formEdit.preco}
                  onChange={e => setFormEdit({ ...formEdit, preco: e.target.value })}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
              <button type="button" className="btn btn-primary" onClick={salvarEdicao}>Salvar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SubCardapioList;
