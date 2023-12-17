import * as React from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Avatar,
  Grid,
  Paper,
} from "@mui/material";
import Stack from '@mui/material/Stack';
import { useNavigate } from 'react-router-dom';


const ChatBody = ({ messages, lastMessageRef, typingStatus, info }) => {
    const navigate = useNavigate();
    const handleLeaveChat = () => {
      navigate('/chat/1');
      window.location.reload();
    };

  return (
    <Box
      sx={{
        height: "90vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "grey.200",
      }}
    >
      <Grid container component={Paper} style={{ padding: "20px" }} display={'flex'} justifyContent={'space-between'}>
        <Grid item>
          <Stack spacing={2} direction="row" display={'flex'} alignItems={'center'}>
            <Avatar sx={{ bgcolor: "secondary.main" }}>
              {info.receiver?.name[0].toUpperCase()}
            </Avatar>
            <p>{info && info?.receiver?.name}</p>
          </Stack>
        </Grid>

        <Grid item>
          <Box display="flex" justifyContent="flex-end">
              <Button variant="contained" onClick={handleLeaveChat}>SAIR DO CHAT</Button>
          </Box>
        </Grid>
      </Grid>
      <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1, overflow: "auto", p: 2, flexDirection: "column-reverse" }}>
        {messages && messages.map((message) => (
          message.sender === info.sender._id ? (
            <Message key={message.id} message={message} sender={"self"} info={info} />
          ) : (
            <Message key={message.id} message={message} sender={"other"} info={info}/>
          )
        ))}
      <div ref={lastMessageRef} style={{width: "150px", backgroundColor: "red"}}/>
      </Box>
    </Box>
  );
};

const Message = ({ message, sender, info }) => {
  const isOther = sender === "other";

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isOther ? "flex-start" : "flex-end",
        mb: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: isOther ? "row" : "row-reverse",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ bgcolor: isOther ? "secondary.main" : "primary.main" }}>
          {isOther ? info.receiver.name[0].toUpperCase() : "Eu"}
        </Avatar>
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            ml: isOther ? 1 : 0,
            mr: isOther ? 0 : 1,
            backgroundColor: isOther ? "secondary.light" : "primary.light",
            borderRadius: isOther ? "20px 20px 20px 5px" : "20px 20px 5px 20px",
          }}
        >
          <Typography variant="body1">{message.content}</Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default ChatBody;

// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import Grid from '@mui/material/Grid';
// import List from '@mui/material/List';
// import ListItem from '@mui/material/ListItem';
// import ListItemText from '@mui/material/ListItemText';
// import { Paper, Typography } from '@mui/material';

// const ChatBody = ({ messages, lastMessageRef, typingStatus, info }) => {
//   const navigate = useNavigate();

//   const handleLeaveChat = () => {
//     navigate('/chat/1');
//     window.location.reload();
//   };

//   return (
//     // <>
//     //   <header className="chat__mainHeader">
//     //     <p>{info && info?.receiver?.name}</p>
//     //     <button className="leaveChat__btn" onClick={handleLeaveChat}>
//     //       LEAVE CHAT
//     //     </button>
//     //   </header>

//     //   <div className="message__container">
//     //     {messages && messages.map((message, index) =>
//     //       message.sender === info.sender._id ? (
//     //         <div className="message__chats" key={index}>
//     //           <div className="message__sender">
//     //             <p>{message.content}</p>
//     //           </div>
//     //         </div>
//     //       ) : (
//     //         <div className="message__chats" key={index}>
//     //           <p>{info.receiver.name}</p>
//     //           <div className="message__recipient">
//     //             <p>{message.content}</p>
//     //           </div>
//     //         </div>
//     //       )
//     //     )}

//     //     <div className="message__status">
//     //         <p>{typingStatus}</p>
//     //     </div>
//     //     <div ref={lastMessageRef} />
//     //   </div>
//     // </>

//   <Grid item xs={9}>
//     <List sx={{height: '90vh', overflowY: 'auto'}}>
//         <ListItem  key="1">
//             <Grid container>
//                 <Grid item xs={12}>
//                     <ListItemText align="right" primary="Hey man, What's up ?"></ListItemText>
//                 </Grid>
//                 <Grid item xs={12}>
//                     <ListItemText align="right" secondary="09:30"></ListItemText>
//                 </Grid>
//             </Grid>

//             <Paper
//                   align="right"
//                   variant="outlined"
//                   sx={{
//                     p: 2,
//                     ml: 0,
//                     mr: 1,
//                     backgroundColor: "primary.light",
//                     borderRadius: "20px 20px 5px 20px",
//                   }}
//                 >
//                   <Typography variant="body1"><ListItemText align="right" primary="Hey man, What's up ?"></ListItemText></Typography>
//                 </Paper>

            
//         </ListItem>
//         <ListItem key="2">
//             <Grid container>
//                 <Grid item xs={12}>
//                     <ListItemText align="left" primary="Hey, Iam Good! What about you ?"></ListItemText>
//                 </Grid>
//                 <Grid item xs={12}>
//                     <ListItemText align="left" secondary="09:31"></ListItemText>
//                 </Grid>
//             </Grid>
//         </ListItem>
//         <ListItem key="3">
//             <Grid container>
//                 <Grid item xs={12}>
//                     <ListItemText align="right" primary="Cool. i am good, let's catch up!"></ListItemText>
//                 </Grid>
//                 <Grid item xs={12}>
//                     <ListItemText align="right" secondary="10:30"></ListItemText>
//                 </Grid>
//             </Grid>
//         </ListItem>
//     </List>
//   </Grid>
//   );
// };

// export default ChatBody;