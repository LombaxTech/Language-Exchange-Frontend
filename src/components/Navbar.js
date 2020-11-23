import React, { useState, useEffect } from "react";
import client from "../feathers";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import AddCommentOutlinedIcon from "@material-ui/icons/AddCommentOutlined";
import MailIcon from "@material-ui/icons/Mail";

import { Avatar } from "@material-ui/core";

import AddPost from "./AddPost";

import "../styles/navbar.scss";

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

    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleProfileMenuOpen = (e) => {
        setAnchorEl(e.currentTarget);
    };

    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            keepMounted
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem
                onClick={async () => {
                    window.location = "/profile";
                }}
            >
                Profile
            </MenuItem>
            <MenuItem
                onClick={async () => {
                    await client.logout();
                    window.location.reload();
                }}
            >
                Sign Out
            </MenuItem>
        </Menu>
    );

    return (
        <div className="root">
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" className="title">
                        <div
                            onClick={() => (window.location = "/")}
                            className="title-text"
                        >
                            HT CLONE
                        </div>
                    </Typography>
                    <div style={{ display: "flex" }}>
                        {/* <Button
                            color="inherit"
                            onClick={() =>
                                (window.location = "/targetlanguage")
                            }
                        >
                            Learn
                        </Button>{" "} */}
                        <Button
                            color="inherit"
                            onClick={() => (window.location = "/following")}
                        >
                            Following
                        </Button>{" "}
                        {!loggedIn && (
                            <div>
                                <Button
                                    color="inherit"
                                    onClick={() =>
                                        (window.location = "/signin")
                                    }
                                >
                                    Login
                                </Button>
                                <Button
                                    color="inherit"
                                    onClick={() =>
                                        (window.location = "/signup")
                                    }
                                >
                                    SIGN UP
                                </Button>
                            </div>
                        )}
                        {loggedIn && (
                            <div>
                                {/* <AddCommentOutlinedIcon className="add-post" /> */}
                                <AddPost />
                                <IconButton
                                    style={{ color: "white" }}
                                    onClick={() => {
                                        window.location = "/chats";
                                    }}
                                >
                                    <MailIcon />
                                </IconButton>
                                <IconButton
                                    edge="end"
                                    aria-label="account of current user"
                                    aria-haspopup="true"
                                    color="inherit"
                                    onClick={handleProfileMenuOpen}
                                >
                                    <Avatar
                                        alt="Sheldon Cooper"
                                        src={user.profilePictureId}
                                        style={{ alignSelf: "center" }}
                                    />
                                    {/* <AccountCircle /> */}
                                </IconButton>
                            </div>
                        )}
                    </div>
                </Toolbar>
            </AppBar>
            {renderMenu}
        </div>
    );
}
