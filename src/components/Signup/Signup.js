import React, { useState } from "react";
import API from "../../utils/API";
import decode from "jwt-decode";

export default function Signup(props) {
  const [errorMsg, setErrorMsg] = useState();

  const [signupFormState, setSignupFormState] = useState({
    email: "",
    password: "",
    username: "",
    confirmPassword: "",
  });

  // listens for form changes

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupFormState({
      ...signupFormState,
      [name]: value,
    });
  };

  // verifies password matches and is at least 8 characters
  // if user email already exists display error
  // if account is successfully created, populate userState with user info
  // and navigate to profile page.

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    if (signupFormState.password !== signupFormState.confirmPassword) {
      setErrorMsg("Passwords don't match");
    } else if (signupFormState.password.length < 8) {
      setErrorMsg("Password needs to be a least 8 characters");
    } else {
      API.signup(signupFormState)
        .then((res) => {
          setErrorMsg("");
          setSignupFormState({
            email: "",
            password: "",
            username: "",
            confirmPassword: "",
          });
          API.login(signupFormState)
            .then((res) => {
              const decoded = decode(res.data.token);
              props.setUserState({
                username: decoded.data.username,
                email: decoded.data.email,
                id: decoded.data.id,
              });
              props.setToken(res.data.token);
              localStorage.setItem("token", res.data.token);
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          setErrorMsg("User already exists please login");
        });
    }
  };

  return (
    <div className="">
      <form className="" id="signup-form" onSubmit={handleSignupSubmit}>
        <h4>Signup</h4>
        <input
          className=""
          id="username-signup"
          value={signupFormState.username}
          name="username"
          onChange={handleSignupChange}
          placeholder="Username"
        />
        <br />
        <input
          className=""
          id="email-signup"
          value={signupFormState.email}
          name="email"
          onChange={handleSignupChange}
          type="email"
          placeholder="Email"
        />
        <br />
        <input
          className=""
          id="password-signup"
          value={signupFormState.password}
          name="password"
          onChange={handleSignupChange}
          type="password"
          placeholder="Password"
        />
        <br />
        <input
          className=""
          id="confirmPassword-signup"
          value={signupFormState.confirmPassword}
          name="confirmPassword"
          onChange={handleSignupChange}
          type="password"
          placeholder="Confirm Password"
        />
        <br />

        <p>{errorMsg}</p>
        <button className="" id="signup-btn">
          Submit
        </button>
      </form>
    </div>
  );
}
