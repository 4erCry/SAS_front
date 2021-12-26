import React, { useState } from "react";
import Button from "../UI/button/Button";
import classes from "../styles/LoginForm.module.css";
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";
import ChangePassword from "./ChangePassword";

const RestorePassword = () => {
  const [Restore, setLogin] = useState(() => {
    return {
      email: "",
    };
  });

  const [ShowText, setShowText] = useState(() => {
    return {
      showText: false,
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

  const [redirect, setRedirect] = useState(() => {
    return {
      redirect: "",
    };
  });

  let output
  console.log(ShowText)
  if(ShowText.showText) {
    output = (
      <main>
        <div className='only-text'>Если указанный адрес электронной почты существует, мы отправим на него ссылку для восстановления пароля.</div>

        {redirect.redirect !== '' &&
          <Redirect to={redirect.redirect}/>
        }
      </main>)
    } else {
      output =
        (
        <form className={classes.loginForm} onSubmit={setLogin}>
          <h3>Восстановление пароля</h3>
          <div className={classes.loginFormDiv}>
            <input
              type="email"
              id="email"
              placeholder="Электронная почта"
              value={Restore.email}
              onChange={changeInputLogin}
            />
          </div>


          <Button
            type={"submit"}
            onClick={(e) => {
              e.preventDefault()
              fetch("http://3.142.115.21/api/web/resetPass", {
                method: "POST",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  email: Restore.email,
                }),
              }).then((response) => {
                if (response.status == 200) {
                  console.log("nice");
                  setShowText({showText: true})
                  setTimeout(setRedirect, 5000, '/')
                } else {
                  alert("Access Denied");
                  console.log("bad");
                  return;
                }
              })
            }}
          >
            Отправить
          </Button>
        </form>
      );}

    return output
};
export default RestorePassword;
