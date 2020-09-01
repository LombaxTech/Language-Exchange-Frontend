import React, { useState, useEffect } from "react";
import client from "../feathers";
import ChatLink from "./ChatLink";

export default function Chats() {
    const [user, setUser] = useState({});
    const [chats, setChats] = useState([]);

    async function init() {
        try {
            let user = await client.authenticate();
            user = user.user;
            setUser(user);

            // get chats
            let chats = await fetch(
                `http://localhost:3030/custom-chat/${user._id}`
            );
            chats = await chats.json();
            console.log(chats);
            setChats(chats);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        init();
    }, []);

    return (
        <div>
            <h1>Chats</h1>
            {/* <ChatLink /> */}
            {chats.map((chat) => {
                let partner = chat.members.filter(
                    (member) => member._id !== user._id
                )[0];

                return <ChatLink key={chat._id} partner={partner} />;
            })}
        </div>
    );
}
