import { Link } from 'react-router-dom';
import Lanche from '../../img/hamburguer.png';
import Espetinho from '../../img/espetinho.png';
import Sorvete from '../../img/sorvete.png';
import Combo from '../../img/combo.png';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect } from 'react';
import './cardapioG.css';

function Cardapio() {
  const categorias = [
    { id: 1, imagem: Lanche, nome: 'Lanche' },
    { id: 2, imagem: Espetinho, nome: 'Espetinho' },
    { id: 3, imagem: Sorvete, nome: 'Sorvete' },
    { id: 4, imagem: Combo, nome: 'Combo' },
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Efetue login");
      window.location.href = "/login";
    } else {
      try {
        jwtDecode(token); // Validação simples
      } catch (error) {
        alert("Erro ao decodificar token");
        window.location.href = "/login";
      }
    }
  }, []);

  return (
    <div className="container mt-4">
      <div className="text-center mb-4">
        <h1>Cardápio - Botique</h1>
      </div>

      <div className="row">
        {categorias.map((categoria) => (
          <div key={categoria.id} className="col-12 col-sm-6 d-flex justify-content-center mb-4">
            <Link to={`/garcom/sub_categoria/${categoria.id}`} className="text-decoration-none">
              <img className="img-cardapio" src={categoria.imagem} alt={categoria.nome} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Cardapio;
