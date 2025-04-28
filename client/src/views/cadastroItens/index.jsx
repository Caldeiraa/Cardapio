import React, { useState } from 'react';
import axios from 'axios';

function Index() {
  const [formData, setFormData] = useState({
    nome: '',
    preco: '',
    imagem: '',
    descricao_prod: '',
    cardapio_id: '1',
  });

  const [mensagem, setMensagem] = useState('');
  const [imagemPreview, setImagemPreview] = useState('');

  const handleChange = (e) => {
    if (e.target.name === 'imagem') {
      // Atualiza o preview da imagem
      setImagemPreview(URL.createObjectURL(e.target.files[0]));
    }
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    setFormData({
      ...formData,
      imagem: e.target.files[0],
    });
    setImagemPreview(URL.createObjectURL(e.target.files[0]));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem('Item preparado para cadastro!');

    const data = new FormData();
    data.append('nome_item', formData.nome);
    data.append('preco_item', formData.preco);
    data.append('descricao_item', formData.descricao_prod);
    data.append('cardapio_id', formData.cardapio_id);
    data.append('foto_item', formData.imagem);  // Adicionando a imagem como "foto_item"

    try {
      const response = await axios.post('http://localhost:3000/cadastroI', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMensagem('Item cadastrado com sucesso!');
    } catch (error) {
      setMensagem('Erro ao cadastrar item!');
      console.error('Erro no envio para o backend:', error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow p-4 rounded-4">
            <h2 className="text-center mb-4">Cadastro de Itens</h2>

            {mensagem && <div className="alert alert-success text-center">{mensagem}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Nome do Item</label>
                <input
                  type="text"
                  className="form-control"
                  name="nome"
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
                  className="form-control"
                  name="preco"
                  value={formData.preco}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Imagem</label>
                <input
                  type="file"
                  className="form-control"
                  name="imagem"
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
                  className="form-control"
                  name="descricao_prod"
                  value={formData.descricao_prod}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <div className="mb-4">
                <label className="form-label">Categoria</label>
                <select
                  className="form-select"
                  name="cardapio_id"
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
                <button type="submit" className="btn btn-success">Cadastrar Item</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Index;
