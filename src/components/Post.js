import React from "react";
import { Avatar, MenuItem } from "@material-ui/core";
import { ChatBubbleOutline, FavoriteBorder } from "@material-ui/icons";
import { Link } from "react-router-dom";
import client from "../feathers";

import "../styles/post.scss";

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

    const deletePost = async () => {
        try {
            let result = await postsService.remove(postId);
            console.log(result);
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
                        likerId: currentUserId,
                        // likerId: "5f4c068adeaf644ddc017f16",
                    }),
                }
            );
            result = await result.json();
            console.log(result);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="post">
            <div className="user-info">
                <Avatar alt="Remy Sharp" src={profilePictureId} />
                <Link to={`/user/${user._id}`}>
                    <h3>{name}</h3>
                </Link>
                <div className="post-time">{createdAt}</div>
            </div>
            <div className="post-info">
                <div className="post-text">{postText}</div>
                <div className="comments-likes">
                    <MenuItem className="comments">
                        <ChatBubbleOutline />
                        {numberOfComments}
                    </MenuItem>{" "}
                    <MenuItem className="likes" onClick={like}>
                        <FavoriteBorder /> {numberOfLikes}
                    </MenuItem>
                </div>
                {isOwnPost && <button onClick={deletePost}>Delete</button>}
            </div>
        </div>
    );
}
