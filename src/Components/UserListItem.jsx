import React, { useContext } from 'react';
import { LoginContext } from '../Context/LoginContext';

function UserListItem({ user}) {
    const {setPerson} = useContext(LoginContext)

    function initializePerson(){
        setPerson(user)
    }

    return (
        <div onClick={initializePerson}>
            User ID: {user.ID}, Username: {user.Username}, Status: {user.UserStatus}
        </div>
    );
}

export default UserListItem;