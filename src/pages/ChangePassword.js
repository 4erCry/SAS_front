import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import classes from "../styles/LoginForm.module.css";

import Button from "../UI/button/Button";

export default class ChangePassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      password1: '',
      password2: '',
      error: '',
      requestError: '',
      showText: false,
      redirect: ''
    };

    this.setPassword1 = this.setPassword1.bind(this);
    this.setPassword2 = this.setPassword2.bind(this);
    this.setError = this.setError.bind(this);
    this.setRequestError = this.setRequestError.bind(this);
    this.setShowText = this.setShowText.bind(this);
    this.setRedirect = this.setRedirect.bind(this);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.sendPass = this.sendPass.bind(this);
  }

  setPassword1(val){
    this.setState({
      password1: val
    })
  }

  setPassword2(val){
    this.setState({
      password2: val
    })
  }

  setError(val){
    this.setState({
      error: val
    })
  }

  setRequestError(val){
    this.setState({
      requestError: val
    })
  }

  setShowText(val){
    this.setState({
      showText: val
    })
  }

  setRedirect(val){
    this.setState({
      redirect: val
    })
  }



  handleSubmit(event) {
    event.preventDefault();

    if (this.validate()) this.sendPass()
  }

  validate() {
    const { password1, password2 } = this.state

    console.log(password1, password2)
    if(password1 === password2) return true
    else {
      this.setError('Введены разные пароли')
      return false
    }
  }

  sendPass(){
    fetch("http://3.142.115.21/api/web/mail/resetPass ", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        string: this.props.match.params.genStr,
        password: this.state.password1,
      }),
    }).then((response) => {
      if (response.status === 200) {
        this.setShowText(true)
        setTimeout(this.setRedirect, 5000, '/signIn')
      } else {
        response.json()
        .then(data => {
          this.setRequestError(data['errorText'])
        })
      }
    })
  }


  render() {
    if(this.state.showText) return (
      <main>
        <div className='only-text'>
          Пароль успешно изменен!
        </div>

        {this.state.redirect !== '' &&
          <Redirect to={this.state.redirect}/>
        }
      </main>
    )

    return (
      <div>


        <form onSubmit={this.handleSubmit} className={classes.loginForm}>
          <h3>Изменить пароль</h3>
          <input
            type="password"
            onChange={e => this.setPassword1(e.currentTarget.value)}
            placeholder="Введите новый пароль"
            required={true}
          />


          <input
            type="password"
            onChange={e => this.setPassword2(e.currentTarget.value)}
            placeholder="Подтвердите новый пароль"
            required={true}
          />

          <div className="text-danger">{this.state.error}</div>
          <div className="text-danger">{this.state.requestError}</div>

          <Button type={"submit"}>Отправить</Button>
        </form>
      </div>
    );
  }
}
