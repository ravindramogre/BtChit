import React, { useState } from 'react'
import Add from "../images/avatar-image.png"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { auth, storage} from '../firebase'
import { db } from '../firebase'
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore"; 
import { useNavigate, Link } from 'react-router-dom'
import Logo from '../images/logo.png'

const Register = () => {
  const [err, setErr] = useState(false);

  const navigate  = useNavigate();

  const handleSubmit = async(e) =>{
    e.preventDefault();
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];
    try{
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const storageRef = ref(storage, displayName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on('state_changed',
        (snapshot) => {},
        (error) => {
          setErr(true);
        }, 
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            await updateProfile( res.user, {
              displayName,
              photoURL: downloadURL
            });
            await setDoc(doc(db, "users", res.user.uid), {
              uid: res.user.uid,
              displayName,
              email,
              photoURL: downloadURL
            });
            await setDoc(doc(db, "userChats", res.user.uid), {});
            navigate("/");
          }
          catch (error) {
            setErr(true);
            console.log(err);
          }
       });
      }
      catch(err){
        setErr(true);
      }
  };

  return (
    <div className='form-container'>
      <div className='form-wrapper'>
        <img className='logo' src={Logo} alt=""/>
        {/* <span className="logo"><h2>BtChat</h2></span> */}
        <span className="title">Register</span>
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="display name"/>
            <input type="email" placeholder="email"/>
            <input type="password" placeholder="password"/>
            <input style={{display:"none"}} type="file" id="file" />
            <label htmlFor="file">
                <img src={Add} alt="" />
                <span>Add a Avatar</span>
            </label>
            <button>Sign Up</button>
            {err && <span>Something went wrong</span>}
        </form>
        <p>You do have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  )
}

export default Register