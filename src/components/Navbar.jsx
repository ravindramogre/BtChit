import React,{ useContext } from 'react'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase'
import { AuthContext } from '../context/AuthContext'
import Logo  from "../images/logo.png"

const Navbar = () => {

  const {currentUser} = useContext(AuthContext);
  return (
    <div className="nav-container">
      <div className="navbar">
          <img src={Logo} alt=""/>
          {/* <span className="logo">BtChat</span> */}
          <div className="user">
              <img src={currentUser.photoURL} alt="" />
              <span>{currentUser.displayName}</span>
              <button onClick={()=> signOut(auth)}>Logout</button>
          </div>
      </div>
      <div id="border"></div>
    </div>
  )
}

export default Navbar
