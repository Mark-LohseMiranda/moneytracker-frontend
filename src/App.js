import React, { useState, useEffect } from "react";
import API from "./utils/API";
import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";
import Add from "./components/Transaction/Add";
import Display from "./components/Transaction/Display";
import "bootstrap/dist/css/bootstrap.css";
import "./App.css";

export default function App() {
  const [userState, setUserState] = useState({
    username: "",
    email: "",
    id: "",
  });
  const [token, setToken] = useState();
  const [transactions, setTransactions] = useState();

  const logout = (e) => {
    localStorage.removeItem("token");
    setUserState({ username: "", email: "", id: "" });
    setToken("");
    setTransactions();
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
          API.getAll(myToken)
            .then((res) => {
              setTransactions(res.data);
            })
            .catch((err) => {
              console.log(err);
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
      {!userState.username ? (
        <>
          <div className="row justify-content-md-center">
            <div className="col text-center">
              <Signup setToken={setToken} setUserState={setUserState} />
            </div>
            <div className="col text-center">
              <Login
                setTransactions={setTransactions}
                setUserState={setUserState}
                setToken={setToken}
              />
            </div>
          </div>
          <div className="row justify-content-md-center">
            <div className="col text-center">
              Username: {userState.username}
              <br />
              Email: {userState.email}
            </div>
          </div>
        </>
      ) : null}
      {userState.username ? (
        <div>
          <div className="row">
            <div className="text-center">
              <button onClick={logout}>Logout</button>
            </div>
          </div>
          <div className="row">
            <div className="text-center">
              <Add setTransactions={setTransactions} transactions={transactions} token={token} />
            </div>
          </div>
          <div className="row">
            <div className="text-center">
              <Display setTransactions={setTransactions} transactions={transactions} token={token}/>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
