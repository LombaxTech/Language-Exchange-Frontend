import React, { useState, useEffect } from "react";
import client from "../feathers";

import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import Post from "./Post";

import Followers from "./Followers";
import Following from "./Following";

import { Modal } from "react-bootstrap";

import "../styles/profile.scss";

export default function Profile() {
    const usersService = client.service("users");
    const [user, setUser] = useState({});
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    async function init() {
        setLoading(true);
        let user = await client.authenticate();
        user = user.user;

        try {
            user = await fetch(
                `${process.env.REACT_APP_API_BASE_URL}/custom-user/${user._id}`
            );
            user = await user.json();
            console.log(user);
            setUser(user);

            let posts = await fetch(
                `${process.env.REACT_APP_API_BASE_URL}/custom-posts/user/${user._id}`
            );
            posts = await posts.json();
            setPosts(posts);
            console.log(posts);

            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        init();
    }, []);

    const [followingShow, setFollowingShow] = useState(false);
    const [followersShow, setFollowersShow] = useState(false);
    const [postsShow, setPostsShow] = useState(false);

    const UserCard = ({ profilePictureId, name, userId }) => (
        <div className="user-card">
            <div className="name-pic">
                <Avatar
                    src={profilePictureId}
                    className="profile-pic"
                    onClick={() => (window.location = `/user/${userId}`)}
                />
                <Typography variant="h5" className="profile-name">
                    {name}
                </Typography>
            </div>
            <div className="follow-icon">
                <IconButton>
                    <CheckCircleOutlineIcon />
                </IconButton>
            </div>
        </div>
    );

    const FollowingModal = () => (
        <Modal
            show={followingShow}
            onHide={() => setFollowingShow(false)}
            centered
            className="following-modal"
        >
            <Modal.Body>
                {user.following.map((following) => (
                    <UserCard
                        profilePictureId={following.profilePictureId}
                        name={following.name}
                        userId={following._id}
                    />
                ))}
            </Modal.Body>
        </Modal>
    );

    const FollowersModal = () => (
        <Modal
            show={followersShow}
            onHide={() => setFollowersShow(false)}
            centered
            className="followers-modal"
        >
            <Modal.Body>
                {user.followers.map((follower) => (
                    <UserCard
                        profilePictureId={follower.profilePictureId}
                        name={follower.name}
                        userId={follower._id}
                    />
                ))}
            </Modal.Body>
        </Modal>
    );

    const PostsModal = () => (
        <Modal
            show={postsShow}
            onHide={() => setPostsShow(false)}
            centered
            className="posts-modal"
        >
            <Modal.Body>
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
            </Modal.Body>
        </Modal>
    );

    if (loading) return <h1>Loading...</h1>;

    return (
        <div className="profile-page">
            {FollowingModal()}
            {FollowersModal()}
            {PostsModal()}
            <div className="profile-pic-section">
                <Avatar src={user.profilePictureId} className="profile-pic" />
            </div>
            <div className="follow-posts">
                <div className="following">
                    <Button
                        variant="outlined"
                        onClick={() => setFollowingShow(true)}
                    >
                        <Typography variant="h5">Following</Typography>
                    </Button>
                </div>
                <div className="followers">
                    <Button
                        variant="outlined"
                        onClick={() => setFollowersShow(true)}
                    >
                        <Typography variant="h5">Followers</Typography>
                    </Button>{" "}
                </div>
                <div className="posts">
                    <Button
                        variant="outlined"
                        onClick={() => setPostsShow(true)}
                    >
                        <Typography variant="h5">Posts</Typography>
                    </Button>
                </div>
            </div>
            <div className="edit-profile">
                <Button
                    variant="contained"
                    size="large"
                    fullWidth={true}
                    className="edit-profile-button"
                    color="primary"
                    onClick={() => (window.location = "/edit-profile")}
                >
                    Edit Profile
                </Button>
            </div>
        </div>
    );
}
