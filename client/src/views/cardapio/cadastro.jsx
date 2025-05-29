import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './cadastro.css'

function CadastroCardapio() {
  const [categorias, setCategorias] = useState([]);
  const [nome, setNome] = useState('');
  const [imagem, setImagem] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nome || !imagem) return;

    const formData = new FormData();
    formData.append('nome_categoria', nome);
    formData.append('imagem', imagem);

    try {
      const response = await fetch('http://localhost:3000/cadastroCardapio', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const novaCategoria = {
          nome,
          imagem: URL.createObjectURL(imagem),
        };
        setCategorias([...categorias, novaCategoria]);
        setNome('');
        setImagem(null);
      } else {
        alert('Erro ao cadastrar categoria');
      }
    } catch (err) {
      console.error('Erro ao conectar com o backend:', err);
      alert('Erro de conexão com o servidor');
    }
  };

  return (
    <div className="container py-5">
      <h2 className="text-center mb-4">Cadastro de Cardápio</h2>

      <form onSubmit={handleSubmit} className="card shadow p-4 mb-5">
        <div className="row g-3">
          <div className="col-md-6">
            <label htmlFor="nomeCategoria" className="form-label">Nome da Categoria</label>
            <input
              type="text"
              className="form-control"
              id="nomeCategoria"
              placeholder="Ex: Lanches"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="imagem" className="form-label">Imagem</label>
            <input
              type="file"
              className="form-control"
              id="imagem"
              accept="image/*"
              onChange={(e) => setImagem(e.target.files[0])}
              required
            />
          </div>
        </div>

        <div className="text-end mt-4">
          <button type="submit" className="btn btn-primary px-4">Cadastrar</button>
        </div>
      </form>

      <div className="row">
        {categorias.map((item, index) => (
          <div key={index} className="col-6 col-md-4 col-lg-3 mb-4">
            <div className="card h-100 shadow-sm">
              <img
                src={item.imagem}
                alt={item.nome}
                className="card-img-top"
                style={{ height: '160px', objectFit: 'cover' }}
              />
              <div className="card-body text-center">
                <h6 className="card-title mb-0">{item.nome}</h6>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CadastroCardapio;
