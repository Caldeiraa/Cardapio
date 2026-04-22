import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

function Receita() {
  const navigate = useNavigate();

  const [produtos, setProdutos] = useState([]);
  const [ingredientes, setIngredientes] = useState([]);
  const [mensagem, setMensagem] = useState("");

  const [formData, setFormData] = useState({
    sub_cardapio_id: "",
    ingrediente_id: "",
    quantidade: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    try {
      const decoded = jwtDecode(token);
      if (decoded.usuario_tipo !== "a") return navigate("/login");
    } catch {
      return navigate("/login");
    }

    carregarDados();
  }, [navigate]);

  const carregarDados = async () => {
    try {
      const resProdutos = await axios.get("http://localhost:3000/subcardapio");
      const resIngredientes = await axios.get("http://localhost:3000/estoque");

      setProdutos(resProdutos.data);
      setIngredientes(resIngredientes.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:3000/receita", formData);
      setMensagem("Receita cadastrada!");

      setFormData({
        sub_cardapio_id: "",
        ingrediente_id: "",
        quantidade: "",
      });
    } catch (error) {
      console.error(error);
      setMensagem("Erro ao cadastrar receita");
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow p-4 rounded-4">
        <h3 className="mb-4">Cadastro de Receita</h3>

        {mensagem && <div className="alert alert-info">{mensagem}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Produto</label>
            <select
              name="sub_cardapio_id"
              className="form-select"
              value={formData.sub_cardapio_id}
              onChange={handleChange}
              required
            >
              <option value="">Selecione</option>
              {produtos.map((p) => (
                <option key={p.id_sup_cardapio} value={p.id_sup_cardapio}>
                  {p.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label>Ingrediente</label>
            <select
              name="ingrediente_id"
              className="form-select"
              value={formData.ingrediente_id}
              onChange={handleChange}
              required
            >
              <option value="">Selecione</option>
              {ingredientes.map((i) => (
                <option key={i.id_ingrediente} value={i.id_ingrediente}>
                  {i.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label>Quantidade usada</label>
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

          <button className="btn btn-success w-100">
            Cadastrar Receita
          </button>
        </form>
      </div>
    </div>
  );
}

export default Receita;