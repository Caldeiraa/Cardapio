import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react';

function CardapioGarcom() {
  const [categorias, setCategorias] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      if (decoded.usuario_tipo !== "g" && decoded.usuario_tipo !== "a") {
        navigate("/login");
        return;
      }
    } catch (error) {
      navigate("/login");
      return;
    }

    async function fetchCategorias() {
      try {
        const res = await fetch('http://localhost:3000/cardapio');
        const data = await res.json();
        console.log("Categorias recebidas:", data); // VERIFICAR A IMAGEM AQUI
        setCategorias(data);
      } catch (error) {
        console.error('Erro ao buscar categorias:', error);
      }
    }

    fetchCategorias();
  }, []);

  return (
    <div className="container mt-4">
      <div className="text-center mb-4">
        <h1 className="titulo-cardapio">Cardápio - Botique</h1>
      </div>

      <div className="row justify-content-center">
        {categorias.map((categoria) => (
          <div
            key={categoria.id_cardapio}
            className="col-6 col-md-4 col-lg-3 mb-4 d-flex justify-content-center"
          >
            <Link to={`/garcom/sub_categoria/${categoria.id_cardapio}`} className="card-cardapio text-decoration-none">
              <div className="imagem-container">
                <img
                  src={`http://localhost:3000/img/${categoria.imagem_item}`}
                  alt={categoria.nome}
                  className="img-fluid imagem-cardapio"
                  style={{ height: '200px', objectFit: 'cover' }} // Igual ao segundo código
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

export default CardapioGarcom;
