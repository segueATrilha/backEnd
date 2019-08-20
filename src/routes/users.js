/* Importação de Bibliotecas */
const express = require('express');
const multer = require('multer');

/* Instanciação e configuração de objetos */
const routes = new express.Router();
const multerConfig = require('./../config/multer');

/* Importação de Controllers */
const UserController = require('./../app/controllers/UserController');
const AuthController = require('./../app/controllers/AuthController');

/* Importação de Middlewares de Acesso */
const AuthMiddleware = require('./../app/middlewares/authentication');

// Rotas de CRUD
routes.get('/', AuthMiddleware.authentication, UserController.show);
routes.post('/', multer(multerConfig).single('file'), UserController.store);

// Rota de Autenticação
routes.post('/login', AuthController.store);
module.exports = routes;