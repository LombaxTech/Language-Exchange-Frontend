import React, { useState, useEffect, Fragment } from "react";
import client from "../feathers";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MenuItem from "@material-ui/core/MenuItem";
// import Menu from "@material-ui/core/Menu";
import AddCommentOutlinedIcon from "@material-ui/icons/AddCommentOutlined";
import MailIcon from "@material-ui/icons/Mail";
import { Avatar } from "@material-ui/core";
import AddPost from "./AddPost";
import "../styles/navbar.scss";
import { Menu, Transition } from "@headlessui/react";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [user, setUser] = useState({});

    async function init() {
        try {
            let result = await client.authenticate();
            setUser(result.user);
            setLoggedIn(true);
        } catch (err) {
            console.log(err);
            setLoggedIn(false);
        }
    }

    useEffect(() => {
        init();
    }, []);

    function MyDropdown() {
        return (
            <Menu as="div" className="relative inline-block text-left">
                <div>
                    <Menu.Button className="w-7 h-7 flex justify-center items-center">
                        <Avatar
                            alt="Sheldon Cooper"
                            src={user.profilePictureId}
                            style={{ width: "100%", height: "100%" }}
                        />
                    </Menu.Button>
                </div>

                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1">
                            <Menu.Item>
                                <div
                                    className=" text-gray-900 px-4 py-2 cursor-pointer hover:bg-gray-100 text-sm"
                                    onClick={async () => {
                                        window.location = "/profile";
                                    }}
                                >
                                    Profile
                                </div>
                            </Menu.Item>
                            <Menu.Item>
                                <div
                                    className=" text-gray-900 px-4 py-2 cursor-pointer hover:bg-gray-100 text-sm"
                                    onClick={async () => {
                                        await client.logout();
                                        window.location = "/";
                                    }}
                                >
                                    Log Out
                                </div>
                            </Menu.Item>
                        </div>
                    </Menu.Items>
                </Transition>
            </Menu>
        );
    }

    const LoggedOutLinks = () => (
        <ul className="m-0 flex gap-8 uppercase">
            <li
                className="cursor-pointer"
                onClick={() => {
                    window.location = "./signin";
                }}
            >
                Login
            </li>
            <li
                className="cursor-pointer"
                onClick={() => {
                    window.location = "./signup";
                }}
            >
                Sign Up
            </li>
        </ul>
    );

    const LoggedInLinks = () => (
        <ul className="m-0 flex gap-8   justify-center items-center">
            <li
                className="cursor-pointer flex justify-center items-center"
                onClick={() => {
                    window.location = "/chats";
                }}
            >
                <MailIcon style={{ color: "white" }} />
            </li>
            <li className=" cursor-pointer w-7 h-7 flex justify-center items-center">
                <AddPost />
            </li>
            <MyDropdown />
        </ul>
    );

    const NewNav = () => (
        <div className="bg-dark text-light shadow-xl py-4 px-4 flex justify-between items-center relative z-10">
            <div
                className="logo cursor-pointer"
                onClick={() => {
                    window.location = "/";
                }}
            >
                <h4>RK Languages</h4>
            </div>
            {!loggedIn && <LoggedOutLinks />}
            {loggedIn && <LoggedInLinks />}
        </div>
    );

    return <NewNav />;
}

// const [anchorEl, setAnchorEl] = useState(null);
//     const isMenuOpen = Boolean(anchorEl);
//     const handleMenuClose = () => setAnchorEl(null);
//     const handleProfileMenuOpen = (e) => setAnchorEl(e.currentTarget);

//     const renderMenu = (
//         <Menu
//             anchorEl={anchorEl}
//             anchorOrigin={{ vertical: "top", horizontal: "right" }}
//             keepMounted
//             transformOrigin={{ vertical: "top", horizontal: "right" }}
//             open={isMenuOpen}
//             onClose={handleMenuClose}
//         >
//             <MenuItem
//                 onClick={async () => {
//                     window.location = "/profile";
//                 }}
//             >
//                 Profile
//             </MenuItem>
//             <MenuItem
//                 onClick={async () => {
//                     await client.logout();
//                     window.location = "/";
//                 }}
//             >
//                 Sign Out
//             </MenuItem>
//         </Menu>
//     );

//     const loggedInLinks = () => (
//         <div>
//             <Button
//                 color="inherit"
//                 onClick={() => (window.location = "/following")}
//             >
//                 Following
//             </Button>
//             {/* <AddCommentOutlinedIcon className="add-post" /> */}
//             <AddPost />
//             <IconButton
//                 style={{ color: "white" }}
//                 onClick={() => {
//                     window.location = "/chats";
//                 }}
//             >
//                 <MailIcon />
//             </IconButton>
//             <IconButton
//                 edge="end"
//                 aria-label="account of current user"
//                 aria-haspopup="true"
//                 color="inherit"
//                 onClick={handleProfileMenuOpen}
//             >
//                 <Avatar
//                     alt="Sheldon Cooper"
//                     src={user.profilePictureId}
//                     style={{ alignSelf: "center" }}
//                 />
//                 {/* <AccountCircle /> */}
//             </IconButton>
//         </div>
//     );

//     const loggedOutLinks = () => (
//         <div>
//             <Button
//                 color="inherit"
//                 onClick={() => (window.location = "/signin")}
//             >
//                 Login
//             </Button>
//             <Button
//                 color="inherit"
//                 onClick={() => (window.location = "/signup")}
//             >
//                 SIGN UP
//             </Button>
//         </div>
//     );

//     const PrevNav = () => (
//         <div className="root">
//             <AppBar position="static">
//                 <Toolbar>
//                     <Typography variant="h6" className="title">
//                         <div
//                             onClick={() => (window.location = "/")}
//                             className="title-text"
//                         >
//                             RK Language Learning
//                         </div>
//                     </Typography>
//                     <div style={{ display: "flex" }}>
//                         {!loggedIn && loggedOutLinks()}
//                         {loggedIn && loggedInLinks()}
//                     </div>
//                 </Toolbar>
//             </AppBar>
//             {renderMenu}
//         </div>
//     );
