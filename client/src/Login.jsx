import React, {useState, useEffect, useRef, useContext} from 'react'
import AuthContext from './context/AuthProvider';
import axios from './api/axios';
const LOGIN_URL = '/login'
import './Login.css'
import { useNavigate, Link } from 'react-router-dom';



function Login({ socket }) {
    const {setAuth} = useContext(AuthContext);
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [alert, setAlert] = useState(false);
    const navigate = useNavigate();


    useEffect(() => {
        const timer = setTimeout(() => {
          setAlert(false);
        }, 3000);
        
        return () => clearTimeout(timer);
    }, [error]);     
        
    
    const handleSubmit = async e => {
        e.preventDefault();
        try{
            
            const response = await axios.post(LOGIN_URL, JSON.stringify({email,password}), 
            {
                headers: {
                  'Content-Type': 'application/json',
                  
                },
                withCredentials: true
              }
            )
            
            console.log(JSON.stringify(response?.data))
            
            setAuth({email, password})
            socket.emit('newUser', { email, socketID: socket.id });
            navigate('/chat/1');
        }catch(err) {
            if(!err?.response) {
                setError('No server Response')
                setAlert(true);
                setTimeout(() => {
                    setAlert(false);
                }, 3000);
            } else if (err.response?.status === 400) {
                setError('Misssing username or password')
                setAlert(true);
                setTimeout(() => {
                    setAlert(false);
                }, 3000);
            } else if(err.response?.status === 401) {
                setError(err.response.data.message)
                setAlert(true);
                setTimeout(() => {
                    setAlert(false);
                }, 3000);
            } else {
                setError('Login failed')
                setAlert(true);
                setTimeout(() => {
                    setAlert(false);
                }, 3000);
            }
            console.log(error)
        }    
    }

    return (
        <div className="container">
            {alert && <div className={`alert`}>Erro: {error}</div>}
            <form id="loginForm" onSubmit={handleSubmit} className='login'>
                <div className='titles'>
                    <h1>Live Chat</h1>
                    <h2>Login</h2>
                </div>

                

                <div className='user'>
                    <label className="label" htmlFor="email">Usuário:</label>
                    <input type="email" id="email" name="email" required onChange={e => setEmail(e.target.value)}/>
                </div>
                <div className='password'>
                    <label className="label" htmlFor="password">Senha:</label>
                    <input type="password" id="password" name="password" required onChange={e => setPassword(e.target.value)}/>
                </div>


                <button type="submit" className='submitBtn'>Login</button>
        
                <Link className= "contato" to={`../signup`}>
                    <p>Registrar-se</p>
                </Link>
            </form>
        </div>
    )
}

export default Login
