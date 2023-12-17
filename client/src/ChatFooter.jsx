import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Fab from "@mui/material/Fab";
import SendIcon from "@mui/icons-material/Send";

const ChatFooter = ({ socket, info, setNewMessage }) => {
  const [message, setMessage] = useState("");

  const handleTyping = () =>
    socket.emit("typing", `${info.sender.name} is typing`);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      {
        console.log(info);
      }
      socket.emit("chat", {
        room: info.chatId,
        sender: info.sender._id,
        receiver: info.receiver._id,
        content: message,
      });
      setNewMessage({ sender: info.sender._id, content: message });
    }
    setMessage("");
  };
  return (
    <Grid
      container
      component={"form"}
      noValidate
      autoComplete="off"
      style={{ padding: "20px" }}
    >
      <Grid item xs={11}>
        <TextField
          id="outlined-basic-email"
          label="Digite algo..."
          fullWidth
          style={{
            backgroundColor: "white",
          }}
          onChange={(event) => {
            setMessage(event.target.value);
          }}
        />
      </Grid>
      <Grid item xs={1} align="right">
        <Fab color="primary" aria-label="add" onClick={handleSendMessage}>
          <SendIcon />
        </Fab>
      </Grid>
    </Grid>
  );
};

export default ChatFooter;
