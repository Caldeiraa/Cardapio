import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import Navbar from './components/index';
import Sub_cardapio from './views/sub_cardapio/index';
import './App.css';
import Cardapio from './views/cardapio/index';
import Login from './views/login/index'
import CadastroU from './views/cadastroUsuarios/index'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path='/' element={<Cardapio />} />
        <Route path='sub_categoria/:id_cardapio' element={<Sub_cardapio />} />
        <Route path='/fun' element={<Login />} />
        <Route path='/cadastroU' element={<CadastroU />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
