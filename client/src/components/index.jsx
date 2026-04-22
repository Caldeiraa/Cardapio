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
    } catch {
      localStorage.removeItem('token');
      navigate("/login");
    }
  }

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <>
      <nav className="custom-navbar">
        <div className="navbar-container">

          <button className="nav-btn neutral" onClick={() => navigate(-1)}>
            ⟵ Voltar
          </button>

          {usuarioTipo === "a" && (
            <div className="hamburger" onClick={toggleMenu}>
              ☰
            </div>
          )}

          {token && (
            <button className="nav-btn danger" onClick={() => {
              localStorage.removeItem('token');
              navigate("/login");
            }}>
              Logoff
            </button>
          )}
        </div>
      </nav>

      {/* MENU LATERAL */}
      <div className={`sidebar ${menuOpen ? "open" : ""}`}>
        <h3>Menu</h3>

        <div className="menu-group">
          <p>Operação</p>
          <button onClick={() => navigate("/garcom/cardapio")}>Garçom</button>
          <button onClick={() => navigate("/cozinha")}>Cozinha</button>
          <button onClick={() => navigate("/fechamento")}>Fechamento</button>
        </div>

        <div className="menu-group">
          <p>Cadastros</p>
          <button onClick={() => navigate("/cadastroU")}>Usuários</button>
          <button onClick={() => navigate("/cadastroi")}>Itens</button>
          <button onClick={() => navigate("/cadastro/cardapio")}>Cardápio</button>
        </div>

        <div className="menu-group">
          <p>Listagens</p>
          <button onClick={() => navigate("/lista/usuarios")}>Funcionários</button>
          <button onClick={() => navigate("/lista/itens")}>Itens</button>
        </div>
      </div>

      {/* OVERLAY */}
      {menuOpen && <div className="overlay" onClick={toggleMenu}></div>}
    </>
  );
}

export default Navbar;