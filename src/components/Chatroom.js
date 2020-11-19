import React, { useState, useEffect } from "react";
import client from "../feathers";
import TextField from "@material-ui/core/TextField";
import Message from "./Message";

import { smallBigString } from "../helperFunctions";
import { CodeSharp } from "@material-ui/icons";

export default function Chatroom({ match }) {
    const chatService = client.service("chat");
    const usersService = client.service("users");

    const [user, setUser] = useState({});
    const [currentPageUser, setCurrentPageUser] = useState({});
    const [chatExists, setChatExists] = useState(true);

    const [chat, setChat] = useState({});
    const [messages, setMessages] = useState([]);

    async function init() {
        try {
            let currentPageUser = await usersService.get(
                match.params.partnerId
            );
            setCurrentPageUser(currentPageUser);

            let user = await client.authenticate();
            user = user.user;
            setUser(user);

            let userId = user._id;
            let partnerId = match.params.partnerId;
            let chatId = smallBigString(userId, partnerId);

            let chat = await fetch(
                `http://localhost:3030/custom-chat/${chatId}`
            );
            chat = await chat.json();
            console.log(chat);
            if (!chat) {
                return setChatExists(false);
            }
            setChatExists(true);

            setChat(chat);
            setMessages(chat.messages);
            // console.log(chat.messages);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        init();
    }, []);

    const createMessage = async () => {
        try {
            const chatId =
                user._id < currentPageUser._id
                    ? `${user._id + currentPageUser._id}`
                    : `${currentPageUser._id + user._id}`;

            const message = {
                chatId,
                text: msg,
                sender: user._id,
            };

            let result = await fetch(`http://localhost:3030/message`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(message),
            });
            result = await result.json();

            console.log(result);
        } catch (error) {
            console.log(error);
        }
    };

    const createChat = async () => {
        const chatId =
            user._id < currentPageUser._id
                ? `${user._id + currentPageUser._id}`
                : `${currentPageUser._id + user._id}`;

        let members = [user._id, currentPageUser._id];

        try {
            let chat = await chatService.create({ chatId, members });
            console.log(chat);
        } catch (error) {
            console.log(error);
        }
    };

    const sendMessage = async () => {
        if (!chatExists) {
            createChat();
            createMessage();
            return;
        }
        return createMessage();
        // console.log(messageText);
    };

    const DisplayMessages = () => (
        <div className="messages">
            {messages.map((message) => (
                <Message key={message._id} message={message} />
            ))}
        </div>
    );

    const [msg, setMsg] = useState("");
    const handleMsgChange = (e) => {
        console.log(e.target.value);
        setMsg(e.target.value);
    };
    const SendMessage = () => (
        <div className="send-message">
            <TextField value={msg} onChange={handleMsgChange} />
            <button onClick={sendMessage}>Send Message</button>
        </div>
    );

    return (
        <div>
            <h1>{currentPageUser.name} Chat</h1>
            <DisplayMessages />
            {/* <SendMessage /> */}
            {SendMessage()}
            {/* <TextField valu e={msg} onChange={handleMsgChange} /> */}
        </div>
    );
}
