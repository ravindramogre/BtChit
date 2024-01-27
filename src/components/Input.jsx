import React, {useState, useContext} from 'react'
import Attach from '../images/attach.png'
import Img from '../images/img.png'
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import {v4  as uuid} from 'uuid';
import { doc, arrayUnion, Timestamp, updateDoc, serverTimestamp} from 'firebase/firestore';
import { db } from '../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from '../firebase'

const Input = () => {

  const [text, setText] = useState("");
  const [img, setImg] = useState(null);

  const {currentUser} = useContext(AuthContext);
  const {data} = useContext(ChatContext);

  const handleSend = async ()=>{
      console.log(img);
      if(img){
        const storageRef = ref(storage, uuid());
        const uploadTask = uploadBytesResumable(storageRef, img);
        uploadTask.on(
        (error) => {
          console.log("error" + img);
        }, 
        () => {
            getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
              await updateDoc(doc(db, "chats", data.chatId), {
                messages: arrayUnion({
                  id: uuid(),
                  text, 
                  senderId: currentUser.uid,
                  date: Timestamp.now(),
                  img: downloadURL
                })
              });
            });
          }
        )
      }
      else {
        if(text!=""){
          await updateDoc(doc(db, "chats", data.chatId), {
            messages: arrayUnion({
              id: uuid(),
              text, 
              senderId: currentUser.uid,
              date: Timestamp.now()
            })
          });
        }
      }
      if(text!=""){
        // update chat section for currentUser
        await updateDoc(doc(db, "userChats", currentUser.uid),{
          [data.chatId + ".lastMessage"] :{
            text
          },
          [data.chatId + ".date"]: serverTimestamp()
        })

        //update chat section for user
        await updateDoc(doc(db, "userChats", data.user.uid),{
          [data.chatId + ".lastMessage"] :{
            text
          },
          [data.chatId + ".date"]: serverTimestamp()
        })
      }
      setText("");
      setImg(null);
  }
  return (
    <div className="input">
        <input type="text" placeholder='Type Something...' onChange={e=>setText(e.target.value)} value={text}/>
        <div className="send">
          <img src={Attach} alt="" />
          <input type="file" style={{display:"none"}} id="file" onChange ={e=>setImg(e.target.files[0])}/>
          <label htmlFor='file'>
            <img src={Img} alt=""></img>
          </label>
          <button onClick={handleSend}>Send</button>
        </div>
    </div>
  )
}

export default Input
