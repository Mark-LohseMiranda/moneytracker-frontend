import React, { useState, useEffect } from "react";
import API from "./utils/API";
import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";
import "bootstrap/dist/css/bootstrap.css";
import "./App.css";

export default function App() {
  const [userState, setUserState] = useState({
    username: "",
    email: "",
    id: "",
  });
  const [token, setToken] = useState("");

  const logout = (e) => {
    localStorage.removeItem("token");
    props.setUserState({ username: "", email: "", id: "" });
    props.setChoice("main");
  };

  useEffect(() => {
    const myToken = localStorage.getItem("token");
    if (myToken) {
      API.verify(myToken)
        .then((res) => {
          setToken(myToken);
          setUserState({
            username: res.data.username,
            email: res.data.email,
            id: res.data.id,
          });
        })
        .catch((err) => {
          console.log(err);
          localStorage.removeItem("token");
        });
    }
  }, []);

  return (
    <div className="container">
      <div className="row justify-content-md-center">
        <div className="col text-center">
          <Signup setToken={setToken} setUserState={setUserState} />
        </div>
        <div className="col text-center">
          <Login setUserState={setUserState} setToken={setToken} />
        </div>
      </div>
      <div className="row justify-content-md-center">
        <div className="col text-center">
          Username: {userState.username}
          <br />
          Email: {userState.email}
          <br />
          Token: {token}
        </div>
      </div>
      <div className="row justify-content-md-center">
        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
}
