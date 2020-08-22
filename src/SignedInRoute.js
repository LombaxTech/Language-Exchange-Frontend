// TODO: MAKE THIS CRAP WORK

// import React, { useState, useEffect } from "react";
// import { Redirect, Route } from "react-router-dom";
// import client from "./feathers";

// export default function SignedInRoute(props) {
//     async function isLoggedIn() {
//         try {
//             let result = await client.authenticate();
//             return true;
//         } catch (error) {
//             return false;
//         }
//     }

//     useEffect(() => {
//         isLoggedIn();
//     }, []);

//     return signedIn ? (
//         <Route path={props.path} exact component={props.component} />
//     ) : (
//         <Redirect to="/signin" />
//     );
// }
