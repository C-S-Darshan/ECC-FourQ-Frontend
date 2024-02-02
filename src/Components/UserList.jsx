// UserList.js
import React, { useContext } from 'react';
import { LoginContext } from '../Context/LoginContext';

function UserList() {
    const {username} = useContext(LoginContext)
    return (
        <div>
            <h1>User List</h1>
            <p>Hello {username}!!, click on a user to begin a conversation with them</p>
        </div>
    );
}

export default UserList;
