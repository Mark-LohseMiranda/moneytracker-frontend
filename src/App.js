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
  const [showLogin, setShowLogin] = useState(true);

  const logout = (e) => {
    localStorage.removeItem("token");
    setUserState({ username: "", email: "", id: "" });
    setToken("");
    setTransactions();
  };

  const getTotal = () => {
    let total = 0;
    transactions?.forEach((item) => {
      total = total + Number(item.value);
    });
    return total;
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
          <div className="d-grid gap-2 col-6 mx-auto">
            <button
              className="btn btn-outline-primary btn-lg"
              type="button"
              onClick={() => {
                setShowLogin(false);
              }}
            >
              Signup
            </button>
            <button
              className="btn btn-outline-primary btn-lg"
              type="button"
              onClick={() => {
                setShowLogin(true);
              }}
            >
              Login
            </button>
            {!showLogin ? (
              <div className="col text-center">
                <Signup setToken={setToken} setUserState={setUserState} />
              </div>
            ) : (
              <div className="col text-center">
                <Login
                  setTransactions={setTransactions}
                  setUserState={setUserState}
                  setToken={setToken}
                />
              </div>
            )}
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
              <Add
                setTransactions={setTransactions}
                transactions={transactions}
                token={token}
              />
            </div>
          </div>
          <div className="row">
            <div className="text-center">Total: ${getTotal()}</div>
          </div>
          <div className="row">
            <div className="text-center">
              <Display
                setTransactions={setTransactions}
                transactions={transactions}
                token={token}
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
