import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import Navbar from './components/index';
import Cardapio from './views/cardapio/index';
import SubCardapio from './views/sub_cardapio/index'; // Cliente
import SubCardapioGarcom from './views/sub_cardapio/sub_cardapioGar'; // Garçom
import Login from './views/login/index';
import CadastroU from './views/cadastroUsuarios/index';
import CardapioG from './views/garcon/cardapio'
import Cozinha from './views/cozinha/index'
import CadastroItens from './views/cadastroItens/index'
import FechamentoCaixa from './views/Fechamento/index';
import ListaU from './views/cadastroUsuarios/apagarRegistro'
import ListaItens from './views/cadastroItens/listaItens'
import CastroCardapio from './views/cardapio/cadastro'
import './App.css';
import CadastroCardapio from './views/cardapio/cadastro';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Cardapio />} />
        <Route path="/cadastro/cardapio" element={<CadastroCardapio/>} /> 
        <Route path="/garcom/cardapio" element={<CardapioG />} />
        <Route path="/sub_categoria/:id_cardapio" element={<SubCardapio />} />
        <Route path="/cozinha" element={<Cozinha />} />
        <Route path="/garcom/sub_categoria/:id_cardapio" element={<SubCardapioGarcom />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastroU" element={<CadastroU />} />
        <Route path="/cadastroI" element={<CadastroItens />} />
        <Route path="/lista/usuarios" element={<ListaU />} />
        <Route path="/fechamento" element={<FechamentoCaixa />} />
        <Route path="/lista/itens" element={<ListaItens />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
