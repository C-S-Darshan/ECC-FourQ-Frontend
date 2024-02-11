// UserList.js
import React, { useContext, useEffect, useState } from 'react';
import { LoginContext } from '../Context/LoginContext';
import UserListItem from './UserListItem';
import ChatBox from './ChatBox';
import {Box,Button, styled} from '@mui/material'

const Container = styled(Box)`
    padding-top:100px;
    align-items: center;
    height: 100vh;
    width: 100%;
`

const UserContainer = styled(Box)`
    height: 370px;
    width: 350px;
    padding:25px;
    margin-left:auto;
    margin-right:auto;
    margin-top:20px;
    margin-bottom:20px;
    border-radius:16px;
    display:flex;
    align-items:center;
    flex-direction: column;
    

`

function UserList() {
    const [message, setMessage] = useState('');
    const { username, uid, person, ws, setWs } = useContext(LoginContext);
    const [clientId, setClientId] = useState(''); // State to store the client identifier
    const [users, setUsers] = useState([]);
    const [Request, setRequest] = useState(false);
    const {requestSender, setRequestSender} = useContext(LoginContext);
    const [chat, setChat] = useState(false);

    useEffect(() => {
        // Establish WebSocket connection when the component mounts
        const websocket = new WebSocket('ws://localhost:8088/ws/RegisterClient');

        // Event listener for connection open
        websocket.onopen = () => {
            console.log('WebSocket connected');

            // Send username and uid to the backend on first-time connection
            const initialMessage = JSON.stringify({ username: username, uid: uid });
            websocket.send(initialMessage);
        };

        // Event listener for receiving messages
        websocket.onmessage = (event) => {
            const jsonData = JSON.parse(event.data);
            console.log('Received JSON data:', jsonData);
            if(jsonData.type === "Request"){
                setRequest(true)
                setRequestSender(jsonData.sender)
            } else if (jsonData.type === "Response" && jsonData.field3 === "Yes"){
                setRequestSender(jsonData.sender)
                setChat(true)
            }
            
        };

        // Event listener for connection close
        websocket.onclose = () => {
            console.log('WebSocket disconnected');
        };

        // Store the WebSocket object in state
        setWs(websocket);
        fetchUsers()

        // Clean up function to close the WebSocket connection when the component unmounts
        return () => {
            websocket.close();
        };
    }, []); // Empty dependency array ensures that this effect runs only once, when the component mounts

    async function fetchUsers() {
        try {
            const response = await fetch('http://localhost:8080/api/getUsers'); // Replace this with your endpoint
            const data = await response.json();
            var d = JSON.parse(data)
            setUsers(d);
            console.log(users);
            console.log(typeof(users))
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    }

    // Function to handle sending messages
    /* remove this form here later */
    const sendMessage = () => {
        // Check if the message is not empty and if the WebSocket object is defined
        if (message.trim() !== '' && ws) {
            // Send the message to the WebSocket server
            ws.send(message);
            setMessage(''); // Clear the message input field after sending
        }
    };

    const sendRequest = (websocket, person) => {
        console.log("Made a Request to talk");
        if (websocket && websocket.readyState === WebSocket.OPEN) {
            // Create a JSON object with four fields
            const dataToSend = {
                type: "Request",
                sender: uid,
                receiver: person.ID,
                field3: " "
            };

            // Convert the JSON object to a JSON string
            const jsonData = JSON.stringify(dataToSend);

            // Send the JSON string to the backend through the WebSocket connection
            websocket.send(jsonData);
        } else {
            console.log('WebSocket connection is not open');
        }
    };

    const sendResponse = (websocket) => {
        console.log("accepted request");
        if (websocket && websocket.readyState === WebSocket.OPEN) {
            // Create a JSON object with four fields
            const dataToSend = {
                type: "Response",
                sender: uid,
                receiver: requestSender,
                field3: "Yes"
            };

            // Convert the JSON object to a JSON string
            const jsonData = JSON.stringify(dataToSend);

            // Send the JSON string to the backend through the WebSocket connection
            websocket.send(jsonData);
            setRequest(false)
            setChat(true)
        } else {
            console.log('WebSocket connection is not open');
        }
    };

    return (
        <>
            {chat ? <ChatBox /> :
                <Container>
                    <h2>Welcome {username}!, Click on the users below to select the user to start texting</h2>
                    <p>Client ID: {uid}</p>
                    {/* Input field to type the message */}
                    {/* <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    {/* Button to send the message */}
                    {/*<button onClick={sendMessage}>Send Message</button> */}
                    <br />
                    {/* <button onClick={fetchUsers}>Get Users/Refesh User List</button> */}
                    <h3>User List</h3>
                    <Button variant="contained" onClick={fetchUsers}>Refresh User List</Button>
                    <UserContainer>
                    {users.length > 0 && users.map((user, index) => (
                        user.Username !== username &&
                        <UserListItem key={index} user={user} />
                    ))}
                    </UserContainer>
                    {/* <button onClick={() => sendRequest(ws, person)}>Chat with {person.Username}</button> */}
                    <Button variant="contained" onClick={() => sendRequest(ws, person)}>Chat with {person.Username}</Button>
                    <br/><br/>
                    {Request ? 
                    <Button variant="contained" onClick={() => sendResponse(ws)}>Accept Messages from Client ID{requestSender}</Button>
                    /* <button onClick={() => sendResponse(ws)}>Accept Messages from Client ID{requestSender}</button>  */: null}
                </Container>
            }
        </>
    );
}

export default UserList;
