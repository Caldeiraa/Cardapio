import React from 'react'
import Lanche from '../../img/hamburguer.png'
import Espetinho from '../../img/espetinho.png'
import Sorvete from '../../img/sorvete.png'
import Combo from '../../img/combo.png'
import './cardapio.css'

function Index() {

  

  return (
    <div className="container mt-4">
      <div className="text-center mb-4">
        <h1>Cardápio - Botique</h1>
      </div>

      <div className="row">
        <div className="col-12 col-sm-6 d-flex justify-content-center mb-4">
          <a href="/sub_categoria" target="_blank" rel="noopener noreferrer">
            <img className="img-cardapio" src={Lanche} alt="Lanche" />
          </a>
        </div>
        <div className="col-12 col-sm-6 d-flex justify-content-center mb-4">
          <a href="/sub_categoria" target="_blank" rel="noopener noreferrer">
            <img className="img-cardapio" src={Espetinho} alt="Espetinho" />
          </a>
        </div>
        <div className="col-12 col-sm-6 d-flex justify-content-center mb-4">
          <a href="/sub_categoria" target="_blank" rel="noopener noreferrer">
            <img className="img-cardapio" src={Sorvete} alt="Sorvete" />
          </a>
        </div>
        <div className="col-12 col-sm-6 d-flex justify-content-center mb-4">
          <a href="/sub_categoria" target="_blank" rel="noopener noreferrer">
            <img className="img-cardapio" src={Combo} alt="Combo" />
          </a>
        </div>
      </div>
    </div>
  )
}

export default Index
