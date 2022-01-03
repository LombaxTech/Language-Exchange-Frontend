import React, { useState, useEffect } from "react";

import { Input, InputLabel, Select, MenuItem } from "@material-ui/core";

import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

import { DropzoneArea } from "material-ui-dropzone";

import "../styles/editprofile.scss";
import client from "../feathers";
const cloudName = "dhrowvziz";

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: "100%", // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export default function EditProfile() {
    const classes = useStyles();

    const usersService = client.service("users");
    const [user, setUser] = useState({});

    async function init() {
        let user = await client.authenticate();
        user = user.user;
        console.log(user);
        setUser(user);
        setName(user.name);
        setTargetLanguage(user.targetLanguage);
    }
    useEffect(() => {
        init();
    }, []);

    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [file, setFile] = useState({});
    const [targetLanguage, setTargetLanguage] = useState("");

    const updatePasswordValue = (e) => setPassword(e.target.value);
    const updateNameValue = (e) => setName(e.target.value);
    const handleTargetLanguageChange = (e) => setTargetLanguage(e.target.value);
    const handleFileUpload = (file) => setFile(file[0]);

    const updateProfile = async (e) => {
        e.preventDefault();

        let valuesToChange = {};
        if (name) valuesToChange = { ...valuesToChange, name };
        if (password) valuesToChange = { ...valuesToChange, password };
        if (typeof file !== "undefined")
            valuesToChange = { ...valuesToChange, file };
        // return console.log(valuesToChange);

        if (typeof file !== "undefined") {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", "testpreset");

            try {
                let result = await fetch(
                    `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
                    {
                        method: "POST",
                        body: formData,
                    }
                );
                result = await result.json();
                const { secure_url } = result;
                if (secure_url) {
                    valuesToChange = {
                        ...valuesToChange,
                        profilePictureId: secure_url,
                    };
                }
            } catch (error) {
                console.log(error);
            }
        }

        if (Object.keys(valuesToChange).length === 0) {
            return console.log("nothing to change");
        }
        // console.log(valuesToChange);
        // return;

        try {
            let result = await usersService.patch(user._id, valuesToChange);
            console.log(result);
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Container component="main" maxWidth="xs" className="edit-profile-page">
            <CssBaseline />
            <div className={classes.paper}>
                <div className="mb-4">
                    <Avatar
                        src={user.profilePictureId}
                        className="profile-pic"
                    />
                </div>
                <div className="my-8">
                    <Typography component="h1" variant="h5">
                        Update Profile
                    </Typography>
                </div>
                <form
                    className={classes.form}
                    noValidate
                    onSubmit={updateProfile}
                >
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                autoComplete="name"
                                name="name"
                                variant="outlined"
                                fullWidth
                                label="New Name"
                                autoFocus
                                value={name}
                                onChange={updateNameValue}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                fullWidth
                                label="New Password"
                                type="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={updatePasswordValue}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <InputLabel>Target Language</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={targetLanguage}
                                onChange={handleTargetLanguageChange}
                            >
                                <MenuItem value={"Eng"}>English</MenuItem>
                                <MenuItem value={"Jpn"}>Japanese</MenuItem>
                                <MenuItem value={"Fr"}>French</MenuItem>
                            </Select>
                        </Grid>
                        <Grid item xs={12}>
                            <div className="mb-6">
                                <InputLabel>Change Profile Picture</InputLabel>
                            </div>
                            <DropzoneArea
                                filesLimit={1}
                                showPreviews={true}
                                showPreviewsInDropzone={false}
                                dropzoneClass={classes.dropzone}
                                onChange={handleFileUpload}
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        style={{ background: "#3d5af1", padding: "0.5rem " }}
                    >
                        Save Changes
                    </Button>
                </form>
            </div>
        </Container>
    );
}
