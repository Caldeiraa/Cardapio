import React from 'react';
import { useNavigate } from 'react-router-dom'; // Para usar o hook useNavigate

function Navbar() {
  const navigate = useNavigate(); // Hook para navegação

  const handleBack = () => {
    navigate(-1); // Volta para a página anterior
  };

  const handleLogout = () => {
    // Aqui você pode implementar a lógica de logout (limpar token, etc.)
    localStorage.removeItem('token'); // Exemplo de remoção do token
    navigate("/login"); // Redireciona para a página de login
  };

  return (
    <div>
      <nav className="navbar navbar-light bg-light">
        <div className="container-fluid">
          <button className="btn btn-secondary" onClick={handleBack}>Voltar</button>
          <button className="btn btn-danger ms-2" onClick={handleLogout}>Logoff</button>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
