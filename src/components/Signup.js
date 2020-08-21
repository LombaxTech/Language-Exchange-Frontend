import React, { useState, useEffect } from "react";
import client from "../feathers";

export default function Signup() {
    useEffect(() => {
        console.log(client);
    }, []);

    return (
        <div>
            <h1>SIGN UP!!</h1>
        </div>
    );
}
