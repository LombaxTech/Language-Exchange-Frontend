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

// const PostModal = ({
//     show,
//     setShow,
//     postText,
//     handlePostTextChange,
//     submitPost,
// }) => (
//     <Transition
//         show={show}
//         enter="transition duration-100 ease-out"
//         enterFrom="transform scale-95 opacity-0"
//         enterTo="transform scale-100 opacity-100"
//         leave="transition duration-75 ease-out"
//         leaveFrom="transform scale-100 opacity-100"
//         leaveTo="transform scale-95 opacity-0"
//     >
//         <Dialog
//             open={show}
//             onClose={() => setShow(false)}
//             className="fixed inset-0  flex justify-center items-center"
//         >
//             <Dialog.Overlay className="fixed inset-0 bg-white opacity-70 z-10" />
//             <Transition.Child
//                 as={Fragment}
//                 enter="ease-out duration-300"
//                 enterFrom="opacity-0"
//                 enterTo="opacity-100"
//                 leave="ease-in duration-200"
//                 leaveFrom="opacity-100"
//                 leaveTo="opacity-0"
//             >
//                 <div className="w-full max-w-md h-1/2   overflow-hidden  z-20 bg-dark text-white shadow-xl rounded-2xl flex flex-col ">
//                     {/* Title */}
//                     <div className=" p-4 text-center">
//                         <h1 className="text-2xl">Post</h1>
//                     </div>
//                     {/* Post Body */}
//                     <div className="p-4 bg-white text-black flex-1">
//                         <textarea
//                             className="post-text overflow-hidden"
//                             value={postText}
//                             onChange={handlePostTextChange}
//                             maxLength="1000"
//                         ></textarea>
//                     </div>

//                     {/* Submit Post */}
//                     <div className="p-4  ">
//                         <Button className="submit-post" onClick={submitPost}>
//                             Submit Post
//                         </Button>
//                     </div>
//                 </div>
//             </Transition.Child>
//         </Dialog>
//     </Transition>
// );

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
        } catch (error) {
            console.log(error);
        }
    };

    // const PostModal = () => (
    //     <Transition
    //         show={show}
    //         enter="transition duration-100 ease-out"
    //         enterFrom="transform scale-95 opacity-0"
    //         enterTo="transform scale-100 opacity-100"
    //         leave="transition duration-75 ease-out"
    //         leaveFrom="transform scale-100 opacity-100"
    //         leaveTo="transform scale-95 opacity-0"
    //     >
    //         <Dialog
    //             open={show}
    //             onClose={() => setShow(false)}
    //             className="fixed inset-0  flex justify-center items-center"
    //         >
    //             <Dialog.Overlay className="fixed inset-0 bg-white opacity-70 z-10" />
    //             <Transition.Child
    //                 as={Fragment}
    //                 enter="ease-out duration-300"
    //                 enterFrom="opacity-0"
    //                 enterTo="opacity-100"
    //                 leave="ease-in duration-200"
    //                 leaveFrom="opacity-100"
    //                 leaveTo="opacity-0"
    //             >
    //                 <div className="w-full max-w-md h-1/2   overflow-hidden  z-20 bg-dark text-white shadow-xl rounded-2xl flex flex-col ">
    //                     {/* Title */}
    //                     <div className=" p-4 text-center">
    //                         <h1 className="text-2xl">Post</h1>
    //                     </div>
    //                     {/* Post Body */}
    //                     <div className="p-4 bg-white text-black flex-1">
    //                         <textarea
    //                             className="post-text overflow-hidden"
    //                             value={postText}
    //                             onChange={handlePostTextChange}
    //                             maxLength="1000"
    //                         ></textarea>
    //                     </div>
    //                     {/* Submit Post */}
    //                     <div className="p-4  ">
    //                         <Button
    //                             className="submit-post"
    //                             onClick={submitPost}
    //                         >
    //                             Submit Post
    //                         </Button>
    //                     </div>
    //                 </div>
    //             </Transition.Child>
    //         </Dialog>
    //     </Transition>
    // );

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
            {/* {PostModal()} */}
        </div>
    );
}
