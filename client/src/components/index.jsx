import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './navbar.css';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  let usuarioTipo = null;
  if (token) {
    try {
      const decoded = jwtDecode(token);
      usuarioTipo = decoded.usuario_tipo;
    } catch (error) {
      localStorage.removeItem('token');
      navigate("/login");
    }
  }

  const handleBack = () => navigate(-1);
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate("/login");
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="custom-navbar">
      <div className="navbar-container">
        <div className="left-section">
          <button className="nav-btn neutral" onClick={handleBack}>⟵ Voltar</button>
        </div>

        <div className="center-section">
          <div className="hamburger" onClick={toggleMenu}>☰</div>
          <div className={`nav-links ${menuOpen ? 'show' : ''}`}>
            {usuarioTipo === "a" && (
              <>
                <button className="nav-btn" onClick={() => navigate("/cadastroU")}>Cadastrar usuários</button>
                <button className="nav-btn" onClick={() => navigate("/garcom/cardapio")}>Garçom</button>
                <button className="nav-btn" onClick={() => navigate("/cozinha")}>Cozinha</button>
                <button className="nav-btn" onClick={() => navigate("/cadastroi")}>Itens</button>
                <button className="nav-btn" onClick={() => navigate("/fechamento")}>Fechamento</button>
                <button className="nav-btn" onClick={() => navigate("/lista/usuarios")}>Lista de Funcionarios</button>
                <button className="nav-btn" onClick={() => navigate("/lista/itens")}>Lista de Itens</button>

              </>
            )}
          </div>
        </div>

        <div className="right-section">
          {token && (
            <button className="nav-btn danger" onClick={handleLogout}>Logoff</button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
