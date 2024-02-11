import React from "react";

function Messages({props}){



    return(
        <>
        <div>
            <p>Message : {props.field3}</p>
            <p>Sent by : {props.sender}</p>
            <p>Received by : {props.receiver}</p>
        </div>
        </>
    )
}
export default Messages