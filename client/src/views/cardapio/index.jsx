import React from 'react';
import { Link } from 'react-router-dom';
import Lanche from '../../img/hamburguer.png';
import Espetinho from '../../img/espetinho.png';
import Sobremesas from '../../img/sobremesas.png';
import Bebidas from '../../img/bebidas.png';
import './cardapio.css';

function Cardapio() {
  const categorias = [
    { id: 1, imagem: Lanche, nome: 'Lanches' },
    { id: 2, imagem: Espetinho, nome: 'Espetinhos' },
    { id: 3, imagem: Sobremesas, nome: 'Sobremesas' },
    { id: 4, imagem: Bebidas, nome: 'Bebidas' },
  ];

  return (
    <div className="container mt-4">
      <div className="text-center mb-4">
        <h1 className="titulo-cardapio">Cardápio - Botique</h1>
      </div>

      <div className="row justify-content-center">
        {categorias.map((categoria) => (
          <div key={categoria.id} className="col-6 col-md-4 col-lg-3 mb-4 d-flex justify-content-center">
            <Link to={`/sub_categoria/${categoria.id}`} className="card-cardapio text-decoration-none">
              <div className="imagem-container">
                <img src={categoria.imagem} alt={categoria.nome} className="img-fluid imagem-cardapio" />
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
