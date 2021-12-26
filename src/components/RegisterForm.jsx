import React, {useState} from 'react';
import Button from "../UI/button/Button";
import classes from "../styles/RegisterForm.module.css";
import validator from 'validator';
import {DOMEN_SERVER} from '../config/const';

const RegisterForm = () => {
    const axios = require('axios');

    const [register, setRegister] = useState(() => {
        return {
            username: "",
            email: "",
            password: "",
            password2: "",
        }
    })

    const [error, setError] = useState(() => {
        return {
            errorValue: ""
        }
    })

    const changeInputRegister = event => {
        event.persist()
        let hidden = document.getElementById("hidden");
        hidden.hidden = true
        setRegister(prev => {
            return {
                ...prev,
                [event.target.id]: event.target.value,
            }
        })
    }

    const showError = (text) => {
        setError(() => {
            return {
                errorValue: text
            }
        })
        document.getElementById("hidden").hidden = false
    }

    const submitChecking = event => {
        event.preventDefault();
        let hidden = document.getElementById("hidden");
        hidden.hidden = true
        if(!validator.isEmail(register.email)) {
            showError("Email is empty or invalid")
        } else if(register.password !== register.password2) {
            showError("Repeated password incorrectly")
        } else if(!validator.isStrongPassword(register.password, {minLength: 8, minLowercase: 1, minUppercase: 1,
            minNumbers: 1, minSymbols: 0})) {
            showError("Password must consist of one lowercase, uppercase letter and number, at least 8 characters")
        } else {
            axios.post(DOMEN_SERVER + "/api/web/reg", {
                email: register.email,
                login: register.username,
                password: register.password,
            }).then(res => {
                if (res.status === 200) {
                    showError("Регистрация прошла успешно. Мы отправили ссылку подтверждения на ваш электронный адрес")
                }
            }).catch(error => {
                if (error.response) {
                    switch (error.response.data.errorCode) {
                        case 1:
                            showError("This email address is already occupied")
                            break;
                        case 2:
                            showError("This login is already occupied")
                            break;
                        case 3:
                            showError("Invalid email")
                            break;
                        default:
                            showError("Oops, smth went wrong")
                            break;
                    }
                } else {
                    console.log(error.message)
                }
            })
        }
    }

    return (
        <div className={classes.mainDiv}>
            <div className={classes.registerFormDiv}>
                <form className={classes.registerForm} onSubmit={submitChecking}>
                    <h2> Регистрация </h2>
                    <input type="text" id="username" placeholder="Имя пользователя" value={register.username}
                           onChange={changeInputRegister}/>
                    <input type="email" id="email" placeholder="Электронная почта" value={register.email}
                           onChange={changeInputRegister}/>
                    <input type="password" id="password" placeholder="Пароль" value={register.password}
                           onChange={changeInputRegister}/>
                    <input type="password" id="password2" placeholder="Подтверждение" value={register.password2}
                           onChange={changeInputRegister}/>
                    <div hidden className="text-danger" id="hidden">
                        {error.errorValue}
                    </div>
                    <Button type={"submit"}>Зарегистрироваться</Button>
                    <p>
                        Нажимая Войти, вы соглашаетесь с <a href={"/"}>Политикой конфиденциальности</a> и <a href={"/"}>Лицензионным соглашением</a>
                    </p>
                    <hr/>
                    <p>
                        <a href={"/"}>У меня уже есть аккаунт</a>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default RegisterForm;