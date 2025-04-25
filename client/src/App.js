import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import Navbar from './components/index';
import Cardapio from './views/cardapio/index';
import SubCardapio from './views/sub_cardapio/index'; // Cliente
import SubCardapioGarcom from './views/sub_cardapio/sub_cardapioGar'; // Garçom
import Login from './views/login/index';
import CadastroU from './views/cadastroUsuarios/index';
import Pedidos from './views/pedidos/index';
import CardapioG from './views/garcon/cardapio'
import Cozinha from './views/cozinha/index'
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Cardapio />} />
        <Route path="/garcom/cardapio" element={<CardapioG />} />
        <Route path="/sub_categoria/:id_cardapio" element={<SubCardapio />} />
        <Route path="/cozinha" element={<Cozinha />} />
        <Route path="/garcom/sub_categoria/:id_cardapio" element={<SubCardapioGarcom />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastroU" element={<CadastroU />} />
        <Route path="/pedidos" element={<Pedidos />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
