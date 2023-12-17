import React from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "./api/axios";
const LOGOUT_URL = "/logout";
import {
  Box,
  TextField,
  Button,
  Typography,
  Avatar,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Menu,
  MenuItem,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const ChatBar = ({ contacts, selectModal, sender }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    const response = await axios.post(LOGOUT_URL, JSON.stringify({}), {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    navigate("../");
    window.location.reload();
  };

  const handleChangeContact = (id) => {
    navigate(`../chat/${id}`);
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Grid
        container
        sx={{
          height: "10vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Grid item xs={8}>
          <Typography
            variant="h5"
            className="header-message"
            textAlign={"center"}
          >
            Chat
          </Typography>
        </Grid>
        <Typography variant="body2" color="text.secondary">
          <Button
            id="basic-button"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
            sx={{color: "grey"}}
          >
            <MoreVertIcon/>
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem onClick={() => {
              selectModal()
              handleClose()
            }}>Novo Contato</MenuItem>
          </Menu>
        </Typography>
      </Grid>
      <Grid
        container
        component={Paper}
        sx={{
          width: "100%",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Grid item sx={{ borderRight: "1px solid #e0e0e0" }}>
          <List>
            <ListItem button key="RemySharp">
              <ListItemIcon>
                <Avatar sx={{ bgcolor: "primary.main" }} />
              </ListItemIcon>
              <ListItemText primary={`${sender} (Você)`}></ListItemText>
            </ListItem>
          </List>
          <Divider />
          <Grid item xs={12} style={{ padding: "10px" }}>
            <TextField
              id="outlined-basic-email"
              label="Search"
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Divider />
          <List>
            {contacts &&
              contacts.map((item) => {
                return (
                  <ListItem
                    button
                    key={item._id}
                    onClick={() => handleChangeContact(item._id)}
                  >
                    <ListItemIcon>
                      <Avatar sx={{ bgcolor: "secondary.main" }} />
                    </ListItemIcon>
                    <ListItemText primary={item.receiver.name}>
                      {item.receiver.name}
                    </ListItemText>
                    <ListItemText
                      secondary="online"
                      align="right"
                    ></ListItemText>
                  </ListItem>
                );
              })}
          </List>
        </Grid>
        <Grid
          item
          marginTop={"auto"}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          height={"10vh"}
        >
          <Button variant="contained" fullWidth onClick={handleLogout}>
            LOGOUT
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ChatBar;
