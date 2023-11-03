const mongoose = require('mongoose');
let Schema = mongoose.Schema;

const chatSchema = new Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
});

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;