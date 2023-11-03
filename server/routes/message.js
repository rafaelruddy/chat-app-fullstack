const express = require("express");
const bcrypt = require('bcrypt');
const authentication = require("../controller/authentication");

const Message = require('../models/message');
const {
  allChats,
  newMessage
} = require("../controller/messageController")

const router = express.Router();

router.get('/messages/chat/:id', allChats);

router.post('/messages/new', newMessage);
  


module.exports = router;
