import React from 'react';

function UserListItem({ Uname, UserID }) {
    return (
        <div>
            User ID: {UserID}, Username: {Uname}
        </div>
    );
}

export default UserListItem;