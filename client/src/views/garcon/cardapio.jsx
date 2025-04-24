import { Link } from 'react-router-dom'; // Importando o Link
import { useNavigate } from 'react-router-dom'; // Importando o hook useNavigate
import Lanche from '../../img/hamburguer.png';
import Espetinho from '../../img/espetinho.png';
import Sorvete from '../../img/sorvete.png';
import Combo from '../../img/combo.png';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect } from 'react';

function Cardapio() {
  const categorias = [
    { id: 1, imagem: Lanche, nome: 'Lanche' },
    { id: 2, imagem: Espetinho, nome: 'Espetinho' },
    { id: 3, imagem: Sorvete, nome: 'Sorvete' },
    { id: 4, imagem: Combo, nome: 'Combo' },
  ];

  const navigate = useNavigate(); // Inicializando o navigate

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Efetue login");
      navigate("/login"); // Usando navigate ao invés de window.location.href
    } else {
      try {
        const decodedToken = jwtDecode(token);
        const usuario_id = decodedToken.usuario_id;
        console.log("Usuario ID:", usuario_id);
        navigate(`/garcom/sub_categoria/${usuario_id}`); // Redirecionando para a subcategoria
      } catch (error) {
        console.error("Erro ao decodificar token:", error);
        alert("Erro ao decodificar token");
        navigate("/login");
      }
    }
  }, [navigate]);

  return (
    <div className="container mt-4">
      <div className="text-center mb-4">
        <h1>Cardápio - Botique</h1>
      </div>

      <div className="row">
        {categorias.map((categoria) => (
          <div key={categoria.id} className="col-12 col-sm-6 d-flex justify-content-center mb-4">
            <Link to={`/sub_categoria/${categoria.id}`} className="text-decoration-none">
              <img className="img-cardapio" src={categoria.imagem} alt={categoria.nome} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Cardapio;
