// Authentication.js
import React, { useState, useContext } from "react";
import { LoginContext } from "../Context/LoginContext";
import CryptoJS from "crypto-js";

function Authenticate() {
    const [clientName, setClientName] = useState('');
    const [clientPassword, setPassword] = useState('');
    const [encryptedUname, setEncryptedUname] = useState('');
    const [encryptedPass, setEncryptedPass] = useState('');
    const [isAuthorized, setIsAuthorised] = useState(true)
    const {setShowList} = useContext(LoginContext)
    const {setUsername} = useContext(LoginContext) 
    const {setUid} = useContext(LoginContext)
    var keys = ["2b7e151628aed2a6", "3ad77bb40d7a3660", "6958b0d7f6fe6fa4", "c82ce39b671217bb","a225a56e6f6fd553"];

    function encryptData(data, key) {
        // Convert the key to a WordArray
        const keyHex = CryptoJS.enc.Utf8.parse(key);
    
        // Encrypt the data using AES and ECB mode
        const encrypted = CryptoJS.AES.encrypt(data, keyHex, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
    
        // Return the encrypted data as a Base64-encoded string
        return encrypted.toString();
    }

    

      const authenticateUser = async () => {
        /* const randomIndex = Math.floor(Math.random() * 5)
        console.log(randomIndex) */
        setEncryptedUname(encryptData(clientName, keys[0]));
        setEncryptedPass(encryptData(clientPassword, keys[0]));
        try {
            const response = await fetch('http://localhost:8080/api/sendData', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    "clientName": encryptedUname.toString(), 
                    "clientPassword": encryptedPass.toString() 
                })
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const data = await response.json();
            console.log('Data sent successfully');
            console.log(data.Authorised);
    
            if (data.Authorised===1) {
                setUsername(clientName);
                setUid(data.Uid);
                setShowList(true);
                console.log(data.Uid);
            } else {
                setIsAuthorised(false);
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
