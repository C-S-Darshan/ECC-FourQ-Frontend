// Authentication.js
import React, { useState, useContext } from "react";
import { LoginContext } from "../Context/LoginContext";
import CryptoJS from "crypto-js";

function Authenticate() {
    const [clientName, setClientName] = useState('');
    const [clientPassword, setPassword] = useState('');
    const [encryptedText, setEncryptedText] = useState('');
    const [isAuthorized, setIsAuthosrised] = useState(true)
    const {setShowList} = useContext(LoginContext)
    const {setUsername} = useContext(LoginContext) 
    const {setUid} = useContext(LoginContext)

    function encryptData(data, key) {
        const encrypted = CryptoJS.AES.encrypt(data, key, {
          mode: CryptoJS.mode.ECB,
          padding: CryptoJS.pad.Pkcs7
        });
      
        console.log(encrypted.toString())
        return encrypted.toString();
      }

    

    const authenticateUser = async () => {
        setEncryptedText(encryptData(clientName, "YourSecretKey123"))
        try {
            const response = await fetch('http://localhost:8080/api/sendData', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ clientName, clientPassword })
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log('Data sent successfully');
            console.log(data.Authorised);
            if (data.Authorised) {
                setUsername(clientName);
                setUid(data.Uid)
                setShowList(true);
                console.log(data.Uid)
                
            }
            else{
                setIsAuthosrised(false)
            }
        } catch (error) {
            console.error('Error occurred during authentication:', error);
        }
    };

    return (
        <>
            <p>Please provide your details for Authentication</p>
            <p>Enter your name: </p>
            <input type="text" name="ClientName" id="CName" placeholder="Name" onChange={(e) => setClientName(e.target.value)} /><br />
            <p>Enter your Password: </p>
            <input type="text" name="ClientPassword" id="CPassWord" placeholder="Password" onChange={(e) => setPassword(e.target.value)} /><br />
            <button onClick={authenticateUser}>Submit</button>
            {isAuthorized ? null : <p>Looks like you made a mistake entering your credentials<br/>Please try again</p>}
        </>
    );
}

export default Authenticate;
