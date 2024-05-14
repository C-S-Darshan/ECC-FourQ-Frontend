import React, { useContext } from 'react';
import { LoginContext } from '../Context/LoginContext';
import { Box, styled } from '@mui/material';

const UserBlock = styled(Box)`
    height: 70px; /* Reduced height */
    width: 300px;
    border: solid 1px #bebebe;
    margin-bottom: 5px;
    border-radius: 10px;
    padding-top: 6px;
    padding-bottom: 10px;
    background-color: ${({ status }) =>
        status === 'online'
            ? 'green'
            : status === 'offline'
            ? 'grey'
            : status === 'busy'
            ? 'red'
            : 'white'};
    font-size: 14px; /* Reduced font size */
    cursor: pointer; /* Change cursor to pointer */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const Username = styled(Box)`
    font-size: 16px; /* Bigger font size for username */
    margin: 0;
`;

function UserListItem({ user }) {
    const { setPerson } = useContext(LoginContext);

    function initializePerson() {
        setPerson(user);
    }

    return (
        <UserBlock onClick={initializePerson} status={user.UserStatus}>
            <Username component="p">{user.Username}</Username>
            <p style={{ margin: 0 }}>{user.UserStatus}</p>
        </UserBlock>
    );
}

export default UserListItem;