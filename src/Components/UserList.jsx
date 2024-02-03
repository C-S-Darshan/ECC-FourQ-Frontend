// UserList.js
import React, { useContext,useEffect, useState } from 'react';
import { LoginContext } from '../Context/LoginContext';
import UserListItem from './UserListItem';

function UserList() {
    const [message, setMessage] = useState('')
    const {username} = useContext(LoginContext)
    const {uid} = useContext(LoginContext)
    const [registerWS, setRegisterWS] = useState(false)
    const [ws, setWs] = useState(null); // State to store the WebSocket object
  const [clientId, setClientId] = useState(''); // State to store the client identifier
  const [users, setUsers] = useState([]);

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
      console.log('Received client ID:', event.data);
      setClientId(event.data);
    };
  
    // Event listener for connection close
    websocket.onclose = () => {
      console.log('WebSocket disconnected');
    };
  
    // Store the WebSocket object in state
    setWs(websocket);
  
    // Clean up function to close the WebSocket connection when the component unmounts
    return () => {
      websocket.close();
    };
  }, []);  // Empty dependency array ensures that this effect runs only once, when the component mounts


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
  const sendMessage = () => {
    // Check if the message is not empty and if the WebSocket object is defined
    if (message.trim() !== '' && ws) {
      // Send the message to the WebSocket server
      ws.send(message);
      setMessage(''); // Clear the message input field after sending
    }
  };

  return (
    <div>
      <h1>User List</h1>
      <p>Welcome {username}!, Click on the users below to start a conversation</p>
      <p>Client ID: {uid}</p>
      {/* Input field to type the message */}
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      {/* Button to send the message */}
      <button onClick={sendMessage}>Send Message</button>
      <br/><br/>
      <button onClick={fetchUsers}>Get Users/Refesh User List</button>
      {users.length > 0 && users.map((user, index) => (
                <UserListItem key={index} Uname={user.Uname} UserID={user.UserID} />
            ))}
    </div>
  );
}

export default UserList;
