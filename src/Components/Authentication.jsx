import React from "react";

function Authenticate(){


    return(
        <>
            <p>Please provide your details for Authentication</p>
            <p>Enter your name: </p>
            <input type="text" name="ClientName" id="CName"/><br/>
            <p>Enter your Password: </p>
            <input type="text" name="ClientPassword" id="CPassWord"/><br/>
            <button >Submit</button>
        </>
    )
}

export default Authenticate