import React, { useState, useEffect } from "react";
import { Avatar, MenuItem } from "@material-ui/core";
import { ChatBubbleOutline, FavoriteBorder } from "@material-ui/icons";
import { Link } from "react-router-dom";
import client from "../feathers";

import AddComment from "./AddComment";
import Comment from "./Comment";
import "../styles/post.scss";

export default function FullPost({ match }) {
    const [post, setPost] = useState({});
    const [currentUser, setCurrentUser] = useState({});
    const [loading, setLoading] = useState(true);

    async function init() {
        try {
            let currentUser = await client.authenticate();
            setCurrentUser(currentUser.user);

            let post = await fetch(
                `http://localhost:3030/custom-post/${match.params.postId}`
            );
            post = await post.json();
            setPost(post);
            console.log(post);
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        init();
    }, []);

    const postsService = client.service("posts");

    const deletePost = async () => {
        try {
            let result = await postsService.remove(post._id);
            console.log(result);
        } catch (error) {
            console.log(error);
        }
    };

    const like = async () => {
        try {
            let result = await fetch(
                `http://localhost:3030/custom-post/${post._id}/like`,
                {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        likerId: currentUser._id,
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

    if (loading) return <h2>Loading...</h2>;

    return (
        <div className="post">
            <div className="user-info">
                <Avatar alt="Remy Sharp" src={post.user.profilePictureId} />
                <Link to={`/post.user/${post.user._id}`}>
                    <h3>{post.user.name}</h3>
                </Link>
                <div className="post-time">{post.createdAt}</div>
            </div>
            <div className="post-info">
                <div className="post-text">{post.text}</div>
                <div className="comments-likes">
                    <MenuItem className="comments-icon">
                        {/* <ChatBubbleOutline /> */}
                        <AddComment post={post} currentUser={currentUser} />
                        {post.comments.length}
                    </MenuItem>{" "}
                    <MenuItem className="likes" onClick={like}>
                        <FavoriteBorder /> {post.likes.length}
                    </MenuItem>
                </div>
                {currentUser._id === post.user._id && (
                    <button onClick={deletePost}>Delete</button>
                )}
            </div>
            <div className="comments">
                {post.comments.map((comment) => (
                    <Comment
                        name={comment.user.name}
                        profilePictureId={comment.user.profilePictureId}
                        text={comment.text}
                        userId={comment.user._id}
                        key={comment._id}
                    />
                ))}
            </div>
        </div>
    );
}
