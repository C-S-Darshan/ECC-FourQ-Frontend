import React, { useState, useContext, useEffect } from "react";
import { LoginContext } from '../Context/LoginContext';
import Message from "./Message";
import UserList from "./UserList"; // Import UserList component
import { Box, Button, styled, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material'
import CryptoJS from "crypto-js";

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
    margin-bottom:50px;
`

const ChatButton = styled(Button)`
    background: red;
    color: #fff;
`

const CustomDialogTitle = styled(DialogTitle)`
    background: #333;
    color: #fff;
`

const CustomDialogContent = styled(DialogContent)`
    background: #333;
    color: #fff;
`

const CustomDialogActions = styled(DialogActions)`
    background: #333;
`

const StyledTextField = styled(TextField)`
    & .MuiOutlinedInput-root {
        border-color: white; /* Change border color */
        border-width: 2px; /* Increase border width */
        border-radius: 10px; /* Add border radius */
        width: 1000px;
        margin-right:20px; /* Set width */
    }
    & .MuiInputLabel-root {
        color: white; /* Change label color */
    }
    & .MuiOutlinedInput-input {
        color: white; /* Change input text color */
    }
    & .MuiOutlinedInput-notchedOutline {
        border-color: white !important; /* Change outline border color */
    }
`
const StyledSendButton = styled(Button)`
  && {
    background-color: transparent;
    color: white;
    border: 2px solid white !important;
    border-radius: 10px;
    margin-left: 10px;
    padding: 16px 20px;
    height: 54px; /* Adjust height to match the text field */
  }

  &&:hover {
    background-color: white;
    color: black;
  }
`;

function ChatBox() {
    const [text, setText] = useState('');
    const [messages, setMessages] = useState([]); // State to hold messages
    const { username, uid, ws, requestSender, sharedKey, } = useContext(LoginContext);
    const [showUserList, setShowUserList] = useState(false);
    const [disconnectDialogOpen, setDisconnectDialogOpen] = useState(false);

    useEffect(() => {
        // Set up WebSocket message event listener
        if (ws) {
            ws.onmessage = (event) => {
                const jsonData = JSON.parse(event.data);
                console.log('Received JSON data:', jsonData);
                if (jsonData.type === "Message") {
                    // Add the new message to the messages list
                    setMessages(prevMessages => [...prevMessages, jsonData]);
                } else if (jsonData.type === "Disconnect") {
                    // Handle disconnect packet received
                    if (jsonData.receiver === uid) {
                        setDisconnectDialogOpen(true);
                    } else {
                        setShowUserList(true);
                    }
                }
            };
        }
    }, []); // Run effect only once on component mount

    function encryptAES(text, key) {
        const keyHex = CryptoJS.enc.Hex.parse(key);
        const encrypted = CryptoJS.AES.encrypt(text, keyHex, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
        return encrypted.toString();
    }

    function formatDate(date = new Date()) {
        // Month names array
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];
    
        // Get date components
        const month = monthNames[date.getMonth()];
        const day = String(date.getDate()).padStart(2, '0');
        const year = date.getFullYear();
        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // Handle midnight
        const timeString = `${hours}:${minutes} ${ampm}`;
    
        // Formatted date and time string
        return `${month} ${day} ${year}, ${timeString}`;
    }

    const sendMessage = () => {
        // Check if the message is not empty and if the WebSocket object is defined
        if (text.trim() !== '' && ws) {
            if (ws.readyState === WebSocket.OPEN) {
                // Create a JSON object with four fields
                const encrypted = encryptAES(text, sharedKey);
                const currentFormattedDateTime = formatDate();
                const dataToSend = {
                    type: "Message",
                    sender: uid,
                    receiver: requestSender,
                    field3: encrypted,
                    field4: currentFormattedDateTime
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

    const handleDisconnect = () => {
        // Check if WebSocket is available and open
        if (ws && ws.readyState === WebSocket.OPEN) {
            const disconnectPacket = {
                type: "Disconnect",
                sender: uid,
                receiver: requestSender
            };
            ws.send(JSON.stringify(disconnectPacket));
            setShowUserList(true);
        }
    };

    const handleCloseDisconnectDialog = () => {
        setDisconnectDialogOpen(false);
    };

    return (
        <>
        {showUserList ? 
            (<UserList/>) :
            (<Container>
                <h2>Hello {username}!, You are currently in a secure chat session.</h2>
                <MessageContainer>
                    {/* Render each message separately */}
                    {messages.map((message, index) => (
                        <Message key={index} props={message} />
                    ))}
                </MessageContainer>
                <StyledTextField
                            variant="outlined"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Enter your message..."
                />
                <StyledSendButton variant="contained" onClick={sendMessage}> Send Message</StyledSendButton><br/><br/><br/><br/>
                <ChatButton variant="contained" onClick={handleDisconnect}>Leave chat</ChatButton> {/* Disconnect Button */}
            </Container>)
        }
        <Dialog open={disconnectDialogOpen} onClose={handleCloseDisconnectDialog}>
            <CustomDialogTitle>The other person has left the chat</CustomDialogTitle>
            <CustomDialogContent>
                You will be redirected to the user list.
            </CustomDialogContent>
            <CustomDialogActions>
                <Button onClick={() => { handleCloseDisconnectDialog(); setShowUserList(true); }}>OK</Button>
            </CustomDialogActions>
        </Dialog>
        </>
    )
}

export default ChatBox;