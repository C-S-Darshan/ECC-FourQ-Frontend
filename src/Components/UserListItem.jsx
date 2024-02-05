import React, { useContext } from 'react';
import { LoginContext } from '../Context/LoginContext';

function UserListItem({ user}) {
    const {setPerson} = useContext(LoginContext)

    function initializePerson(){
        setPerson(user)
    }

    return (
        <div onClick={initializePerson}>
            User ID: {user.UserID}, Username: {user.Uname}
        </div>
    );
}

export default UserListItem;