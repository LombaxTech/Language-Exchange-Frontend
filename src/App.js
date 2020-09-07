import React from "react";
import "./styles/App.scss";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Signup from "./components/Signup";
import Signin from "./components/Signin";
import Profile from "./components/Profile";
import UserProfilePage from "./components/UserProfilePage";
import Chatroom from "./components/Chatroom";
import Chats from "./components/Chats";
import TargetLanguagePosts from "./components/TargetLanguagePosts";

export default function App() {
    return (
        <Router>
            <Navbar />
            <Switch>
                <Route exact path="/" component={Home} />
                <Route exact path="/signup" component={Signup} />
                <Route exact path="/signin" component={Signin} />
                <Route exact path="/user/:userId" component={UserProfilePage} />
                <Route exact path="/profile" component={Profile} />
                <Route exact path="/chats" component={Chats} />
                <Route exact path="/chat/:partnerId" component={Chatroom} />
                <Route
                    exact
                    path="/targetlanguage"
                    component={TargetLanguagePosts}
                />
            </Switch>
        </Router>
    );
}
