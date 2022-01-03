import React from "react";
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
import FollowingPosts from "./components/FollowingPosts";
import FullPost from "./components/FullPost";
import EditProfile from "./components/EditProfile";

import Test from "./components/Test";

import Experimental from "./components/Experimental";

export default function App() {
    return (
        <Router>
            <Navbar />

            <Switch>
                {/* Done */}
                <Route exact path="/" component={Home} />
                {/* Done */}
                <Route exact path="/signup" component={Signup} />
                {/* Done */}
                <Route exact path="/signin" component={Signin} />
                {/* Done */}
                <Route exact path="/user/:userId" component={UserProfilePage} />
                {/* Done */}
                <Route exact path="/profile" component={Profile} />
                {/* Done */}
                <Route exact path="/edit-profile" component={EditProfile} />
                {/* Done ISH: Get actual last message and time of it*/}
                <Route exact path="/chats" component={Chats} />
                {/* Done */}
                <Route exact path="/chat/:partnerId" component={Chatroom} />
                {/* NOT DONE */}
                <Route
                    exact
                    path="/targetlanguage"
                    component={TargetLanguagePosts}
                />
                {/* NOT DONE */}
                <Route exact path="/following" component={FollowingPosts} />
                {/* Done */}
                <Route exact path="/post/:postId" component={FullPost} />
                <Route exact path="/experimental" component={Experimental} />
                <Route exact path="/test" component={Test} />
            </Switch>
        </Router>
    );
}
