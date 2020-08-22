// TODO: MAKE PROTECTED ROUTE FOR ONLY NON SIGNED IN USERS

import React, { useState, useEffect } from "react";
import client from "../feathers";

export default function Signin() {
    const usersService = client.service("users");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const updateEmailValue = (e) => {
        setEmail(e.target.value);
    };

    const updatePasswordValue = (e) => {
        setPassword(e.target.value);
    };

    const signin = async (e) => {
        e.preventDefault();
        // console.log("attempted sign up");
        try {
            let user = await client.authenticate({
                strategy: "local",
                email,
                password,
            });
            console.log(user);
            window.location = "./";
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <h1>Sign In</h1>
            <form onSubmit={signin}>
                <label>Email: </label>
                <input type="text" value={email} onChange={updateEmailValue} />
                <label>Password: </label>
                <input
                    type="password"
                    value={password}
                    onChange={updatePasswordValue}
                />
                <button type="submit">Sign In</button>
            </form>
        </div>
    );
}
