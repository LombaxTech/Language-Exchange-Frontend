import React, { useState, useEffect } from "react";
import client from "../feathers";
import { Link } from "react-router-dom";
import Post from "./Post";

export default function AllPosts() {
    const postsService = client.service("posts");

    const [posts, setPosts] = useState([]);
    const [user, setUser] = useState({});

    async function init() {
        try {
            let result = await fetch("http://localhost:3030/custom-posts");
            result = await result.json();
            console.log(result);
            setPosts(result);

            let user = await client.authenticate();
            user = user.user;
            setUser(user);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        init();
    }, []);

    return (
        <div>
            <h1>All Posts</h1>
            {/* <ul>
                {posts.map((post) => (
                    <li key={post._id} style={{ margin: "20px" }}>
                        {post.user.name} | Created at: ...
                        <br />
                        {post.text} <br />
                        likes: {post.likes.length} <br />
                        comments:{" "}
                        {post.comments.map((comment) => (
                            <p>{comment}</p>
                        ))}
                    </li>
                ))}
            </ul> */}
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
