import React, { useState, useContext, useEffect } from "react";
import { LoginContext } from '../Context/LoginContext';
import Messages from "./Message";
import {Box, Button, styled} from '@mui/material'

const Container = styled(Box)`
    padding-top:100px;
    align-items: center;
    height: 100vh;
    width: 100%;
`
const MessageContainer = styled(Box)`
    height:500px;
    width:1200px;
    border: solid 1px #bebebe;
    margin-left: auto;
    margin-right:auto;
    border-radius:16px;
    margin-top:50px;
`

function ChatBox(){
    const [text, setText] = useState('');
    const [messages, setMessages] = useState([]); // State to hold messages
    const { username, uid, person, ws, setWs, requestSender } = useContext(LoginContext);

    useEffect(() => {
        // Set up WebSocket message event listener
        if (ws) {
            ws.onmessage = (event) => {
                const jsonData = JSON.parse(event.data);
                console.log('Received JSON data:', jsonData);
                if(jsonData.type === "Message"){
                    // Add the new message to the messages list
                    setMessages(prevMessages => [...prevMessages, jsonData]);
                } 
                else {
                    console.log("how did we get here")
                }
            };
        }
    }, [ws]); // Run effect only when ws changes

    const sendMessage = () => {
        // Check if the message is not empty and if the WebSocket object is defined
        if (text.trim() !== '' && ws) {
            if (ws.readyState === WebSocket.OPEN) {
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
            }
        }
    };

    return(
        <>
            <Container>
            <h2>Hello {username}! Client ID {uid}, You have reached Chat box.</h2>
            {/* <p>Not fully implemented yet still being built</p> */}
            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
            {/* Button to send the message */}
            {/* <button onClick={sendMessage}>Send Message</button> */}
            <br/>
            <br/>
            <Button variant="contained" onClick={sendMessage}> Send Message</Button>
            <MessageContainer>
                {/* Render each message separately */}
                {messages.map((message, index) => (
                    <Messages key={index} props={message} />
                ))}
            </MessageContainer>
            </Container>
        </>
    )
}

export default ChatBox;
