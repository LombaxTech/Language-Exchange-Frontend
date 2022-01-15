import React, { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

import AddCommentOutlinedIcon from "@material-ui/icons/AddCommentOutlined";
import { IconButton } from "@material-ui/core";
import { Button } from "react-bootstrap";
import Modal from "./Modal";

import client from "../feathers";
import "../styles/addpost.scss";

import io from "socket.io-client";
const socket = io(process.env.REACT_APP_API_BASE_URL);

const PostModal = ({
    show,
    setShow,
    postText,
    handlePostTextChange,
    submitPost,
}) => (
    <Modal show={show} setShow={setShow}>
        <div className=" p-4 text-center">
            <h1 className="text-2xl">Post</h1>
        </div>
        {/* Post Body */}
        <div className="p-4 bg-white text-black flex-1">
            <textarea
                className="post-text overflow-hidden"
                value={postText}
                onChange={handlePostTextChange}
                maxLength="1000"
            ></textarea>
        </div>

        {/* Submit Post */}
        <div className="p-4  ">
            <Button className="submit-post" onClick={submitPost}>
                Submit Post
            </Button>
        </div>
    </Modal>
);

const ErrorModal = ({ error, setError }) => (
    <Transition
        show={error}
        enter="transition duration-100 ease-out"
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-75 ease-out"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-95 opacity-0"
    >
        <Dialog
            open={error}
            onClose={() => setError(false)}
            className="fixed inset-0  flex justify-center items-center"
        >
            {/* <Dialog.Overlay className="fixed inset-0 bg-white opacity-70 z-10" /> */}
            <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <div className="bg-red-100 border border-red-400 text-red-700 mt-4 px-4 py-3 rounded relative w-1/3 ">
                    <span className="">Failed To Post</span>
                    <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                        <svg
                            className="fill-current h-6 w-6 text-red-500 cursor-pointer"
                            role="button"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            onClick={() => setError(false)}
                        >
                            <title>Close</title>
                            <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                        </svg>
                    </span>
                </div>
            </Transition.Child>
        </Dialog>
    </Transition>
);

const PostSuccessModal = ({ postSuccess, setPostSuccess }) => (
    <Transition
        show={postSuccess}
        enter="transition duration-100 ease-out"
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-75 ease-out"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-95 opacity-0"
    >
        <Dialog
            open={postSuccess}
            onClose={() => setPostSuccess(false)}
            className="fixed inset-0  flex justify-center items-center"
        >
            {/* <Dialog.Overlay className="fixed inset-0 bg-white opacity-70 z-10" /> */}
            <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <div className="bg-green-100 border-t-4 border-green-500 text-green-900 mt-4 px-4 py-3 rounded relative w-1/3 ">
                    <span className="">Successfully Posted</span>
                    <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                        <svg
                            className="fill-current h-6 w-6 text-green-900 cursor-pointer"
                            role="button"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            onClick={() => setPostSuccess(false)}
                        >
                            <title>Close</title>
                            <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                        </svg>
                    </span>
                </div>
            </Transition.Child>
        </Dialog>
    </Transition>
);

export default function AddPost() {
    const postsService = client.service("posts");
    const [currentUser, setCurrentUser] = useState({});
    async function init() {
        try {
            let user = await client.authenticate();
            setCurrentUser(user.user);
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        init();
    }, []);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [postText, setPostText] = useState("");
    const [show, setShow] = useState(false);
    const handlePostTextChange = (e) => setPostText(e.target.value);

    const [error, setError] = useState(false);
    const [postSuccess, setPostSuccess] = useState(false);

    const submitPost = async () => {
        // return console.log(currentUser)
        const post = {
            text: postText,
            user: currentUser._id,
            language: currentUser.nativeLanguage,
        };
        try {
            let result = await postsService.create(post);
            socket.emit("post", result);
            console.log(result);
            handleClose();
            setShow(false);
            setPostSuccess(true);
        } catch (error) {
            console.log(error);
            setShow(false);
            setError(true);
        }
    };

    return (
        <div style={{}}>
            <IconButton onClick={handleShow} style={{ color: "white" }}>
                <AddCommentOutlinedIcon />
            </IconButton>

            <PostModal
                show={show}
                setShow={setShow}
                postText={postText}
                handlePostTextChange={handlePostTextChange}
                submitPost={submitPost}
            />

            {error && <ErrorModal error={error} setError={setError} />}
            {postSuccess && (
                <PostSuccessModal
                    postSuccess={postSuccess}
                    setPostSuccess={setPostSuccess}
                />
            )}
            {/* {PostModal()} */}
        </div>
    );
}
