const express = require("express");
const bcrypt = require('bcrypt');
const authentication = require("../controller/authentication");
const User = require("../models/user");
const mongoose = require('mongoose');

getCurrentUser = async (req, res) => {
    const userId = req.params.id;
  
    try {
      const user = await User.findById(userId, 'name profilephoto');
      

  
      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }
  
      res.status(200).json({ user });
    } catch (err) {
      console.error('Erro ao obter informações do usuário', err);
      res.status(500).json({ message: 'Ocorreu um erro ao obter informações do usuário' });
    }
}

editUserInfo = async (req, res) => {
    try {
      const userId = req.params.id;
      const { email, name, password } = req.body;
  
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }
  
      // Verificar se o usuário que está editando é o mesmo do token
      if (user.id !== req.user.id) {
        return res.status(403).json({ message: 'Não autorizado' });
      }
  
      // Atualizar as informações do usuário
      user.email = email;
      user.name = name;
  
  
      // Caso queira atualizar a senha
      if (password) {
        user.password = await bcrypt.hash(password, 10);
      }
  
      await user.save();
  
      res.status(200).json({ message: 'Informações do usuário atualizadas com sucesso' });
    } catch (err) {
      console.error('Erro ao editar as informações do usuário', err);
      res.status(500).json({ message: 'Ocorreu um erro ao editar as informações do usuário' });
    }
}

deleteUser = async (req, res) => {
    try {
      const userId = req.params.id;
  
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }
  
      // Verificar se o usuário que está deletando é o mesmo do token
      if (user.id !== req.user.id) {
        return res.status(403).json({ message: 'Não autorizado' });
      }
  
      await user.remove();
  
      res.status(200).json({ message: 'Usuário deletado com sucesso' });
    } catch (err) {
      console.error('Erro ao deletar o usuário', err);
      res.status(500).json({ message: 'Ocorreu um erro ao deletar o usuário' });
    }
}


loginUser = async (req, res) => {
 
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      
      if (!user) {
        return res.status(401).json({ message: 'Usuário ou senha inválidos' });
      }
  
      const passwordMatch = await bcrypt.compare(password, user.password);
  
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Usuário ou senha inválidos' });
      }
  
      delete user.password;
      const token = authentication.generateToken(user);
      
      res.cookie('token',token, {httpOnly: true, sameSite: 'none', secure: true , maxAge: 24 * 60 * 60 * 1000})
      res.status(200).json({ message: 'Login realizado com sucesso' });
    } catch (err) {
      console.error('Erro ao fazer login', err);
      res.status(500).json({ message: 'Ocorreu um erro ao fazer login' });
    }
}

createUser =  async (req, res) => {
    const { email, name, password } = req.body;
    console.log("a")
    try {
      const existingUser = await User.findOne({ email });
  
      if (existingUser) {
        return res.status(409).json({ message: 'Usuário já existe' });
      }

     
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
        _id: new mongoose.Types.ObjectId(),
        email,
        name,
        password: hashedPassword
      });
     
  
      await user.save();
  
      const token = authentication.generateToken(user);
      res.status(201).json({ message: 'Conta criada com sucesso', token });
    } catch (err) {
      console.error('Erro ao criar conta', err);
      res.status(500).json({ message: 'Ocorreu um erro ao criar a conta' });
    }
}

usersList = async (req, res) => {
    try {
        const userId = req.userId
        // const users = await User.find({}, 'email');
        const users = await User.find({_id: { $ne: req.userId }}, 'email');

        // const users = User.find({ _id: { $ne: req.userId } })
        res.status(200).json({ users });
    } catch (err) {
        console.error('Erro ao obter a lista de usuários', err);
        res.status(500).json({ message: 'Ocorreu um erro ao obter a lista de usuários' });
    }
}


module.exports = {
    getCurrentUser,
    editUserInfo,
    deleteUser,
    loginUser,
    createUser,
    usersList
    
}


