import React, { useState, useEffect } from "react";
import client from "../feathers";
import TextField from "@material-ui/core/TextField";

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

            let chatId =
                userId < partnerId
                    ? `${userId + partnerId}`
                    : `${partnerId + userId}`;

            console.log(chatId);

            let chat = await chatService.find({ query: { chatId } });
            if (chat.total === 0) {
                console.log("chat doesnt exist");
                return setChatExists(false);
            }
            setChatExists(true);
            console.log("chat exists");
            chat = chat.data[0];
            setChat(chat);
            setMessages(chat.messages);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        init();
    }, []);

    const [messageText, setMessageText] = useState("");

    const handleChange = (e) => {
        setMessageText(e.target.value);
    };

    const createMessage = async () => {
        try {
            let result = await chatService.patch(chat._id, {
                $set: {
                    messages: [
                        {
                            text: messageText,
                            senderId: user._id,
                        },
                    ],
                },
            });

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

    return (
        <div>
            <h1>{currentPageUser.name} Chat</h1>
            <div className="messages">
                <ul>
                    {messages.map((message) => (
                        <li key={message._id}>
                            {message.text} <br /> {message.senderId}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="send-message">
                <TextField
                    label="Enter Message"
                    multiline
                    rowsMax={4}
                    value={messageText}
                    onChange={handleChange}
                />
                <button onClick={sendMessage}>Send Message</button>
            </div>
        </div>
    );
}
