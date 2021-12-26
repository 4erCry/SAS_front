import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {DOMEN_SERVER} from "../config/const";
import classes from "../styles/EmailConfirmation.module.css";

const EmailConfirmation = () => {
    const axios = require('axios');

    const [confirmationText, setConfirmationText] = useState("Выполняется поддтверждение вашего акканута...")

    const {generated} = useParams();

    useEffect(() => {
        axios.post(DOMEN_SERVER + "/api/web/mail/reg", {
            string: generated,
        }).then(res => {
            if (res.status === 200) {
                setConfirmationText("Аккаунт подтверждён")
            }
            window.location.replace(DOMEN_SERVER + "/signIn");
        }).catch(error => {
            console.log(error.message)
        })
    }, [])

    return (
        <div className={classes.mainDiv}>
            <h1>{confirmationText}</h1>
        </div>
    )
}

export default EmailConfirmation;