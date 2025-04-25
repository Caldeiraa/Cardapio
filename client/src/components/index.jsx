import React from 'react';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

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
        <div className="container-fluid">
          <button className="btn btn-secondary" onClick={handleBack}>Voltar</button>
          {token && (
            <button className="btn btn-danger ms-2" onClick={handleLogout}>Logoff</button>
          )}
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
