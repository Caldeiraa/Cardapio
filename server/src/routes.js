const express = require("express")
const router = express.Router

const routes = new router()

const SubCardapio = require("./app/controllers/subCardapioController")

routes.get("/getCadastroUs",(req,res)=>{
    res.sendFile("usuario2.html",{root:'./public'})
})

routes.get("/subCategoria/:id_cardapio",SubCardapio.show)

module.exports = routes