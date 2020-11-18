import React, { useState, useEffect } from "react";
import client from "../feathers";

import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";

import Followers from "./Followers";
import Following from "./Following";

import "../styles/profile.scss";

export default function Profile() {
    const usersService = client.service("users");

    const [user, setUser] = useState({});

    const [loading, setLoading] = useState(true);

    async function init() {
        setLoading(true);
        let user = await client.authenticate();
        user = user.user;
        console.log(user);
        setUser(user);
        setLoading(false);
    }

    useEffect(() => {
        init();
    }, []);

    if (loading) return <h1>Loading...</h1>;

    return (
        <div className="profile-page">
            <div className="profile-pic-section">
                <Avatar src={user.profilePictureId} className="profile-pic" />
            </div>
            <div className="follow-posts">
                <div className="following">
                    <Button variant="outlined">
                        <Typography variant="h5">Following</Typography>
                    </Button>
                </div>
                <div className="followers">
                    <Button variant="outlined">
                        <Typography variant="h5">Followers</Typography>
                    </Button>{" "}
                </div>
                <div className="posts">
                    <Button variant="outlined">
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
