import React, { useState, useEffect } from "react";
import client from "../feathers";
import { Link } from "react-router-dom";

import AllUsers from "./AllUsers";
import AllPosts from "./AllPosts";
import TargetLanguagePosts from "./TargetLanguagePosts";

import Post from "./Post";
import io from "socket.io-client";
const socket = io("http://localhost:3030");

export default function Home() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [user, setUser] = useState({});

    async function init() {
        try {
            socket.on("test", (e) => console.log(e));
            socket.on("test info", (e) => console.log(e));

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

    socket.on("connected", (e) => console.log(e));
    socket.on("test info", (info) => console.log("test received"));

    return (
        <div>
            <TargetLanguagePosts />
        </div>
    );
}
