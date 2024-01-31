import React, { useState,useContext } from "react";
import { AccountContext } from "../Context/AccountProvider";

function Authenticate(){
    const [clientName,setClientName] = useState('')
    const [clientPassword,setPassword] = useState('')
    const {setAccount} = useContext(AccountContext)

    const authenticateUser = async () => {
        try{
            const response = await fetch('http://localhost:8080/api/sendData',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({clientName,clientPassword})
        })
        if(!response.ok){
            throw new Error('Network respose was not ok')
        }
        const data = await response.json()
        console.log('Data sent successfully')
        setAccount(data)
        }
        catch{
            console.log('Something happened to fetch')
        }
    }
    return(
        <>
            <p>Please provide your details for Authentication</p>
            <p>Enter your name: </p>
            <input type="text" name="ClientName" id="CName" placeholder="Name" onChange={(e)=>setClientName(e.target.value)}/><br/>
            <p>Enter your Password: </p>
            <input type="text" name="ClientPassword" id="CPassWord" placeholder="Password" onChange={(e)=>setPassword(e.target.value)}/><br/>
            <button onClick={authenticateUser}>Submit</button>
        </>
    )
}

export default Authenticate