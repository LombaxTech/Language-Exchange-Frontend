import React, { useState, useEffect } from "react";
import client from "../feathers";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";

import "../styles/chats.scss";

const Chat = ({ partner, lastMessage }) => (
    <div
        className="chat"
        onClick={() => (window.location = `/chat/${partner._id}`)}
    >
        <div className="profile-pic-name-message">
            <Avatar
                src={partner.profilePictureId}
                style={{ width: "75px", height: "75px" }}
            />
            <div className="name-message">
                <Typography variant="h6" className="name">
                    {partner.name}
                </Typography>
                {/* <Typography variant="body1" className="last-message">
                    Hey when is our next lesson?
                </Typography> */}
            </div>
        </div>
        <div className="date">16:20 12/01/2020</div>
    </div>
);

export default function Chats() {
    const [user, setUser] = useState({});
    const [chats, setChats] = useState([]);

    async function init() {
        try {
            let user = await client.authenticate();
            user = user.user;
            setUser(user);

            let chats = await fetch(
                `${process.env.REACT_APP_API_BASE_URL}/custom-chats/${user._id}`
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
        <div className="chats-page">
            <Typography variant="h3" className="page-title">
                Chats
            </Typography>
            <div className="chats">
                {chats.map((chat) => {
                    let partner = chat.members.filter(
                        (member) => member._id !== user._id
                    )[0];

                    return <Chat partner={partner} key={chat._id} />;
                })}
            </div>
        </div>
    );
}

// {chats.map((chat) => {
//     let partner = chat.members.filter(
//         (member) => member._id !== user._id
//     )[0];

// })}
