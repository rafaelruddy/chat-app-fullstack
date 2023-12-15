import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from './api/axios';
const LOGOUT_URL = '/logout'

const ChatBar = ({contacts, selectModal}) => {
  const navigate = useNavigate();

  const handleLogout = async () => {

    const response = await axios.post(LOGOUT_URL, JSON.stringify({}), 
    {
        headers: {
          'Content-Type': 'application/json',
          
        },
        withCredentials: true
      }
    )
    navigate('../');
    window.location.reload();
  };

  return (
    <div className="chat__sidebar">
      
      <div className='chat__apptitle'>
        <h2>Live Chat</h2>
        <button className='logout__btn' onClick={selectModal}>Novo Contato</button>
      </div>

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