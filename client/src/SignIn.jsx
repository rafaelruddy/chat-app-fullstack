import React, { useState, useEffect, useRef, useContext } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Snackbar from "@mui/material/Snackbar";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
const LOGIN_URL = "/login";
import { useNavigate } from "react-router-dom";
import axios from "./api/axios";
import AuthContext from "./context/AuthProvider";
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function SignIn({ socket }) {
  const { setAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [alert, setAlert] = useState(false);

  const handleClose = () => {
    setAlert(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get("email");
    const password = data.get("password");

    try {
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({ email, password }),
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      setAuth({ email, password });
      socket.emit("newUser", { email, socketID: socket.id });
      navigate("/chat/1");
    } catch (err) {
      if (!err?.response) {
        setError("No server Response");
        setAlert(true);
        setTimeout(() => {
          setAlert(false);
        }, 3000);
      } else if (err.response?.status === 400) {
        setError("Misssing username or password");
        setAlert(true);
        setTimeout(() => {
          setAlert(false);
        }, 3000);
      } else if (err.response?.status === 401) {
        setError(err.response.data.message);
        setAlert(true);
        setTimeout(() => {
          setAlert(false);
        }, 3000);
      } else {
        setError("Login failed");
        setAlert(true);
        setTimeout(() => {
          setAlert(false);
        }, 3000);
      }
      console.log(error);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Login
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Endereço de email"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Senha"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Faça Login
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Esqueceu sua senha?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  {"Não possui uma conta? Registrar-se"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          open={alert}
          onClose={handleClose}
          message={error}
          autoHideDuration={3000}
        >
          <Alert severity="error">{error}</Alert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  );
}
