import { Link } from 'react-router-dom';
import Lanche from '../../img/hamburguer.png';
import Espetinho from '../../img/espetinho.png';
import Sobremesas from '../../img/sobremesas.png';
import Bebidas from '../../img/bebidas.png';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect } from 'react';
import '../cardapio/cardapio.css';
import { useNavigate } from 'react-router-dom';

function Cardapio() {
  const categorias = [
    { id: 1, imagem: Lanche, nome: 'Lanche' },
    { id: 2, imagem: Espetinho, nome: 'Espetinho' },
    { id: 3, imagem: Sobremesas, nome: 'Sobremesas' },
    { id: 4, imagem: Bebidas, nome: 'bebidas' },
  ];
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
        navigate("/login"); // Se não for "c" nem "a", redireciona
        return;
      }
    } catch (error) {
      navigate("/login");
      return;
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
