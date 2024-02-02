// UserList.js
import React, { useContext,useEffect, useState } from 'react';
import { LoginContext } from '../Context/LoginContext';

function UserList() {
    const [message, setMessage] = useState('')
    const {username} = useContext(LoginContext)
    const [ws, setWs] = useState(null); // State to store the WebSocket object
  const [clientId, setClientId] = useState(''); // State to store the client identifier

  useEffect(() => {
    // Establish WebSocket connection when the component mounts
    const websocket = new WebSocket('ws://localhost:8088/ws');

    // Event listener for connection open
    websocket.onopen = () => {
      console.log('WebSocket connected');
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
  }, []); // Empty dependency array ensures that this effect runs only once, when the component mounts

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
      <h1>WebSocket Component</h1>
      <p>Client ID: {clientId}</p>
      {/* Input field to type the message */}
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      {/* Button to send the message */}
      <button onClick={sendMessage}>Send Message</button>
    </div>
  );
}

export default UserList;
