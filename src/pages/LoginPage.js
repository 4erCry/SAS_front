import React, { useState } from "react";
import Button from "../UI/button/Button";
import classes from "../styles/RegisterForm.module.css";
import validator from "validator";
import { DOMEN_SERVER } from "../config/const";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import LoginForm from "./LoginForm";
import ChangePassword from "./ChangePassword";

const LoginPage = () => {
  const [Login, setLogin] = useState(() => {
    return {
      username: "",
      email: "",
      password: "",
      forgot: false,
    };
  });

  const [error, setError] = useState(() => {
    return {
      errorValue: "",
    };
  });

  const changeInputLogin = (event) => {
    event.persist();
    setLogin((prev) => {
      return {
        ...prev,
        [event.target.id]: event.target.value,
      };
    });
  };

  return (
    {/*<Router>
      <Route exact path="" component={LoginForm} />
    </Router>*/}
  );
};

export default LoginPage;
