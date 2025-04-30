const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');

const app = express();

// MIDDLEWARES
app.use(cors());
app.use(fileUpload()); // <===== IMPORTANTE!!!
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ROTAS
const routes = require('./src/app/routes');
app.use(routes);

module.exports = app;
