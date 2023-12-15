const express = require("express");
const bcrypt = require('bcrypt');
const authentication = require("../controller/authentication");
const User = require("../models/user");
const mongoose = require('mongoose');
const {
  getCurrentUser,
  editUserInfo,
  deleteUser,
  loginUser,
  createUser,
  usersList,
  logoutUser
} = require("../controller/userController")


// const multer = require('multer');

// // Configurar o multer para armazenar os arquivos no disco
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/');
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//     cb(null, file.fieldname + '-' + uniqueSuffix);
//   }
// });

// const upload = multer({ storage });


const router = express.Router();

// Rota para obter o nome do usuário atual
router.get('/user/:id', authentication.authenticateJWT, getCurrentUser);

// Rota para editar as informações do usuário
router.put('/users/:id', authentication.authenticateJWT, editUserInfo);

// Rota para deletar o usuário
router.delete('/users/:id', authentication.authenticateJWT, deleteUser);

// Rota para criar uma nova conta de usuário
router.post('/signup',  createUser);

// Rota para fazer login
router.post('/login', loginUser);

// Rota para fazer logout
router.post('/logout', logoutUser);

//Rota para pegar todos os usuários
router.get('/users', authentication.authenticateJWT, usersList);

module.exports = router;
