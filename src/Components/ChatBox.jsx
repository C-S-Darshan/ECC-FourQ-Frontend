import React, { useState, useContext } from "react";
import { LoginContext } from '../Context/LoginContext';
import Messages from "./Message";

function ChatBox(){
    const [text, setText] = useState('');
    const [textMessage, setTextMessage] = useState('')
    const { username, uid, person, ws, setWs, requestSender } = useContext(LoginContext);

    ws.onmessage = (event) => {
        const jsonData = JSON.parse(event.data);
        console.log('Received JSON data:', jsonData);
        if(jsonData.type === "Message"){
            setTextMessage(jsonData)
        } 
        else{
            console.log("how did we get here")
        }
        
    };

    const sendMessage = () => {
        // Check if the message is not empty and if the WebSocket object is defined
        if (text.trim() !== '' && ws) {
            if (ws && ws.readyState === WebSocket.OPEN) {
                // Create a JSON object with four fields
                const dataToSend = {
                    type: "Message",
                    sender: uid,
                    receiver: requestSender,
                    field3: text
                };
    
                // Convert the JSON object to a JSON string
                const jsonData = JSON.stringify(dataToSend);
    
                // Send the JSON string to the backend through the WebSocket connection
                ws.send(jsonData);
                setText('');
            } else {
                console.log('WebSocket connection is not open');
            } // Clear the message input field after sending
        }
    };

    return(
        <>
            <h1>Hello {username}! Client ID {uid}, You have reached Chat box.</h1>
            <p>Not fully implemented yet still being built</p>
            <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                    {/* Button to send the message */}
                    <button onClick={sendMessage}>Send Message</button>
            <div>
                {textMessage?<Messages props = {textMessage}/>:null}
            </div>
        </>
    )
}

export default ChatBox 