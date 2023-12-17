const express = require("express");
const bcrypt = require('bcrypt');
const authentication = require("../controller/authentication");
const Chat = require("../models/privateChat");

handleChat = async (req, res) => {
    try {
        const userId = req.userId;
        const { targetUser } = req.body;

        // Verifique se os IDs dos usuários foram fornecidos
        if (!userId || !targetUser) {
            return res.status(400).json({ error: 'IDs de usuário inválidos' });
        }

        // Verifique se já existe um chat entre os dois usuários
        const existingChat = await Chat.findOne({
            participants: { $all: [userId, targetUser] }
        });

        // Se o chat existir, retorne-o como resposta
        if (existingChat) {
            return res.status(201).json(existingChat);
        }

        // Se o chat não existir, crie um novo chat
        const newChat = new Chat({
            participants: [userId, targetUser]
        });

        // Salve o novo chat no banco de dados
        await newChat.save();

        // Retorne o novo chat como resposta
        return res.status(201).json(newChat);
    } catch (error) {
        console.error('Erro ao verificar/criar chat:', error);
        return res.status(500).json({ error: 'Erro ao verificar/criar chat' });
    }
}

getAllChats = async (req, res) => {
    try {
        const userId = req.userId;

        // this will find the chat by the userId, populate the participants with more info, them lean the query to transform into a js object.
        const chats = await Chat.find({ participants: userId }).populate('participants', 'name profilephoto').lean();
        
        for(let chat of chats) {
            chat.sender = chat.participants.find(participant => participant._id == userId);
            chat.receiver = chat.participants.find(participant => participant._id != userId);  
        }
        

        // return chats with all the info needed
        
        return res.status(201).json(chats);

    } catch (error) {
        return res.status(500).json({ error: 'Erro ao verificar/criar chat' });
    }
}

getInfo = async (req, res) => {
    try {
        const userId = req.userId;
        const chatId = req.params.id;
        
        //verify if user participates in chat
        const chat = await Chat.findOne({ _id: chatId, participants: userId }).populate('participants', 'name profilephoto');

        if(!chat) { 
            return res.status(400).json({ error: 'Você não participa desse chat!' });
        }
        
        
        const sender = chat.participants.find(participant => participant._id == userId);
        const receiver = chat.participants.find(participant => participant._id != userId);   

        return res.status(201).json({sender, receiver, chatId});
       
       

    } catch (error) {
        // console.error('Erro ao pegar informações do chat:', error);
        return res.status(500).json({ error: 'Erro ao pegar informações do chat.' });
    }
}

module.exports = {
    handleChat,
    getAllChats,
    getInfo
}