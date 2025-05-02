import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode'; // Corrigido o nome da função
import { useNavigate } from 'react-router-dom';

function Index() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      if (decoded.usuario_tipo !== "a") {
        navigate("/login"); // Se não for da cozinha, redireciona para login
        return;
      }
    } catch (error) {
      navigate("/login");
      return;
    }
  }, [navigate]); // Passando `navigate` como dependência para o `useEffect`

  const [formData, setFormData] = useState({
    nome_usuario: '',
    tipo_usuario: 'g',
    login: '',
    senha: ''
  });

  const [mensagem, setMensagem] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/usuarioC', formData);
      setMensagem('Funcionário cadastrado com sucesso!');
      // Redireciona para o login após o cadastro
      setTimeout(() => {
        setFormData({
          nome_usuario: '',
          tipo_usuario: 'g',
          login: '',
          senha: ''
        });
      }, 1000); // Tempo para mostrar a mensagem antes de redirecionar
    } catch (error) {
      setMensagem('Erro ao cadastrar funcionário.');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-lg p-4 rounded-4">
            <h2 className="text-center mb-4">Cadastro de Funcionários</h2>
            {mensagem && <div className="alert alert-info text-center">{mensagem}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="nome_usuario" className="form-label">Nome</label>
                <input
                  type="text"
                  className="form-control"
                  id="nome_usuario"
                  name="nome_usuario"
                  value={formData.nome_usuario}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="login" className="form-label">Login</label>
                <input
                  type="text"
                  className="form-control"
                  id="login"
                  name="login"
                  value={formData.login}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="senha" className="form-label">Senha</label>
                <input
                  type="password"
                  className="form-control"
                  id="senha"
                  name="senha"
                  value={formData.senha}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="tipo_usuario" className="form-label">Tipo de Usuário</label>
                <select
                  className="form-select"
                  id="tipo_usuario"
                  name="tipo_usuario"
                  value={formData.tipo_usuario}
                  onChange={handleChange}
                >
                  <option value="g">Garçom</option>
                  <option value="a">Administrador</option>
                  <option value="c">Cozinha</option>
                </select>
              </div>

              <div className="d-grid">
                <button type="submit" className="btn btn-primary">Cadastrar</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Index;
