import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Importando o hook useNavigate
import { jwtDecode } from 'jwt-decode';

function Login() {
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate(); // Inicializando o navigate

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/login', {
        login: nomeUsuario,
        senha: senha
      });

      // Armazenando o token no localStorage
      localStorage.setItem('token', response.data.token);

      // Decodificando o token para obter o usuario_tipo
      const decodedToken = jwtDecode(response.data.token);
      const usuarioTipo = decodedToken.usuario_tipo;

      // Verificando o tipo de usuário e redirecionando para a página correspondente
      if (usuarioTipo === 'g') {
        navigate("/garcom/cardapio");
      } else if (usuarioTipo === 'c') {
        navigate("/cozinha");
      } else if (usuarioTipo === 'a') {
        navigate("/cadastroU");
      } else {
        alert("Tipo de usuário desconhecido.");
      }

    } catch (error) {
      console.error('Erro ao fazer login:', error.response?.data || error.message);
      alert('Usuário ou senha inválidos.');
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100">
      <div className="card shadow p-4" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="text-center mb-4">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="usuario" className="form-label">Usuário</label>
            <input
              type="text"
              className="form-control"
              id="usuario"
              placeholder="Digite seu usuário"
              value={nomeUsuario}
              onChange={(e) => setNomeUsuario(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="senha" className="form-label">Senha</label>
            <input
              type="password"
              className="form-control"
              id="senha"
              placeholder="Digite sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">Entrar</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
