import React, { useState} from "react";
import UserList from "./UserList";
import Authenticate from "./Authentication";
import { LoginContext } from "../Context/LoginContext";
import { AppBar, Toolbar, styled } from "@mui/material";

const Header = styled(AppBar)`
    
`

function ChatApp(){
    const [username, setUsername] = useState("")
    const [uid, setUid] = useState("")
    const [showList, setShowList] = useState(false)
    const [person, setPerson] = useState([])
    const [ws, setWs] = useState(null);
    const [requestSender, setRequestSender] = useState('')
    const [sharedKey, setSharedKey] = useState("")


    return(
        <LoginContext.Provider value={{username,setUsername,setShowList,setUid, uid,person,setPerson,ws,setWs,requestSender,setRequestSender,sharedKey,setSharedKey}}>
            <Header>
                <Toolbar>
                    <h1>Chat app based on FourQ ECC</h1>
                </Toolbar>    
            </Header>
        {(showList)?<UserList/>:<Authenticate/>}
        </LoginContext.Provider>
    )
}

export default ChatApp