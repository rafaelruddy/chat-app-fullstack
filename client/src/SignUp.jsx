import React, {useState, useEffect, useRef, useContext} from 'react'
import AuthContext from './context/AuthProvider';
import axios from './api/axios';
const SIGNUP_URL = '/signup'
import './Login.css'
import { useNavigate, Link } from 'react-router-dom';



function SignUp({ socket }) {
    const {setAuth} = useContext(AuthContext);
    const [email, setEmail] = useState();
    const [name, setName] = useState();
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
            
            const response = await axios.post(SIGNUP_URL, JSON.stringify({email,name,password}), 
            {
                headers: {
                  'Content-Type': 'application/json',
                  
                },
                withCredentials: true
              }
              )
            
        
            navigate('../');
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
            {alert && error.length > 0 && <div className={`alert`}>Erro: {error}</div>}
            <form id="loginForm" onSubmit={handleSubmit} className='login'>
                <div className='titles'>
                    <h1>Live Chat</h1>
                    <h2>Sign Up</h2>
                </div>

                

                <div className='user'>
                    <label className="label" htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" required onChange={e => setEmail(e.target.value)}/>
                </div>

                <div className='username'>
                    <label className="label" htmlFor="name">Nome:</label>
                    <input type="text" id="name" name="name" required onChange={e => setName(e.target.value)}/>
                </div>

                <div className='password'>
                    <label className="label" htmlFor="password">Senha:</label>
                    <input type="password" id="password" name="password" required onChange={e => setPassword(e.target.value)}/>
                </div>


                <button type="submit" className='submitBtn'>Sign Up</button>

                <Link className= "contato" to={`../`}>
                    <p>Fazer Login</p>
                </Link>
            </form>
        </div>
    )
}

export default SignUp
