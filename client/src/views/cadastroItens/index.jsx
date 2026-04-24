import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

function Index() {
  const [formData, setFormData] = useState({
    nome: '',
    preco: '',
    imagem: null,
    descricao_prod: '',
    cardapio_id: '',
  });

  const [categorias, setCategorias] = useState([]); // 🔥 NOVO
  const navigate = useNavigate();
  const [mensagem, setMensagem] = useState('');
  const [imagemPreview, setImagemPreview] = useState('');

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    try {
      const decoded = jwtDecode(token);
      if (decoded.usuario_tipo !== "a") return navigate("/login");
    } catch {
      return navigate("/login");
    }

    carregarCategorias(); // 🔥 NOVO
  }, [navigate]);

  // 🔥 BUSCAR DO BACKEND
  const carregarCategorias = async () => {
    try {
      const res = await axios.get("http://localhost:3000/cardapio");
      setCategorias(res.data);
    } catch (error) {
      console.error("Erro ao carregar categorias", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        imagem: file,
      }));
      setImagemPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('nome_item', formData.nome);
    data.append('preco_item', formData.preco);
    data.append('descricao_item', formData.descricao_prod);
    data.append('cardapio_id', formData.cardapio_id);
    data.append('foto_item', formData.imagem);

    try {
      await axios.post('http://localhost:3000/cadastroI', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setMensagem('Item cadastrado com sucesso!');

      setFormData({
        nome: '',
        preco: '',
        imagem: null,
        descricao_prod: '',
        cardapio_id: '',
      });

      setImagemPreview('');
    } catch (error) {
      console.error('Erro ao cadastrar item:', error);
      setMensagem('Erro ao cadastrar item!');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow p-4 rounded-4">
            <h2 className="text-center mb-4">Cadastro de Itens</h2>

            {mensagem && (
              <div className="alert alert-info text-center">{mensagem}</div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label>Nome do Item</label>
                <input
                  type="text"
                  name="nome"
                  className="form-control"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label>Preço</label>
                <input
                  type="number"
                  step="0.01"
                  name="preco"
                  className="form-control"
                  value={formData.preco}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label>Imagem</label>
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={handleImageChange}
                  required
                />
              </div>

              {imagemPreview && (
                <div className="text-center mb-3">
                  <img
                    src={imagemPreview}
                    alt="preview"
                    style={{ maxWidth: '200px' }}
                  />
                </div>
              )}

              <div className="mb-3">
                <label>Descrição</label>
                <textarea
                  name="descricao_prod"
                  className="form-control"
                  value={formData.descricao_prod}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* 🔥 SELECT DINÂMICO */}
              <div className="mb-4">
                <label>Categoria</label>
                <select
                  name="cardapio_id"
                  className="form-select"
                  value={formData.cardapio_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecione</option>

                  {categorias.map((cat) => (
                    <option key={cat.id_cardapio} value={cat.id_cardapio}>
                      {cat.nome_item}
                    </option>
                  ))}
                </select>
              </div>

              <button className="btn btn-success w-100">
                Cadastrar Item
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Index;