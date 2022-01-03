import React, { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import client from "../feathers";

import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import Post from "./Post";
import { Scrollbars } from "react-custom-scrollbars";

import { CircularProgress } from "@material-ui/core";

import { Modal } from "react-bootstrap";

// import "../styles/profile.scss";

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
            console.log({ user });
            setUser(user);

            let posts = await fetch(
                `${process.env.REACT_APP_API_BASE_URL}/custom-posts/user/${user._id}`
            );
            posts = await posts.json();
            setPosts(posts);
            console.log({ posts });

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
        <div className="user-card  flex px-8 py-4 justify-between items-center   border-b border-black">
            <div
                className="name-pic flex justify-center items-center gap-8 cursor-pointer"
                onClick={() => (window.location = `/user/${userId}`)}
            >
                <Avatar src={profilePictureId} className="profile-pic" />
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
        <Transition
            show={followingShow}
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
        >
            <Dialog
                open={followingShow}
                onClose={() => setFollowingShow(false)}
                className="fixed inset-0  flex justify-center items-center"
            >
                <Dialog.Overlay className="fixed inset-0 bg-dark opacity-70 z-10" />
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="w-full max-w-2xl max-h-3/4  bg-white    z-20 zz shadow-xl rounded-2xl p-4 flex flex-col ">
                        <h2 className="text-4xl text-center mb-4">Following</h2>
                        <div className="  overflow-scroll overflow-x-hidden">
                            {user.following.map((following) => (
                                <div>
                                    <UserCard
                                        profilePictureId={
                                            following.profilePictureId
                                        }
                                        name={following.name}
                                        userId={following._id}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </Transition.Child>
            </Dialog>
        </Transition>
    );

    const FollowersModal = () => (
        <Transition
            show={followersShow}
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
        >
            <Dialog
                open={followersShow}
                onClose={() => setFollowersShow(false)}
                className="fixed inset-0  flex justify-center items-center"
            >
                <Dialog.Overlay className="fixed inset-0 bg-dark opacity-70 z-10" />
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="w-full max-w-2xl max-h-3/4  bg-white    z-20 zz shadow-xl rounded-2xl p-4 flex flex-col ">
                        <h2 className="text-4xl text-center mb-4">Followers</h2>
                        <div className="  overflow-scroll overflow-x-hidden">
                            {user.followers.map((follower) => (
                                <div>
                                    <UserCard
                                        profilePictureId={
                                            follower.profilePictureId
                                        }
                                        name={follower.name}
                                        userId={follower._id}
                                    />
                                </div>
                            ))}
                        </div>
                        {user.followers.length === 0 && (
                            <div className="overflow-hidden text-center">
                                No Followers
                            </div>
                        )}
                    </div>
                </Transition.Child>
            </Dialog>
        </Transition>
    );

    const PostsModal = () => (
        <Transition
            show={postsShow}
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
        >
            <Dialog
                open={postsShow}
                onClose={() => setPostsShow(false)}
                className="fixed inset-0  flex justify-center items-center"
            >
                <Dialog.Overlay className="fixed inset-0 bg-dark opacity-70 z-10" />
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="w-full max-w-2xl max-h-3/4  bg-white    z-20 zz shadow-xl rounded-2xl p-4 flex flex-col ">
                        <h2 className="text-4xl text-center mb-4">Posts</h2>
                        <div className="  overflow-scroll overflow-x-hidden flex flex-col gap-8">
                            {posts.map((post) => (
                                <Post
                                    key={post._id}
                                    profilePictureId={
                                        post.user.profilePictureId
                                    }
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
                        {posts.length === 0 && (
                            <div className="overflow-hidden text-center">
                                No posts to show...
                            </div>
                        )}
                    </div>
                </Transition.Child>
            </Dialog>
        </Transition>
    );

    if (loading)
        return (
            <div className="w-full mt-52 flex justify-center items-center">
                <CircularProgress />
            </div>
        );

    return (
        <div className="profile-page  flex flex-col px-4 justify-center items-center gap-8">
            {FollowingModal()}
            {FollowersModal()}
            {PostsModal()}
            <div className="profile-pic-section mt-20 w-52 h-52 ">
                <Avatar
                    src={user.profilePictureId}
                    className="profile-pic"
                    style={{ width: "100%", height: "100%" }}
                />
            </div>
            <div className="follow-posts flex  gap-4 justify-center sm:flex-col sm:w-1/2 sm:text-center ">
                <div className="following bg-dark text-light border-2  rounded-md hover:bg-light hover:border-dark hover:text-dark">
                    <button
                        className="px-8 py-2"
                        onClick={() => setFollowingShow(true)}
                    >
                        <Typography variant="h5">Following</Typography>
                    </button>
                </div>
                <div className="followers bg-dark text-light border-2  rounded-md hover:bg-light hover:border-dark hover:text-dark">
                    <button
                        className="px-8 py-2"
                        onClick={() => setFollowersShow(true)}
                    >
                        <Typography variant="h5">Followers</Typography>
                    </button>{" "}
                </div>
                <div className="posts bg-dark text-light border-2  rounded-md hover:bg-light hover:border-dark hover:text-dark">
                    <button
                        className="px-8 py-2"
                        onClick={() => setPostsShow(true)}
                    >
                        <Typography variant="h5">Posts</Typography>
                    </button>
                </div>
            </div>
            <div className="edit-profile sm:mb-4 ">
                <button
                    className="edit-profile shadow-2xl bg-teal px-8 py-2 rounded-md border-2 border-dark text-dark text-xl font-bold hover:bg-dark hover:text-light "
                    onClick={() => (window.location = "/edit-profile")}
                >
                    Edit Profile
                </button>
            </div>
        </div>
    );
}
