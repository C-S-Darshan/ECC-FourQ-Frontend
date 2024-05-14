import React, { useContext } from "react";
import { LoginContext } from '../Context/LoginContext';
import { Box, styled } from '@mui/material';
import CryptoJS from "crypto-js";

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
    const { uid , sharedKey} = useContext(LoginContext);
    function decryptAES(encryptedText, key) {
        const keyHex = CryptoJS.enc.Hex.parse(key);
        const decrypted = CryptoJS.AES.decrypt(encryptedText, keyHex, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
        return decrypted.toString(CryptoJS.enc.Utf8);
    }
    // Determine if the current user is the sender
    const isSender = props.sender === uid;
    const decrypted = decryptAES(props.field3, sharedKey);

    return (
        <MessageComponent isSender={isSender}>
            <p>{decrypted}</p>
            <p>{props.field4}</p>
        </MessageComponent>
    );
}

export default Messages;