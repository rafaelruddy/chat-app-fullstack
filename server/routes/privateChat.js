const express = require("express");
const authentication = require("../controller/authentication");
const Chat = require("../models/privateChat");
const User = require("../models/user");

const mongoose = require('mongoose');
const {
    handleChat,
    getAllChats,
    getInfo
} = require("../controller/chatController")

const router = express.Router();

router.post('/chat/handle', authentication.authenticateJWT, handleChat);

router.get('/chat/private/getAll', authentication.authenticateJWT, getAllChats);

router.get('/chat/private/getInfo/:id', authentication.authenticateJWT, getInfo);


module.exports = router;