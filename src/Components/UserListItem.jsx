import React from 'react';

function UserListItem({ user}) {
    return (
        <div>
            User ID: {user.UserID}, Username: {user.Uname}
        </div>
    );
}

export default UserListItem;