import React, { useState } from "react";
import Button from "../UI/button/Button";
import classes from "../styles/RegisterForm.module.css";
import validator from "validator";
import { DOMEN_SERVER } from "../config/const";
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";

import { UserContext } from '../contexts/UserContext'

const LoginForm = () => {
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

  const [redirect, setRedirect] = useState(() => {
    return {
      redirect: "",
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
    <UserContext.Consumer>{({logIn}) =>
    (<div className={classes.mainDiv}>
      <div className={classes.registerFormDiv}>
        <form className={classes.registerForm} onSubmit={setLogin}>
          <h2> Войти </h2>
          <input
            type="email"
            id="email"
            placeholder="Электронная почта"
            value={Login.email}
            onChange={changeInputLogin}
          />
          <input
            type="password"
            id="password"
            placeholder="Пароль"
            value={Login.password}
            onChange={changeInputLogin}
          />
        <Link to="/restore">забыли пароль?</Link>
          <div hidden className="text-danger" id="hidden">
            {error.errorValue}
          </div>
          <Button
            type={"submit"}
            onClick={(e) =>
              {
                e.preventDefault()
                fetch("http://3.142.115.21/api/web/auth", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    email: Login.email,
                    password: Login.password,
                  }),
                }).then((response) => {
                  if (response.status === 200) {
                    response.json()
                    .then(data => {
                      fetch('http://3.142.115.21/api/web/userInfo', {
                        method: "GET",
                        headers: {
                          "Authorization": data['access'],
                        }
                      })
                      .then(res => res.json())
                      .then(data => {
                        data = data['result']
                        logIn(data['accessToken'], data['refreshToken'], data['login'], data['email'])
                        setRedirect('/sensors')
                      })
                    })

                  } else {
                    response.json()
                    .then(data => {
                      setError(response.data.errorText)
                    })
                  }
                })
                .catch((err) => {
                  setError("Ошибка подключения")
                })
              }
            }
          >
            Войти
          </Button>
          <hr />
          <p>
            <a href={"/signUp"}>Нет аккаунта? Зарегистрируйтесь</a>
          </p>
        </form>
      </div>
      {redirect.redirect !== '' &&
        <Redirect to={redirect.redirect}/>
      }
    </div>)}
    </UserContext.Consumer>
  );
};

export default LoginForm;
