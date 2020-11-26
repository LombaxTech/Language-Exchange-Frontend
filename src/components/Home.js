import React, { useState, useEffect } from "react";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

import client from "../feathers";
import TargetLanguagePosts from "./TargetLanguagePosts";
import "../styles/home.scss";

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

    const Welcome = () => (
        <div className="welcome">
            <div className="bg-image"></div>
            <div className="call-to-action">
                <Typography variant="h2">Start Learning NOW!</Typography>
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    className="sign-up-button"
                    fullWidth={true}
                >
                    Sign Up
                </Button>
            </div>
        </div>
    );

    return (
        <div>
            {loggedIn && <TargetLanguagePosts />}
            {!loggedIn && <Welcome />}
        </div>
    );
}
