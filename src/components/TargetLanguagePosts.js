import React, { useState, useEffect } from "react";
import client from "../feathers";
import Post from "./Post";

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
        <div>
            <h1>Target Language Posts</h1>
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
    );
}
