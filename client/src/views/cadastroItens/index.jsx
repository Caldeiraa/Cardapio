import React, { useState } from 'react';
import axios from 'axios';

function Index() {
  const [formData, setFormData] = useState({
    nome: '',
    preco: '',
    imagem: null,
    descricao_prod: '',
    cardapio_id: '1',
  });

  const [mensagem, setMensagem] = useState('');
  const [imagemPreview, setImagemPreview] = useState('');

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
        cardapio_id: '1',
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
                <label className="form-label">Nome do Item</label>
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
                <label className="form-label">Preço</label>
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
                <label className="form-label">Imagem</label>
                <input
                  type="file"
                  name="imagem"
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
                    alt="Pré-visualização"
                    style={{ maxWidth: '200px', maxHeight: '200px' }}
                  />
                </div>
              )}

              <div className="mb-3">
                <label className="form-label">Descrição</label>
                <textarea
                  name="descricao_prod"
                  className="form-control"
                  value={formData.descricao_prod}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <div className="mb-4">
                <label className="form-label">Categoria</label>
                <select
                  name="cardapio_id"
                  className="form-select"
                  value={formData.cardapio_id}
                  onChange={handleChange}
                  required
                >
                  <option value="1">Hambúrguer</option>
                  <option value="2">Espetinhos</option>
                  <option value="3">Sobremesas</option>
                  <option value="4">Bebidas</option>
                </select>
              </div>

              <div className="d-grid">
                <button type="submit" className="btn btn-success">
                  Cadastrar Item
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Index;
