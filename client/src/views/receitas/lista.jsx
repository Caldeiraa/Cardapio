import React, { useEffect, useState } from "react";
import axios from "axios";

function ListaReceitas() {
  const [receitas, setReceitas] = useState([]);

  useEffect(() => {
    carregar();
  }, []);

  const carregar = async () => {
    try {
      const res = await axios.get("http://localhost:3000/receita");
      setReceitas(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow p-4 rounded-4">
        <h3 className="mb-4">Receitas</h3>

        <table className="table table-striped">
          <thead>
            <tr>
              <th>Produto</th>
              <th>Ingrediente</th>
              <th>Quantidade</th>
            </tr>
          </thead>
          <tbody>
            {receitas.map((r, index) => (
              <tr key={index}>
                <td>{r.produto}</td>
                <td>{r.ingrediente}</td>
                <td>{r.quantidade}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ListaReceitas;