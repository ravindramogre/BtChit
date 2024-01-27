import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase'
import Logo from '../images/logo.png'

const Login = () => {

  const [err, setErr] = useState(false);

  const navigate  = useNavigate();

  const handleSubmit = async(e) =>{
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;
    try{
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    }
    catch(err){
      setErr(true);
    }
  };
  return (
    <div className='form-container'>
    <div className='form-wrapper'>
      <img className='logo' src ={Logo} alt=""/>
      {/* <span className="logo"><h2>BtChat</h2></span> */}
      <span className="title">Login</span>
      <form onSubmit={handleSubmit}>
          <input type="email" placeholder="email"/>
          <input type="password" placeholder="password"/>
          <button>Sign In</button>
      </form>
      {err && <span style={{fontSize: '12px', color:'red'}}>username or password is wrong...</span>}
      <p>You don't have an account? <Link to="/register">Register</Link></p>
    </div>
  </div>
  )
}

export default Login
