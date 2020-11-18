import React from "react";
import { Link } from "react-router-dom";
import { Avatar, MenuItem } from "@material-ui/core";
import { ChatBubbleOutline, FavoriteBorder } from "@material-ui/icons";
import Typography from "@material-ui/core/Typography";

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

    // createdAt = new Date(createdAt);
    console.log(typeof new Date(createdAt).getDate());

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
                {/* <Link to={`/user/${user._id}`}> */}
                <Typography variant="h5">{name}</Typography>
                {/* </Link> */}
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
