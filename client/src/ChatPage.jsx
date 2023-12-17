import React, { useEffect, useState, useRef, useContext } from 'react';
import ChatBar from './ChatBar';
import ChatBody from './ChatBody';
import ChatFooter from './ChatFooter';
import axios from './api/axios';
import { useParams } from 'react-router-dom';
import { useNavigate, Link } from "react-router-dom";
import Modal from '@mui/material/Modal';
import { Box, Button, List, ListItem, ListItemIcon, Avatar, ListItemText } from '@mui/material';
const ChatPage = ({ socket }) => {
  const [messages, setMessages] = useState([]);
  const [typingStatus, setTypingStatus] = useState('');
  const [contacts, setContacts] = useState([])
  const [availableContacts, setAvailableContacts] = useState([])
  const [info, setInfo] = useState([])
  const lastMessageRef = useRef(null);
  const [newContact, setNewContact] = useState([])
  const params = useParams();
  const [newMessage, setNewMessage] = useState([])
  const id = params.id;
  const [modal, setModal] = useState(false);
  const navigate = useNavigate();

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  };

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

  useEffect(() => {
    async function getAvailableAccounts() {
        try{
            const response = await axios.get('/users', {
              withCredentials:true
            });
            setAvailableContacts(response?.data)
            console.log(response?.data)
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
    getAvailableAccounts()
  }, [])


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
            console.log("Unauthorized")
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
    if(newMessage.length !== 0) {
      setMessages((prevMessages) => [newMessage, ...prevMessages ]);
    }
  }, [newMessage]);

  useEffect(() => {
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

  const handleNewContact = async (id) => {
      try {
        const response = await axios.post('/chat/handle', JSON.stringify({
            targetUser: id
          }),
          {
            headers: {
              'Content-Type': 'application/json',
              
            },
            withCredentials: true
          }
        );
        console.log(JSON.stringify(response?.data))
        setNewContact([])
        selectModal()
        navigate(`../chat/${response?.data._id}`);
      } catch (error) {
        console.error('Erro ao verificar/criar chat:', error);
      }
  }


  return (
    <div className="chat">
      <ChatBar socket={socket} contacts={contacts} selectModal={selectModal} sender={ info.sender ? info?.sender.name : ""} />
      <div className="chat__main">
        <ChatBody
            messages={messages}
            typingStatus={typingStatus}
            lastMessageRef={lastMessageRef}
            info = {info}
        />
        <ChatFooter socket={socket} info = {info} setNewMessage = {setNewMessage} />
      </div>
      <Modal
        open={modal}
        onClose={selectModal}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{ ...style, width: 500 }}>
          <h2>Adicione novos contatos!</h2>
          <List>
              {availableContacts.users &&
                availableContacts.users.map((item) => {
                  return (
                    <ListItem
                      button
                      key={item._id}
                      onClick={() => handleNewContact(item._id)}
                    >
                      <ListItemIcon>
                        <Avatar sx={{ bgcolor: "secondary.main" }} />
                      </ListItemIcon>
                      <ListItemText primary={item.email}>
                        {item.email}
                      </ListItemText>
                      <ListItemText
                        secondary="online"
                        align="right"
                      ></ListItemText>
                    </ListItem>
                  );
                })}
            </List>
        </Box>
      </Modal>
    </div>
  );
};

export default ChatPage;