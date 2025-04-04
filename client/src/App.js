import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import Navbar from './components/index'
import './App.css';
import Cardapio from './views/cardapio/index'

function App() {
  return (
    <BrowserRouter>
    <Navbar/>
    <Routes>
     <Route path='/' element={<Cardapio/>}/>
    </Routes>
    </BrowserRouter>
  );
}

export default App;
