import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { BrowserRouter as Router, Routes, Route, Outlet, RouterProvider } from 'react-router-dom';
import './App.css'
import Login from './Login';
import ChatPage from './ChatPage';
import io from 'socket.io-client';
import SignUp from './SignUp';
const socket = io.connect("http://localhost:3000/");
function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);

  return (
    <Router basename='/Chat-App'>
      <Routes>
        <Route path="/" element={<Login socket={socket}/>} />
        <Route path="/signup" element={<SignUp socket={socket}/>} />
        <Route path="/chat/:id" element={<ChatPage socket={socket} />}></Route>
      </Routes>
    </Router>
   
  )
}

export default App
