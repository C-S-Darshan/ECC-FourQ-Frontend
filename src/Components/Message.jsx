import React, { useContext } from "react";
import { LoginContext } from '../Context/LoginContext';
import { Box, styled } from '@mui/material';

const MessageComponent = styled(Box)`
    height: 60px;
    max-width: 400px;
    color: #f0eaea;
    background-color: rgb(40, 142, 250);
    border-radius: 16px;
    margin: 20px;
    ${props => props.isSender ? 'margin-left: auto;' : 'margin-right: auto;'}
`;

function Messages({ props }) {
    const { uid } = useContext(LoginContext);

    // Determine if the current user is the sender
    const isSender = props.sender === uid;

    return (
        <MessageComponent isSender={isSender}>
            <p>Message: {props.field3}</p>
            <p>Sent by: {props.sender} Received by: {props.receiver}</p>
        </MessageComponent>
    );
}

export default Messages;