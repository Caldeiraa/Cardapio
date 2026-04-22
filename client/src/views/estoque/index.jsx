import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

function Estoque() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nome: "",
    unidade: "kg",
    quantidade: "",
    minimo: "",
  });

  const [ingredientes, setIngredientes] = useState([]);
  const [mensagem, setMensagem] = useState("");

  // 🔐 valida token (igual você já faz)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    try {
      const decoded = jwtDecode(token);
      if (decoded.usuario_tipo !== "a") {
        return navigate("/login");
      }
    } catch {
      return navigate("/login");
    }

    carregarIngredientes();
  }, [navigate]);

  // 📦 carregar estoque
  const carregarIngredientes = async () => {
    try {
      const res = await axios.get("http://localhost:3000/estoque");
      setIngredientes(res.data);
    } catch (error) {
      console.error("Erro ao carregar estoque", error);
    }
  };

  // 📥 form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 🚀 submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:3000/estoque", formData);

      setMensagem("Ingrediente cadastrado!");
      setFormData({
        nome: "",
        unidade: "kg",
        quantidade: "",
        minimo: "",
      });

      carregarIngredientes();
    } catch (error) {
      console.error(error);
      setMensagem("Erro ao cadastrar!");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row">
        
        {/* FORM */}
        <div className="col-md-5">
          <div className="card shadow p-4 rounded-4">
            <h4 className="mb-3">Cadastro de Estoque</h4>

            {mensagem && (
              <div className="alert alert-info">{mensagem}</div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label>Nome</label>
                <input
                  type="text"
                  name="nome"
                  className="form-control"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label>Unidade</label>
                <select
                  name="unidade"
                  className="form-select"
                  value={formData.unidade}
                  onChange={handleChange}
                >
                  <option value="kg">Kg</option>
                  <option value="g">Gramas</option>
                  <option value="un">Unidade</option>
                </select>
              </div>

              <div className="mb-3">
                <label>Quantidade</label>
                <input
                  type="number"
                  step="0.01"
                  name="quantidade"
                  className="form-control"
                  value={formData.quantidade}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label>Estoque mínimo</label>
                <input
                  type="number"
                  step="0.01"
                  name="minimo"
                  className="form-control"
                  value={formData.minimo}
                  onChange={handleChange}
                  required
                />
              </div>

              <button className="btn btn-success w-100">
                Cadastrar
              </button>
            </form>
          </div>
        </div>

        {/* LISTA */}
        <div className="col-md-7">
          <div className="card shadow p-4 rounded-4">
            <h4 className="mb-3">Estoque Atual</h4>

            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Ingrediente</th>
                  <th>Qtd</th>
                  <th>Mínimo</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {ingredientes.map((item) => (
                  <tr key={item.id_ingrediente}>
                    <td>{item.nome}</td>
                    <td>
                      {item.quantidade} {item.unidade}
                    </td>
                    <td>{item.minimo}</td>
                    <td>
                        
                      {Number(item.quantidade) <= Number(item.minimo) ? (
                        <span className="badge bg-danger">
                          Baixo
                        </span>
                      ) : (
                        <span className="badge bg-success">
                          OK
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

          </div>
        </div>

      </div>
    </div>
  );
}

export default Estoque;