import React, { useState, useContext } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import { collection, query, where, getDocs, getDoc, setDoc, doc , updateDoc, serverTimestamp} from "firebase/firestore";
import { db } from '../firebase';
import { AuthContext } from '../context/AuthContext';

const SearchBar = () => {

    const [username, setUserName] = useState("");
    const [user, setUser] = useState(null);
    const [err, setErr] = useState(false);

    const { currentUser } = useContext(AuthContext);

    const handleSearch = async()=>{
        const q = query(collection(db, "users"), where("displayName", "==",  username));
        try{
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                setUser(doc.data());
            });
        }
        catch(err){
            setErr(true);
        }
    }
    const handleKey =e=>{
        e.code==="Enter" && handleSearch();
    }

    const handleSelect = async() =>{
        //create user chats  

        const combinedId = currentUser.uid > user.uid ? currentUser.uid + user.uid : user.uid + currentUser.uid;
        console.log(combinedId)
        try{
            const res = await getDoc(doc(db, "chats", combinedId))

            if(!res.exists()){
                //create a chat in chats collection
                await setDoc(doc( db, "chats", combinedId), {messages:[]});

                //create user chats
                await updateDoc(doc(db, "userChats", currentUser.uid), {
                    [combinedId + ".userInfo"]:{
                        uid : user.uid,
                        displayName: user.displayName,
                        photoURL: user.photoURL
                    },
                    [combinedId + ".date"]: serverTimestamp(),
                });

                await updateDoc(doc( db, "userChats", user.uid) ,{
                    [combinedId + ".userInfo"]:{
                        uid : currentUser.uid,
                        displayName: currentUser.displayName,
                        photoURL: currentUser.photoURL
                    },
                    [combinedId + ".date"]: serverTimestamp(),
                });
            }
        }
        catch(err){}

        setUser(null);
        setUserName("");
    };
    return  (
        <div className="search">
            <div className="search-form">
                <Input style={{borderColor: 'white', backgroundColor: "whitesmoke"}} size="default" placeholder="Search or start new chat..." onKeyDown={handleKey} onChange={e=>setUserName(e.target.value)} value = {username} prefix={<SearchOutlined />} variant='filled'/>
            </div>
            <hr style={{border: 'none',height: '1px', padding: '0px', margin: '0px', backgroundColor: 'whitesmoke'}}/>
            {err && <span>user not found..</span>}
            {user && <div className="user-chat" onClick={handleSelect}>
                <img src={user.photoURL} alt="" />
                <div className="user-chat-info"> 
                    <span>{user.displayName}</span>
                </div>
            </div>}
        </div>
        )
}

export default SearchBar;