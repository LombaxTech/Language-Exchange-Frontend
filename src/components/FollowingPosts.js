import React, { useState, useEffect } from "react";
import client from "../feathers";
import Post from "./Post";
import Typography from "@material-ui/core/Typography";
import InfiniteScroll from "react-infinite-scroll-component";

import "../styles/targetLanguagePosts.scss";

export default function FollowingPosts() {
    const [user, setUser] = useState({});
    const [following, setFollowing] = useState([]);
    const [posts, setPosts] = useState([]);

    async function init() {
        try {
            let user = await client.authenticate();
            user = user.user;
            setUser(user);
            setFollowing(user.following);

            // loop through following users and get posts for each
            let _posts = [];
            for (let userId of user.following) {
                try {
                    let result = await fetch(
                        `${process.env.REACT_APP_API_BASE_URL}/custom-posts/user/${userId}/0/10`
                    );
                    result = await result.json();
                    console.log(result);
                    _posts = [..._posts, ...result];
                } catch (error) {
                    console.log(error);
                }
            }
            _posts = _posts.map((post) => ({
                ...post,
                createdAt: new Date(post.createdAt),
            }));
            _posts.sort((a, b) => b.createdAt - a.createdAt);
            _posts = _posts.map((post) => ({
                ...post,
                createdAt: post.createdAt.toString(),
            }));

            setPosts(_posts);
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
            let newPosts = [];
            for (let userId of user.following) {
                try {
                    let result = await fetch(
                        `${
                            process.env.REACT_APP_API_BASE_URL
                        }/custom-posts/user/${userId}/${page * 10}/${10}`
                    );
                    result = await result.json();
                    console.log(result);
                    newPosts = [...newPosts, ...result];
                } catch (error) {
                    console.log(error);
                }
            }
            newPosts = newPosts.map((post) => ({
                ...post,
                createdAt: new Date(post.createdAt),
            }));
            newPosts.sort((a, b) => b.createdAt - a.createdAt);
            newPosts = newPosts.map((post) => ({
                ...post,
                createdAt: post.createdAt.toString(),
            }));

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
        <div className="following-posts-page">
            <div className="main">
                <Typography variant="h4">Following</Typography>

                <InfiniteScroll
                    className="infinite-scroll-component"
                    dataLength={posts.length}
                    next={fetchMorePosts}
                    hasMore={hasMore && posts.lenth > 0}
                    loader={<h4>Loading...</h4>}
                    endMessage={
                        <p style={{ textAlign: "center" }}>
                            <b>No More Posts to Show</b>
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
        </div>
    );
}
