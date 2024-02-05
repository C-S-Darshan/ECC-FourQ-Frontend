import React, { useState} from "react";
import UserList from "./UserList";
import Authenticate from "./Authentication";
import { LoginContext } from "../Context/LoginContext";

function ChatApp(){
    const [username, setUsername] = useState("")
    const [uid, setUid] = useState("")
    const [showList, setShowList] = useState(false)
    const [person, setPerson] = useState([])


    return(
        <LoginContext.Provider value={{username,setUsername,setShowList,setUid, uid,person,setPerson}}>
        <h1>Chat app based on FourQ ECC</h1>
        {(showList)?<UserList/>:<Authenticate/>}
        </LoginContext.Provider>
    )
}

export default ChatApp