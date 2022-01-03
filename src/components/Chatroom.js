import React, { useState, useEffect } from "react";
import client from "../feathers";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Message from "./Message";

import { smallBigString } from "../helperFunctions";
import { CodeSharp } from "@material-ui/icons";
// import "../styles/chatroom.scss";
import { Scrollbars } from "react-custom-scrollbars";

import io from "socket.io-client";
const socket = io(process.env.REACT_APP_API_BASE_URL);

export default function Chatroom({ match }) {
    const chatService = client.service("chat");
    const usersService = client.service("users");

    const [user, setUser] = useState({});
    const [currentPageUser, setCurrentPageUser] = useState({});
    const [chatExists, setChatExists] = useState(true);

    const [chat, setChat] = useState({});
    const [messages, setMessages] = useState([]);

    async function init() {
        socket.emit("join room", match.params.partnerId);
        socket.on("message", (e) => setMessages(e.messages));

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
                `${process.env.REACT_APP_API_BASE_URL}/custom-chat/${chatId}`
            );
            chat = await chat.json();
            console.log(chat);
            if (!chat) {
                return setChatExists(false);
            }
            setChatExists(true);

            setChat(chat);
            setMessages(chat.messages);
            console.log(chat.messages);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        init();
    }, []);

    const createChat = async () => {
        const chatId = smallBigString(user._id, currentPageUser._id);
        let members = [user._id, currentPageUser._id];
        try {
            let chat = await chatService.create({ chatId, members });
            console.log(chat);
        } catch (error) {
            console.log(error);
        }
    };

    const createMessage = async () => {
        try {
            const chatId = smallBigString(user._id, currentPageUser._id);

            const message = {
                chatId,
                text: msg,
                sender: user._id,
            };

            let result = await fetch(
                `${process.env.REACT_APP_API_BASE_URL}/message`,
                {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(message),
                }
            );
            result = await result.json();

            console.log(result);
        } catch (error) {
            console.log(error);
        }
    };

    const sendMessage = async () => {
        if (!chatExists) {
            createChat();
        }
        createMessage();
        setMsg("");
        socket.emit("message", {
            messages: [...messages, { text: msg, sender: user }],
            roomName: match.params.partnerId,
        });
    };

    const DisplayMessages = () => (
        <div className="messages flex-1 px-4">
            <Scrollbars>
                {messages.map((message, i) => (
                    <Message key={i} message={message} />
                ))}
            </Scrollbars>
        </div>
    );

    const [msg, setMsg] = useState("");
    const handleMsgChange = (e) => setMsg(e.target.value);

    const SendMessage = () => (
        <div className="send-message  flex">
            <div className="flex-1">
                <TextField
                    value={msg}
                    onChange={handleMsgChange}
                    variant="outlined"
                    className="message-input"
                    multiline
                    rowsMax={3}
                    fullWidth={true}
                />
            </div>
            <Button variant="contained" onClick={sendMessage} color="primary">
                Send Message
            </Button>
        </div>
    );

    return (
        <div
            className="chatroom-page w-5/6 m-auto shadow-md flex flex-col"
            style={{ height: "540px", maxHeight: "540px" }}
        >
            <h1
                className="current-page-user-name text-center text-4xl py-5 cursor-pointer"
                onClick={() =>
                    (window.location = `/user/${currentPageUser._id}`)
                }
            >
                {currentPageUser.name}
            </h1>
            <div className="flex flex-col flex-1">
                {DisplayMessages()}
                {SendMessage()}
            </div>
        </div>
    );
}
