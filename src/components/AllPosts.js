import React, { useState, useEffect } from "react";
import client from "../feathers";
import Post from "./Post";
import InfiniteScroll from "react-infinite-scroll-component";

import io from "socket.io-client";
const socket = io("http://localhost:3030");

export default function AllPosts() {
    const postsService = client.service("posts");

    const [posts, setPosts] = useState([]);
    const [user, setUser] = useState({});

    async function init() {
        socket.on("write post", (post) => {
            console.log(post);
            setPosts([post, ...posts]);
        });

        try {
            let result = await fetch(
                "http://localhost:3030/custom-posts/paginate/0/20"
            );
            result = await result.json();
            // console.log(result);
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

    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);

    const fetchMorePosts = async () => {
        try {
            let newPosts = await fetch(
                `http://localhost:3030/custom-posts/paginate/${page * 20}/20`
            );
            newPosts = await newPosts.json();
            console.log(newPosts);
            if (newPosts.length === 0) {
                return setHasMore(false);
            }
            setPosts([...posts, ...newPosts]);
            setPage(page + 1);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <h1>All Posts</h1>

            <InfiniteScroll
                dataLength={posts.length}
                next={fetchMorePosts}
                hasMore={hasMore}
                loader={<h4>Loading...</h4>}
                endMessage={
                    <p style={{ textAlign: "center" }}>
                        <b>Yay! You have seen it all</b>
                    </p>
                }
            >
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
            </InfiniteScroll>
        </div>
    );
}
