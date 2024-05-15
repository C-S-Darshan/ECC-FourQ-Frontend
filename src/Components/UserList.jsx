import React, { useContext, useEffect, useState } from 'react';
import { LoginContext } from '../Context/LoginContext';
import UserListItem from './UserListItem';
import ChatBox from './ChatBox';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, styled } from '@mui/material';
import CryptoJS from "crypto-js";



const Container = styled(Box)`
    padding-top: 150px; /* Increased padding to push content down */
    align-items: center;
    min-height: 100vh;
    width: 100%;
    overflow: hidden; /* Prevent scrollbar from appearing */
`;

const UserContainer = styled(Box)`
    height: auto; /* Allow height to adjust based on content */
    max-width: 90%; /* Adjusted max-width for smaller screens */
    padding: 20px; /* Reduced padding for smaller screens */
    margin: 20px auto; /* Center align and provide space around the container */
    border-radius: 16px;
    display: flex;
    align-items: center;
    flex-direction: column;
`;

const CustomDialog = styled(Dialog)`
    .MuiDialog-paper {
        background-color: #333;
        width: 90%; /* Adjusted width for smaller screens */
        max-width: 300px; /* Added max-width for smaller screens */
        margin: 0 auto; /* Center align the dialog */
    }
`;

const CustomDialogTitle = styled(DialogTitle)`
    color: #fff;
`;

const CustomDialogContent = styled(DialogContent)`
    padding: 20px;
`;

const CustomDialogActions = styled(DialogActions)`
    justify-content: space-between;
`;

const AcceptButton = styled(Button)`
    background-color: green;
    color: #fff;
    min-width: 100px; /* Added min-width to prevent button from shrinking too much */
`;

const RejectButton = styled(Button)`
    background-color: red;
    color: #fff;
    min-width: 100px; /* Added min-width to prevent button from shrinking too much */
`;

function UserList() {
    const [message, setMessage] = useState('');
    const { username, uid, person, setPerson, ws, setWs} = useContext(LoginContext);
    const [clientId, setClientId] = useState('');
    const [users, setUsers] = useState([]);
    const [request, setRequest] = useState(false);
    const { requestSender, setRequestSender } = useContext(LoginContext);
    const [chat, setChat] = useState(false);
    const [openRequestDialog, setOpenRequestDialog] = useState(false);
    const [requestDialogContent, setRequestDialogContent] = useState('');
    const [openRejectedDialog, setOpenRejectedDialog] = useState(false);
    const {sharedKey, setSharedKey} = useContext(LoginContext);
    const [requestSent, setRequestSent] = useState(false);

    function decryptAES(encryptedTextBase64, key) {
        try {
            // Convert the Base64 encoded ciphertext to a WordArray
            const encryptedTextWordArray = CryptoJS.enc.Base64.parse(encryptedTextBase64);
    
            // Convert the key to a WordArray
            const keyHex = CryptoJS.enc.Utf8.parse(key);
    
            // Decrypt the ciphertext using AES and ECB mode
            const decrypted = CryptoJS.AES.decrypt(
                { ciphertext: encryptedTextWordArray },
                keyHex,
                { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 }
            );
    
            // Convert the decrypted data to a string
            return decrypted.toString(CryptoJS.enc.Utf8);
        } catch (error) {
            console.error("Decryption error:", error.message);
            return null;
        }
    }

    useEffect(() => {
        const websocket = new WebSocket('ws://localhost:8088/ws/RegisterClient');
        console.log("UserList Mounted")
        websocket.onopen = () => {
            console.log('WebSocket connected');
            const initialMessage = JSON.stringify({ username: username, uid: uid });
            websocket.send(initialMessage);
        };

        websocket.onmessage = (event) => {
            const jsonData = JSON.parse(event.data);
            console.log('Received JSON data:', jsonData);
            if (jsonData.type === "Request") {
                console.log("Message received, Inside Request condition rn");
                setRequest(true);
                console.log(request);
                setRequestSender(jsonData.sender);
                setRequestDialogContent(`Request from Client ID: ${jsonData.sender} to chat.`);
                setOpenRequestDialog(true);
            } else if (jsonData.type === "Response") {
                console.log("Message recieved, Inside Response condition rn");
                if (jsonData.field3 === "Yes") {
                    var ensk = jsonData.field4;
                    console.log("Message recieved, Inside Response with yes condition rn");
                    const key = "16bytesecretkey!";
                    console.log(ensk);
                    const decryptedText = decryptAES(ensk, key);
                    console.log(decryptedText);
                    setSharedKey(decryptedText);
                    console.log(sharedKey);
                    console.log(sharedKey);
                    console.log(sharedKey);
                    setRequestSender(jsonData.sender !== uid ? jsonData.sender : jsonData.receiver);
                    setChat(true);
                } else if (jsonData.field3 === "No") {
                    console.log("Message recieved, Inside Response with No condition rn");
                    setOpenRejectedDialog(true);
                }
            }
        };

        websocket.onclose = () => {
            console.log('WebSocket disconnected');
        };

        setWs(websocket);
        fetchUsers();

        return () => {
            websocket.close();
        };
    }, []);


    function fetchUsers() {
        fetch('http://localhost:8080/api/getUsers')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                var d = JSON.parse(data);
                setUsers(d);
                console.log(users);
                console.log(typeof(users));
            })
            .catch(error => {
                console.error('Error fetching users:', error);
            });
    }

    const sendMessage = () => {
        if (message.trim() !== '' && ws) {
            ws.send(message);
            setMessage('');
        }
    };

    const sendRequest = (websocket, person) => {
        console.log("Made a Request to talk");
        console.log(person);
        if (websocket && websocket.readyState === WebSocket.OPEN) {
            const dataToSend = {
                type: "Request",
                sender: uid,
                receiver: person.ID,
                field3: " "
            };
            const jsonData = JSON.stringify(dataToSend);
            websocket.send(jsonData);
            setRequestSent(true);
        } else {
            console.log('WebSocket connection is not open');
        }
    };

    const sendResponse = (websocket) => {
        console.log("accepted request");
        if (websocket && websocket.readyState === WebSocket.OPEN) {
            const dataToSend = {
                type: "Response",
                sender: uid,
                receiver: requestSender,
                field3: "Yes"
            };
            const jsonData = JSON.stringify(dataToSend);
            websocket.send(jsonData);
            setRequest(false);
            /* setChat(true); */
        } else {
            console.log('WebSocket connection is not open');
        }
    };

    const handleRejectRequest = () => {
        setOpenRequestDialog(false);
        if (ws) {
            const dataToSend = {
                type: "Response",
                sender: uid,
                receiver: requestSender,
                field3: "No"
            };
            const jsonData = JSON.stringify(dataToSend);
            ws.send(jsonData);
        }
    };

    const handleAcceptRequest = () => {
        setOpenRequestDialog(false);
        sendResponse(ws);
    };

    const handleClosePopup = () => {
        setPerson([]);
    };

    const handleCloseRequestSentPopup = () => {
        setRequestSent(false);
    };

    return (
        <>
            {chat ? (
                <ChatBox />
            ) : (
                <Container>
                    <h2>Welcome {username}!, Click on the users below to select the user to start texting</h2>
                    {/* <p>Client ID: {uid}</p> */}
                    <br />
                    <h3>User List</h3>
                    <Button variant="contained" onClick={fetchUsers}>Refresh User List</Button>
                    <UserContainer>
                        {users.length > 0 && users.map((user, index) => (
                            user.Username !== username &&
                            <UserListItem key={index} user={user} />
                        ))}
                    </UserContainer>
                    <CustomDialog open={person.length !== 0 && !requestSent} onClose={handleClosePopup}>
                    <CustomDialogTitle>
                        {person.UserStatus === 'offline' || person.UserStatus === 'busy'
                            ? "Cannot send request to users who are offline/busy. Please try again later."
                            : person.Username && `Send ${person.Username} a request to chat?`}
                    </CustomDialogTitle>
                    <CustomDialogContent>
                        {person.UserStatus === 'offline' || person.UserStatus === 'busy' ? (
                            <RejectButton variant="contained" onClick={handleClosePopup}>Ok</RejectButton>
                        ) : (
                            <CustomDialogActions>
                                <RejectButton variant="contained" onClick={handleClosePopup}>Cancel</RejectButton>
                                <AcceptButton variant="contained" onClick={() => {
                                    sendRequest(ws, person);
                                    handleClosePopup(); // Close the dialog after sending the request
                                }}>Send Request</AcceptButton>
                            </CustomDialogActions>
                        )}
                    </CustomDialogContent>
                    </CustomDialog>

                    <CustomDialog open={requestSent} onClose={handleCloseRequestSentPopup}>
                        <CustomDialogTitle>Request sent successfully</CustomDialogTitle>
                        <CustomDialogActions>
                            <RejectButton variant="contained" onClick={handleCloseRequestSentPopup}>Ok</RejectButton>
                        </CustomDialogActions>
                    </CustomDialog>
                    {/* <Button variant="contained" onClick={() => sendRequest(ws, person)}>Chat with {person.Username}</Button> */}
                    <br /><br />
                    {/*request ?
                        <Button variant="contained" onClick={() => sendResponse(ws)}>Accept Messages from Client ID {person.Username}</Button>
                        : null*/}
                    <CustomDialog open={openRequestDialog} onClose={() => setOpenRequestDialog(false)}>
                        <CustomDialogTitle>{requestDialogContent}</CustomDialogTitle>
                        <CustomDialogActions>
                            <RejectButton variant="contained" onClick={handleRejectRequest}>Reject</RejectButton>
                            <AcceptButton variant="contained" onClick={handleAcceptRequest}>Accept</AcceptButton>
                        </CustomDialogActions>
                    </CustomDialog>
                    <CustomDialog open={openRejectedDialog} onClose={() => setOpenRejectedDialog(false)}>
                        <CustomDialogTitle>The other user has rejected the request to talk.</CustomDialogTitle>
                        <CustomDialogActions>
                            <Button variant="contained" onClick={() => setOpenRejectedDialog(false)}>Close</Button>
                        </CustomDialogActions>
                    </CustomDialog>
                </Container>
            )}
        </>
    );
}

export default UserList