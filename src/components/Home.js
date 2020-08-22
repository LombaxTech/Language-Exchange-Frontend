import React, { useState, useEffect } from "react";
import client from "../feathers";
import { Link } from "react-router-dom";

import Navbar from "./Navbar";
import Signout from "./Signout";

export default function Home() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [user, setUser] = useState({});

    async function init() {
        try {
            let result = await client.authenticate();
            setUser(result.user);
            setLoggedIn(true);
        } catch (err) {
            console.log(err);
            setLoggedIn(false);
        }
    }

    useEffect(() => {
        init();
    }, []);

    return (
        <div>
            Home
            {!loggedIn && (
                <div>
                    <Link style={{ display: "block" }} to="/signup">
                        Sign Up
                    </Link>
                    <Link to="/signin">Sign In</Link>
                </div>
            )}
            {loggedIn && <Signout />}
        </div>
    );
}
