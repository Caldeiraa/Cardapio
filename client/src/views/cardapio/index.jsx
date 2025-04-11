import React from 'react'
import Lanche from '../../img/hamburguer.png'
import Espetinho from '../../img/espetinho.png'
import Sorvete from '../../img/sorvete.png'
import Combo from '../../img/combo.png'
import './cardapio.css'

function Index() {
  return (
    <div>
      <div className="titulo">
        <h1>Cardápio - MuriloBotique</h1>
      </div>

      <div className="container">
        <div className="row">
          <div className="col-6 d-flex justify-content-center mb-4">
            <img className="img-um" src={Lanche} alt="Lanche" />
          </div>
          <div className="col-6 d-flex justify-content-center mb-4">
            <img className="img-dois" src={Espetinho} alt="Espetinho" />
          </div>
        </div>
        <div className="row">
          <div className="col-6 d-flex justify-content-center mb-4">
            <img className="img-tres" src={Sorvete} alt="Sorvete" />
          </div>
          <div className="col-6 d-flex justify-content-center mb-4">
            <img className="img-tres" src={Combo} alt="Combo" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Index
