import React, { useContext } from 'react';
import { LoginContext } from '../Context/LoginContext';
import {Box, styled} from '@mui/material'
const UserBlock = styled(Box)`
    height: 100px;
    width: 300px;
    border: solid 1px black;
    margin-bottom: 5px;
    border-radius: 10px;
    padding-top:6px;
    padding-bottom:10px;
`

function UserListItem({ user}) {
    const {setPerson} = useContext(LoginContext)

    function initializePerson(){
        setPerson(user)
    }

    return (
        <UserBlock onClick={initializePerson}>
           <p> User ID: {user.ID} Username: {user.Username}</p><p> Status: {user.UserStatus}</p>
        </UserBlock>
    );
}

export default UserListItem;