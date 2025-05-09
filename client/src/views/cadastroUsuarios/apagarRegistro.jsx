import React, { useEffect, useState } from 'react';
import axios from 'axios';

function FuncionariosList() {
    const [usuarios, setUsuarios] = useState([]);

    useEffect(() => {
        carregarUsuarios();
    }, []);

    const carregarUsuarios = () => {
        axios.get('http://localhost:3000/usuarios')
            .then(res => setUsuarios(res.data))
            .catch(err => console.error("Erro ao buscar usuários:", err));
    };

    const desativarUsuario = (id_usuario) => {
        if (window.confirm("Tem certeza que deseja desativar este funcionário?")) {
            axios.put(`http://localhost:3000/usuarios/${id_usuario}/desativar`)
                .then(() => {
                    alert("Funcionário desativado com sucesso.");
                    carregarUsuarios(); // Recarrega lista
                })
                .catch(err => {
                    console.error("Erro ao desativar:", err);
                    alert("Erro ao desativar funcionário.");
                });
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Lista de Funcionários</h2>
            <div className="table-responsive">
                <table className="table table-bordered table-hover align-middle shadow-sm rounded">
                    <thead className="table-dark">
                        <tr>
                            <th>Nome</th>
                            <th>Tipo</th>
                            <th>Login</th>
                            <th>Status</th>
                            <th>Ação</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="text-center">Nenhum funcionário encontrado.</td>
                            </tr>
                        ) : (
                            usuarios.map(usuario => (
                                <tr key={usuario.id_usuario}>
                                    <td>{usuario.nome_usuario}</td>
                                    <td className="text-capitalize">{usuario.tipo_usuario}</td>
                                    <td>{usuario.login}</td>
                                    <td>
                                        <span className={`badge ${usuario.ativo ? 'bg-success' : 'bg-danger'}`}>
                                            {usuario.ativo ? 'Ativo' : 'Desativado'}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => desativarUsuario(usuario.id_usuario)}
                                            disabled={!usuario.ativo}
                                        >
                                            Desativar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default FuncionariosList;
