import React, { useState, useEffect } from "react";
import client from "../feathers";
import Post from "./Post";
import Typography from "@material-ui/core/Typography";

import "../styles/targetLanguagePosts.scss";

export default function TargetLanguagePosts() {
    const [posts, setPosts] = useState([]);
    const [user, setUser] = useState({});

    async function init() {
        try {
            let user = await client.authenticate();
            user = user.user;
            setUser(user);

            let result = await fetch(
                `http://localhost:3030/custom-posts/${user.targetLanguage}`
            );
            result = await result.json();
            console.log(result);
            setPosts(result);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        init();
    }, []);

    return (
        <div className="target-language-posts-page">
            <div className="main">
                <Typography variant="h4">Target Language Posts</Typography>
                {posts.map((post) => (
                    <Post
                        key={post._id}
                        profilePictureId={post.user.profilePictureId}
                        name={post.user.name}
                        createdAt={post.createdAt}
                        postText={post.text}
                        numberOfComments={post.comments.length}
                        numberOfLikes={post.likes.length}
                        isOwnPost={post.user._id === user._id}
                        postId={post._id}
                        user={post.user}
                    />
                ))}
            </div>
        </div>
    );
}

{
    /* <div className="sidebar">
                <div className="learning">
                    <Typography variant="h6">Learning</Typography>
                </div>
                <div className="classmates">
                    <Typography variant="h6">Classmates</Typography>
                </div>
                <div className="following">
                    <Typography variant="h6">Following</Typography>
                </div>
            </div> */
}
