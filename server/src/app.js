const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const fileupload = require("express-fileupload");

class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    // Configuração do CORS para permitir requisições do frontend
    this.server.use(cors({
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }));

    // Middleware para processar JSON
    this.server.use(express.json());
    
    // Middleware para processar arquivos
    this.server.use(fileupload());
    
    // Middleware para processar dados codificados em URL (caso precise)
    this.server.use(express.urlencoded({ extended: true }));

    // Middleware para servir arquivos estáticos
    this.server.use(express.static("public"));
  }

  routes() {
    // As rotas do seu aplicativo
    this.server.use("/public/img", express.static("public/img"));
    this.server.use(routes);
  }
}

module.exports = new App().server;
