import React from "react";
import { Avatar } from "@material-ui/core";
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
                    <ChatBubbleOutline /> {numberOfComments}
                    <FavoriteBorder /> {numberOfLikes}
                </div>
                {isOwnPost && <button onClick={deletePost}>Delete</button>}
            </div>
        </div>
    );
}
