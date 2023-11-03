import React from 'react';
import { useNavigate } from 'react-router-dom';

const ChatBody = ({ messages, lastMessageRef, typingStatus, info }) => {
  const navigate = useNavigate();

  const handleLeaveChat = () => {
    navigate('/chat/1');
    window.location.reload();
  };

  return (
    <>
      <header className="chat__mainHeader">
        <p>{info && info?.receiver?.name}</p>
        <button className="leaveChat__btn" onClick={handleLeaveChat}>
          LEAVE CHAT
        </button>
      </header>

      <div className="message__container">
        {messages && messages.map((message, index) =>
          message.sender === info.sender._id ? (
            <div className="message__chats" key={index}>
              <div className="message__sender">
                <p>{message.content}</p>
              </div>
            </div>
          ) : (
            <div className="message__chats" key={index}>
              <p>{info.receiver.name}</p>
              <div className="message__recipient">
                <p>{message.content}</p>
              </div>
            </div>
          )
        )}

        <div className="message__status">
            <p>{typingStatus}</p>
        </div>
        <div ref={lastMessageRef} />
      </div>
    </>
  );
};

export default ChatBody;