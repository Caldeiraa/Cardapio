import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './cardapio.css';

function Cardapio() {
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await axios.get('http://localhost:3000/cardapio');
        console.log('Categorias recebidas:', response.data);
        setCategorias(response.data);
      } catch (error) {
        console.error('Erro ao buscar categorias:', error);
      }
    };

    fetchCategorias();
  }, []);

  return (
    <div className="container mt-4">
      <div className="text-center mb-4">
        <h1 className="titulo-cardapio">Cardápio - Botique</h1>
      </div>

      <div className="row justify-content-center">
        {categorias.map((categoria) => (
          <div key={categoria.id_cardapio} className="col-6 col-md-4 col-lg-3 mb-4 d-flex justify-content-center">
            <Link to={`/sub_categoria/${categoria.id_cardapio}`} className="card-cardapio text-decoration-none">
              <div className="imagem-container">
                <img
                  src={`http://localhost:3000/img/${categoria.imagem_item}`}
                  alt={categoria.nome}
                  className="img-fluid imagem-cardapio"
                />
                <div className="overlay-nome">{categoria.nome}</div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Cardapio;
