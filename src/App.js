import React from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Home from "./components/Home";
import Signup from "./components/Signup";
import Profile from "./components/Profile";
import { Button, AppBar, Avatar } from "@material-ui/core";

export default function App() {
    return (
        <Router>
            <Switch>
                <Route exact path="/" component={Home} />
                <Route exact path="/signup" component={Signup} />
                <Route exact path="/profile" component={Profile} />
            </Switch>
        </Router>
    );
}
