import React from "react";

function Messages({props}){



    return(
        <>
        <div>
            <p>{props.field3}</p>
            <p>{props.sender}</p>
            <p>{props.receiver}</p>
        </div>
        </>
    )
}
export default Messages