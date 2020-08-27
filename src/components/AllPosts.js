import React, { useState, useEffect } from "react";
import client from "../feathers";
import { Link } from "react-router-dom";

export default function AllPosts() {
    const postsService = client.service("posts");

    const [posts, setPosts] = useState([]);

    async function init() {
        try {
            let result = await fetch("http://localhost:3030/custom-posts");
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
            <h1>All Posts</h1>
            <ul>
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
            </ul>
        </div>
    );
}
