import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Avatar, MenuItem } from "@material-ui/core";
import { ChatBubbleOutline, FavoriteBorder } from "@material-ui/icons";
import Typography from "@material-ui/core/Typography";

import client from "../feathers";
import "../styles/post.scss";
import io from "socket.io-client";

const socket = io("http://localhost:3030");

export default function Post({
    profilePictureId,
    name,
    createdAt,
    postText,
    numberOfComments,
    numberOfLikes,
    isOwnPost,
    postId,
    user,
    currentUserId,
}) {
    const postsService = client.service("posts");

    const [noOfLikes, setNoOfLikes] = useState(numberOfLikes);

    // createdAt = new Date(createdAt);
    // console.log(typeof new Date(createdAt).getDate());

    const init = async () => {
        socket.emit("join room", postId);

        socket.on("like", (e) => {
            if (postId === e.roomName) {
                setNoOfLikes(e.result.likes.length);
            }
        });
    };

    useEffect(() => {
        init();
    }, []);

    const deletePost = async () => {
        try {
            let result = await postsService.remove(postId);
            console.log(result);
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    };

    const like = async () => {
        try {
            let result = await fetch(
                `http://localhost:3030/custom-post/${postId}/like`,
                {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        likerId: user._id,
                        // likerId: "5f4c068adeaf644ddc017f16",
                    }),
                }
            );
            result = await result.json();
            console.log(result);
            socket.emit("like", { roomName: postId, result });
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="post">
            <div className="user-info">
                <Avatar
                    src={profilePictureId}
                    onClick={() => (window.location = `/user/${user._id}`)}
                    className="profile-pic"
                />
                <Typography variant="h5">{name}</Typography>

                <div className="post-time">
                    <Typography variant="h6">
                        {new Date(createdAt).getDate().toString()}/
                        {new Date(createdAt).getMonth().toString()}
                    </Typography>
                </div>
            </div>
            <div className="post-info">
                <div className="post-text">
                    <Typography variant="body">{postText}</Typography>
                </div>
                <div className="comments-likes">
                    <MenuItem
                        className="comments"
                        onClick={() => (window.location = `/post/${postId}`)}
                    >
                        <ChatBubbleOutline />
                        {numberOfComments}
                    </MenuItem>{" "}
                    <MenuItem className="likes" onClick={like}>
                        <FavoriteBorder /> {noOfLikes}
                    </MenuItem>
                </div>
                {isOwnPost && <button onClick={deletePost}>Delete</button>}
            </div>
        </div>
    );
}
