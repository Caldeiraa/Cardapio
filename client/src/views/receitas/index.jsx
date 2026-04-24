import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

function Receita() {
  const navigate = useNavigate();

  const [categorias, setCategorias] = useState([]);
  const [ingredientes, setIngredientes] = useState([]);
  const [produtosFiltrados, setProdutosFiltrados] = useState([]);
  
  const [mensagem, setMensagem] = useState({ texto: "", tipo: "" });
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("");

  const [formData, setFormData] = useState({
    sub_cardapio_id: "",
    ingrediente_id: "",
    quantidade: "",
    unidadeDisplay: "", // Nova propriedade para a unidade escolhida na tela
  });

  const [listaReceita, setListaReceita] = useState([]);

  // 1. CARREGAR DADOS INICIAIS
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    try {
      const decoded = jwtDecode(token);
      if (decoded.usuario_tipo !== "a") return navigate("/login");
    } catch {
      return navigate("/login");
    }

    const carregarDadosIniciais = async () => {
      try {
        const [resIngredientes, resCategorias] = await Promise.all([
          axios.get("http://localhost:3000/estoque"),
          axios.get("http://localhost:3000/cardapio")
        ]);
        setIngredientes(resIngredientes.data);
        setCategorias(resCategorias.data);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        setMensagem({ texto: "Erro ao carregar dados do servidor.", tipo: "alert-danger" });
      }
    };

    carregarDadosIniciais();
  }, [navigate]);

  // 2. BUSCA DINÂMICA NO BACKEND AO TROCAR A CATEGORIA
  useEffect(() => {
    const buscarProdutosDaCategoria = async () => {
      if (!categoriaSelecionada) {
        setProdutosFiltrados([]);
        return;
      }
      try {
        const res = await axios.get(`http://localhost:3000/subCategoria/${categoriaSelecionada}`);
        setProdutosFiltrados(res.data);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
    };

    buscarProdutosDaCategoria();
  }, [categoriaSelecionada]);

  // 3. LIDAR COM MUDANÇAS NOS INPUTS
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Se o usuário trocar o ingrediente, já setamos a unidade padrão dele
    if (name === "ingrediente_id") {
      const ing = ingredientes.find((i) => String(i.id_ingrediente) === String(value));
      setFormData((prev) => ({
        ...prev,
        ingrediente_id: value,
        unidadeDisplay: ing ? ing.unidade.toLowerCase() : "",
        quantidade: "" // Reseta a quantidade por segurança
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoriaChange = (e) => {
    setCategoriaSelecionada(e.target.value);
    setFormData((prev) => ({ ...prev, sub_cardapio_id: "" }));
  };

  // 🔥 FUNÇÃO AUXILIAR: OPÇÕES DE MEDIDA DINÂMICAS
  const getOpcoesUnidade = (unidadeBase) => {
    if (!unidadeBase) return [];
    const base = unidadeBase.toLowerCase();
    if (base === "kg") return [{ label: "Quilogramas (kg)", value: "kg" }, { label: "Gramas (g)", value: "g" }];
    if (base === "l" || base === "litro") return [{ label: "Litros (L)", value: "l" }, { label: "Mililitros (ml)", value: "ml" }];
    return [{ label: base, value: base }]; // Para unidades como 'unidade', 'fatia', etc.
  };

  // 🔥 ADICIONAR NA LISTA E FAZER A CONVERSÃO MATEMÁTICA
  const adicionarNaLista = (e) => {
    e.preventDefault();
    
    if (!formData.ingrediente_id || !formData.quantidade || !formData.unidadeDisplay) {
      return alert("Preencha todos os campos do ingrediente!");
    }

    const ingredienteSelecionado = ingredientes.find(
      (i) => String(i.id_ingrediente) === String(formData.ingrediente_id)
    );

    let quantidadeFinal = parseFloat(formData.quantidade);
    const base = ingredienteSelecionado.unidade.toLowerCase();
    const display = formData.unidadeDisplay;

    // A mágica da conversão: se o banco é Kg e o usuário digitou Gramas, divide por 1000
    if (base === "kg" && display === "g") {
      quantidadeFinal = quantidadeFinal / 1000;
    } else if ((base === "l" || base === "litro") && display === "ml") {
      quantidadeFinal = quantidadeFinal / 1000;
    }

    const novoItem = {
      ingrediente_id: formData.ingrediente_id,
      nome_ingrediente: ingredienteSelecionado.nome,
      unidade_visual: display, // O que aparece na tela (ex: g)
      quantidade_visual: formData.quantidade, // O que o usuário digitou (ex: 150)
      unidade_banco: base, // A unidade oficial (ex: kg)
      quantidade: quantidadeFinal, // O valor convertido que vai pro banco (ex: 0.15)
    };

    setListaReceita([...listaReceita, novoItem]);

    // Limpa os inputs para o próximo ingrediente
    setFormData((prev) => ({ ...prev, ingrediente_id: "", quantidade: "", unidadeDisplay: "" }));
  };

  const removerDaLista = (indexParaRemover) => {
    const novaLista = listaReceita.filter((_, index) => index !== indexParaRemover);
    setListaReceita(novaLista);
  };

  // 4. SALVAR A RECEITA COMPLETA NO BACKEND
  const handleSubmitFinal = async () => {
    if (!formData.sub_cardapio_id || listaReceita.length === 0) {
      return alert("Selecione um produto e adicione pelo menos um ingrediente!");
    }

    try {
      // Mandamos apenas o que o backend precisa (o valor convertido já está na chave 'quantidade')
      const payload = {
        sub_cardapio_id: formData.sub_cardapio_id,
        ingredientes: listaReceita.map(item => ({
          ingrediente_id: item.ingrediente_id,
          quantidade: item.quantidade
        }))
      };

      await axios.post("http://localhost:3000/receita", payload);

      setMensagem({ texto: "Receita completa salva com sucesso!", tipo: "alert-success" });
      
      setListaReceita([]);
      setFormData({ sub_cardapio_id: "", ingrediente_id: "", quantidade: "", unidadeDisplay: "" });
      setCategoriaSelecionada("");

      setTimeout(() => setMensagem({ texto: "", tipo: "" }), 3000);
    } catch (error) {
      console.error(error);
      setMensagem({ texto: "Erro ao salvar receita.", tipo: "alert-danger" });
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow p-4 rounded-4">
        <h3 className="mb-4">Montar Receita Completa</h3>

        {mensagem.texto && (
          <div className={`alert ${mensagem.tipo}`}>{mensagem.texto}</div>
        )}

        <form>
          {/* CATEGORIA E PRODUTO (Mantidos iguais) */}
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">Categoria</label>
              <select className="form-select" value={categoriaSelecionada} onChange={handleCategoriaChange} required>
                <option value="">Selecione...</option>
                {categorias.map((c) => <option key={c.id_cardapio} value={c.id_cardapio}>{c.nome_item}</option>)}
              </select>
            </div>

            <div className="col-md-6 mb-4">
              <label className="form-label fw-bold">Produto</label>
              <select name="sub_cardapio_id" className="form-select" value={formData.sub_cardapio_id} onChange={handleChange} required disabled={!categoriaSelecionada || produtosFiltrados.length === 0}>
                <option value="">{produtosFiltrados.length === 0 ? "Nenhum produto" : "Selecione o Produto"}</option>
                {produtosFiltrados.map((p) => <option key={p.id_sup_cardapio} value={p.id_sup_cardapio}>{p.nome}</option>)}
              </select>
            </div>
          </div>

          <hr />
          <h5 className="mb-3">Adicionar Ingredientes</h5>

          <div className="row align-items-end">
            {/* SELEÇÃO DO INGREDIENTE */}
            <div className="col-md-4 mb-3">
              <label className="form-label fw-bold">Ingrediente</label>
              <select name="ingrediente_id" className="form-select" value={formData.ingrediente_id} onChange={handleChange}>
                <option value="">Selecione...</option>
                {ingredientes.map((i) => (
                  <option key={i.id_ingrediente} value={i.id_ingrediente}>
                    {i.nome} (Estoque: {i.unidade})
                  </option>
                ))}
              </select>
            </div>

            {/* QUANTIDADE */}
            <div className="col-md-3 mb-3">
              <label className="form-label fw-bold">Quantidade</label>
              <input type="number" step="0.01" min="0.01" name="quantidade" className="form-control" value={formData.quantidade} onChange={handleChange} placeholder="Ex: 150" />
            </div>

            {/* UNIDADE DE MEDIDA (NOVO) */}
            <div className="col-md-3 mb-3">
              <label className="form-label fw-bold">Medida</label>
              <select name="unidadeDisplay" className="form-select" value={formData.unidadeDisplay} onChange={handleChange} disabled={!formData.ingrediente_id}>
                {getOpcoesUnidade(
                  ingredientes.find((i) => String(i.id_ingrediente) === String(formData.ingrediente_id))?.unidade
                ).map((opcao) => (
                  <option key={opcao.value} value={opcao.value}>{opcao.label}</option>
                ))}
              </select>
            </div>

            {/* BOTÃO DE ADICIONAR */}
            <div className="col-md-2 mb-3">
              <button type="button" className="btn btn-outline-primary w-100 fw-bold" onClick={adicionarNaLista}>
                + Incluir
              </button>
            </div>
          </div>
        </form>

        {/* VISUALIZAÇÃO DA LISTA COM A UNIDADE CORRETA */}
        {listaReceita.length > 0 && (
          <div className="mt-4 p-3 bg-light rounded border">
            <h5 className="mb-3 text-secondary">Ingredientes do Lanche:</h5>
            <ul className="list-group mb-4">
              {listaReceita.map((item, index) => (
                <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <span className="fw-bold">{item.nome_ingrediente}</span>
                    <span className="badge bg-secondary ms-2">
                      {item.quantidade_visual} {item.unidade_visual}
                    </span>
                    <small className="text-muted ms-2" style={{ fontSize: "0.75rem" }}>
                      (Salvará no banco como {item.quantidade} {item.unidade_banco})
                    </small>
                  </div>
                  <button type="button" className="btn btn-sm btn-danger" onClick={() => removerDaLista(index)}>
                    Remover
                  </button>
                </li>
              ))}
            </ul>

            <button type="button" className="btn btn-success w-100 fw-bold fs-5 shadow-sm" onClick={handleSubmitFinal}>
              ✅ Salvar Receita Completa
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default Receita;