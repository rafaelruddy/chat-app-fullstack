import React, { useEffect, useState, useRef, useContext } from 'react';
import ChatBar from './ChatBar';
import ChatBody from './ChatBody';
import ChatFooter from './ChatFooter';
import axios from './api/axios';
import { useParams } from 'react-router-dom';
import Modal from './Modal';
const ChatPage = ({ socket }) => {
  const [messages, setMessages] = useState([]);
  const [typingStatus, setTypingStatus] = useState('');
  const [contacts, setContacts] = useState([])
  const [info, setInfo] = useState([])
  const lastMessageRef = useRef(null);
  const [newContact, setNewContact] = useState([])
  const params = useParams();
  const [newMessage, setNewMessage] = useState([])
  const id = params.id;
  const [modal, setModal] = useState(false);

  useEffect(() => {
    async function getContacts() {
        try{
            const response = await axios.get('/chat/private/getAll', {
              withCredentials:true
            });
            setContacts(response?.data)
            
        }catch(err) {
            if(!err?.response) {
                console.log('No server Response')
            } else if(err.response?.status === 401) {
                console.log("a")
            } else {
                console.log("Login falhou")
            }
        }
    }
    getContacts()
  }, [newContact])


  useEffect(()=> {
    async function getInfoFromChat() {
      try{
        const response = await axios.get(`/chat/private/getInfo/${id}`, {
          withCredentials: true
        }); 
        setInfo(response?.data)
        socket.emit("userjoined", response?.data);
      } catch(err) {
        if(!err?.response) {
          console.log('No server Response')
        } else if(err.response?.status === 401) {
            console.log("a")
        } else {
            console.log("Informacao do chat falhou")
        }
      }

    }
    getInfoFromChat();
  }, [id]);

  useEffect(() => {
    socket.on('messageResponse', (data) => setMessages([...messages, data]));
    socket.on("chat", function (message) {
      setMessages([...messages, message]);
    });
  }, [socket, messages]);
  
  useEffect(() => {
    console.log(newMessage);
    if(newMessage.length !== 0) {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    }
  }, [newMessage]);

  useEffect(() => {
    // 👇️ scroll to bottom every time messages change
    lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    socket.on("setup-chat", function (messages) {
      setMessages(messages)
    });

    socket.on('typingResponse', (data) => setTypingStatus(data));
  }, [socket]);
    
  const selectModal = (info) => {
    setModal(!modal)
  }

  return (
    
    <div className="chat">
      <ChatBar socket={socket} contacts={contacts} selectModal={selectModal} />
      <div className="chat__main">
      <ChatBody
          messages={messages}
          typingStatus={typingStatus}
          lastMessageRef={lastMessageRef}
          info = {info}
      />
      <ChatFooter socket={socket} info = {info} novo = {setNewMessage} />
      </div>
      <Modal 
        displayModal={modal}
        closeModal={selectModal}
      />
    </div>
  );
};

export default ChatPage;