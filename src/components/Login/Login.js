import React, { useState } from "react";
import API from "../../utils/API";
import decode from "jwt-decode";

export default function Login(props) {

    const [errorMsg, setErrorMsg] = useState();

    const [loginFormState, setLoginFormState] = useState({
        email: "",
        password: "",
      });
    
      const handleLoginChange = e => {
        const { name, value } = e.target;
        setLoginFormState({
          ...loginFormState,
          [name]: value
        })
      }
    
      const handleLoginSubmit = (e) => {
        e.preventDefault();
        API.login(loginFormState)
          .then((res) => {
            // console.log(res);
            setLoginFormState({ email: "", password: "" });
            setErrorMsg("");
            const decoded = decode(res.data.token);
            props.setUserState({
              username: decoded.data.username,
              email:decoded.data.email,
              id: decoded.data.id
            });
            props.setToken(res.data.token);
            localStorage.setItem("token", res.data.token);
            API.getAll(res.data.token)
            .then((res) => {
              props.setTransactions(res.data);
            })
            .catch((err) => {
              console.log(err);
            });
          })
          .catch((err) => {
            setErrorMsg("Wrong email and/or password");
          });
      };

      return (
        <form className="" id="login-form"
        onSubmit={handleLoginSubmit}
      >
        <h4>Login</h4>
        <input className="" id="email-login"
          value={loginFormState.email}
          name="email"
          onChange={handleLoginChange}
          type="email"
          placeholder="Email"
          autoComplete="email"
        />
        <br />
        <input className="" id="password-login"
          value={loginFormState.password}
          name="password"
          onChange={handleLoginChange}
          type="password"
          placeholder="Password"
          autoComplete="current-password"
        />
        <br />
        <p>{errorMsg}</p>
        <button className="" id="submit-login">Submit</button>
      </form>
      )

}