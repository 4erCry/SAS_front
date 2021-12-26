import React, { Component } from 'react'

import { UserContext } from '../contexts/UserContext'

import '../styles/AccountPage.css'

export default class AccountPage extends Component {

  constructor(props){
    super(props)

    this.state = {
      token: '',
      tokenError: '',
      passError: '',
      message: ''
    }

    this.setToken = this.setToken.bind(this)
    this.setTokenError = this.setTokenError.bind(this)
    this.setPassError = this.setPassError.bind(this)
    this.setMessage = this.setMessage.bind(this)

    this.genToken = this.genToken.bind(this)
    this.resetPass = this.resetPass.bind(this)
  }

  setToken(val){
    this.setState({
      token: val
    })
  }

  setTokenError(val){
    this.setState({
      tokenError: val
    })
  }

  setPassError(val){
    this.setState({
      passError: val
    })
  }

  setMessage(val){
    this.setState({
      message: val
    })
  }


  genToken(){
    const { accessToken } = this.context

    fetch('http://3.142.115.21/api/data/genToken', {
      method: 'GET',
      headers: {
        'Authorization': accessToken
      }
    })
    .then(req => req.json())
    .then(data => {
        if('errorCode' in data){
          this.setToken('')
          this.setTokenError(data['errorText'])
        } else {
          this.setToken(data['sensorToken'])
          this.setTokenError('')
        }
      }
    )
    .catch(() => {
      this.setTokenError('Проблема с подключением')
    })
  }


  resetPass(){
    const { accessToken, email } = this.context

    fetch('http://3.142.115.21/api/web/resetPass', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': accessToken,
      },
      body: JSON.stringify({'email': email})
    })
    .then(() => {
      this.setMessage('На указанную вами почту отправлено письмо для изменения пароля')
    })
    .catch(() => {
      this.setPassError('Проблема с подключением')
    })
  }


  render() {
    const { token, tokenError, passError, message } = this.state
    const { login } = this.context

    let output
    if(message !== ''){
      output = (
        <div className='only-text'>
          {message}
        </div>
      )
    } else {
      output = (
        <main>
          <div className='account-form'>
            <h1 className='account-form-login'>{login}</h1>
            {/*<h1 className='account-form-login'>Sadovod</h1>*/}

            <form className='gen-token-form'>
              <h3>Генерация постоянного токена</h3>

              <div className='warning-text'>
                <b>Внимание!</b><br></br>
                Токен будет показан единожды, его необходимо сохранить. В случае повторной генерации устройства со старым токеном не будут иметь доступ к API.
              </div>

              <input type="text" placeholder='Токен' value={token}/>

              <div className='error-text'>{tokenError}</div>

              <div className='account-form-butt' onClick={this.genToken}>Получить</div>
            </form>

            <form className='change-pass-form'>
              <h3>Смена пароля</h3>

              <div className='warning-text'>
                Ссылка для изменения пароля будет отправлена вам на почту.
              </div>

              <div className='error-text'>{passError}</div>

              <div className='account-form-butt' onClick={this.resetPass}>Сменить пароль</div>
            </form>
          </div>
        </main>
      )
    }

    return output
  }
}

AccountPage.contextType = UserContext
