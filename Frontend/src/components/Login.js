import React, { useState } from "react";
import loginService from "../services/login";

const Login = ({ setUser }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const login = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem("loggedInUser", JSON.stringify(user));
      setUser(user);
      setUsername("");
      setPassword("");
    } catch (exception) {
      setErrorMessage("Incorrect Username or Password");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  return (
    <div className="col-md-4">
      <h3>Login</h3>
      <form onSubmit={login}>
        <div className="mb-2">
          <label className="form-label">Username</label>
          <input
            id="userInp"
            name="username"
            className="form-control form-control-sm"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div className="mb-2">
          <label className="form-label">Password</label>
          <input
            id="passInp"
            type="password"
            name="password"
            className="form-control form-control-sm"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button className="btn btn-sm btn-primary loginBtn" type="submit">
          Login
        </button>
      </form>
      {errorMessage ? (
        <p className="mt-2 alert alert-danger">{errorMessage}</p>
      ) : null}
    </div>
  );
};

export default Login;
