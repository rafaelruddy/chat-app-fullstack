const express = require("express");
const bcrypt = require('bcrypt');
const authentication = require("../controller/authentication");

const Message = require('../models/message');

allChats = async(req, res) => {
    try{
        const chatId = req.userId;
        const messages = await Message.find({ chat: chatId });
  
        if(messages){
        console.log(messages)
          return res.status(201).json(messages);
        }
    }
    catch (error) {
        console.error('Erro ao criar nova mensagem:', error);
        return res.status(500).json({ error: 'Erro ao pegar mensagens do chat' });
    }
}

newMessage = async (req, res) => {
    try {
    const { chatId, senderId, receiverId, content } = req.body;
  
    // verify if
    if (!chatId || !senderId || !receiverId || !content) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }
  
    // Crie uma nova mensagem no banco de dados
    const newMessage = new Message({
        chat: chatId,
        sender: senderId,
        receiver: receiverId,
        content: content
    });
  
    // Salve a mensagem no banco de dados
    await newMessage.save();
  
    // Retorne a mensagem criada como resposta
    return res.status(201).json(newMessage);
    } catch (error) {
    console.error('Erro ao criar nova mensagem:', error);
    return res.status(500).json({ error: 'Erro ao criar nova mensagem' });
    }
}

module.exports = {
    allChats,
    newMessage
}

