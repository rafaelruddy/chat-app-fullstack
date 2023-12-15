import React, { useState } from 'react';

const ChatFooter = ({ socket, info, novo }) => {
  const [message, setMessage] = useState('');

  const handleTyping = () =>
    socket.emit('typing', `${info.sender.name} is typing`);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      {console.log(info)}
      socket.emit("chat", {
        room: info.chatId,
        sender: info.sender._id,
        receiver: info.receiver._id,
        content: message
      });
      novo({sender: info.sender._id, content: message})
    }
    setMessage('');
  };
  return (
    <div className="chat__footer">
      <form className="form" onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder="Digite aqui..."
          className="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleTyping}
        />
        <button className="sendBtn">SEND</button>
      </form>
    </div>
  );
};

export default ChatFooter;