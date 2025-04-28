import React from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function Navbar() {
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

  const handleBack = () => {
    navigate(-1);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate("/login");
  };

  return (
    <div>
      <nav className="navbar navbar-light bg-light">
        <div className="container-fluid d-flex align-items-center">
          <button className="btn btn-secondary me-2" onClick={handleBack}>Voltar</button>

          {/* Botões especiais para ADM */}
          {usuarioTipo === "a" && (
            <>
              <button className="btn btn-primary me-2" onClick={() => navigate("/cadastroU")}>
                Cadastro de Usuários
              </button>
              <button className="btn btn-primary me-2" onClick={() => navigate("/garcom/cardapio")}>
                Cardápio do Garçom
              </button>
              <button className="btn btn-primary me-2" onClick={() => navigate("/cozinha")}>
                Pedidos da Cozinha
              </button>
            </>
          )}

          {token && (
            <button className="btn btn-danger ms-auto" onClick={handleLogout}>Logoff</button>
          )}
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
