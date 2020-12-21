import React, { useState, useEffect } from "react";
import client from "../feathers";

import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Input,
    CircularProgress,
} from "@material-ui/core";

import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

import { DropzoneArea } from "material-ui-dropzone";

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {"Copyright © "}
            <Link color="inherit" href="https://material-ui.com/">
                HelloTalk Web
            </Link>{" "}
            {new Date().getFullYear()}
            {"."}
        </Typography>
    );
}

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

const cloudName = "dhrowvziz";

export default function Signup() {
    const classes = useStyles();

    const usersService = client.service("users");

    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [file, setFile] = useState({});
    const [nativeLanguage, setNativeLanguage] = useState("English");
    const [targetLanguage, setTargetLanguage] = useState("English");

    const updateEmailValue = (e) => setEmail(e.target.value);
    const updatePasswordValue = (e) => setPassword(e.target.value);
    const updateNameValue = (e) => setName(e.target.value);
    const handleNativeLanguageChange = (e) => setNativeLanguage(e.target.value);
    const handleTargetLanguageChange = (e) => setTargetLanguage(e.target.value);
    const handleFileUpload = (file) => setFile(file[0]);

    const signup = async (e) => {
        e.preventDefault();
        // return console.log({
        //     email,
        //     name,
        //     password,
        //     targetLanguage,
        //     nativeLanguage,
        //     file,
        // });
        setLoading(true);
        try {
            let user = await usersService.create({
                email,
                password,
                name,
                nativeLanguage,
                targetLanguage,
            });

            // console.log(user);
            await client.authenticate({ strategy: "local", email, password });

            // * GET USER PROFILE IMAGE
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", "testpreset");

            let result = await fetch(
                `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
                {
                    method: "POST",
                    body: formData,
                }
            );
            result = await result.json();
            const { secure_url } = result;
            user = await usersService.patch(user._id, {
                profilePictureId: secure_url,
            });
            console.log(user);
            setLoading(false);
            window.location = "/";
            // * END OF GET USER PROFILE IMAGE
        } catch (error) {
            console.log(error.message);
            setLoading(false);
        }
    };

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign up
                </Typography>
                <form className={classes.form} noValidate onSubmit={signup}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                autoComplete="name"
                                name="name"
                                variant="outlined"
                                required
                                fullWidth
                                id="name"
                                label="Name"
                                autoFocus
                                value={name}
                                onChange={updateNameValue}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                value={email}
                                onChange={updateEmailValue}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={updatePasswordValue}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <InputLabel>Native Language</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={nativeLanguage}
                                onChange={handleNativeLanguageChange}
                            >
                                <MenuItem value={"Eng"}>English</MenuItem>
                                <MenuItem value={"Jpn"}>Japanese</MenuItem>
                                <MenuItem value={"Fr"}>French</MenuItem>
                            </Select>
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
                            <InputLabel>Upload Profile Picture</InputLabel>
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
                    >
                        Sign Up
                    </Button>
                    <Grid container justify="flex-end">
                        <Grid item>
                            <Link href="/login" variant="body2">
                                Already have an account? Sign in
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
            <Box mt={5}>
                <Copyright />
            </Box>
        </Container>
    );
}

// <div>
//     <h1>Sign Up</h1>
//     <form onSubmit={signup}>
//         <TextField
//             label="Email"
//             value={email}
//             onChange={updateEmailValue}
//         />
//         <TextField
//             style={{ display: "block" }}
//             type="password"
//             label="Password"
//             value={password}
//             onChange={updatePasswordValue}
//         />
//         <TextField
//             label="Name"
//             value={name}
//             onChange={updateNameValue}
//         />

//         <InputLabel>Native Language</InputLabel>
//         <Select
//             labelId="demo-simple-select-label"
//             id="demo-simple-select"
//             value={nativeLanguage}
//             onChange={handleNativeLanguageChange}
//         >
//             <MenuItem value={"Eng"}>English</MenuItem>
//             <MenuItem value={"Jpn"}>Japanese</MenuItem>
//             <MenuItem value={"Fr"}>French</MenuItem>
//         </Select>

{
    /* <InputLabel>Target Language</InputLabel>
        <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={targetLanguage}
            onChange={handleTargetLanguageChange}
        >
            <MenuItem value={"Eng"}>English</MenuItem>
            <MenuItem value={"Jpn"}>Japanese</MenuItem>
            <MenuItem value={"Fr"}>French</MenuItem>
        </Select> */
}

//         <Input type="file" onChange={handleFileUpload} />

//         <button
//             type="submit"
//             style={{ display: "block", margin: "10px" }}
//         >
//             Sign Up
//         </button>
//     </form>

//     {/* <FormControl> */}
//     {/* </FormControl>s */}
// </div>
