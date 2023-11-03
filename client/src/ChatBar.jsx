import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

const ChatBar = ({contacts}) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('../');
    window.location.reload();
  };

  return (
    <div className="chat__sidebar">
      
      <h2>Live Chat</h2>

      <div>
        <h4 className="chat__header">Contatos</h4>
        <div className="chat__users">
          {contacts && contacts.map((item) => {
            return (
              <Link className= "contato" key={item._id} to={`../chat/${item._id}`}>
                <p>{item.receiver.name}</p>
                <hr></hr>
              </Link>
            )
          })}
          
        </div>
      </div>
        <button className="logout__btn" onClick={handleLogout}>
          LOGOUT
        </button>
    </div>
  );
};

export default ChatBar;