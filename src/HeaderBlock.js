import React, { Component } from "react"
import { Link } from "react-router-dom"

import { UserContext } from './contexts/UserContext'

import './HeaderBlock.css'


export default class HeaderBlock extends Component {

  render() {
    const { isAuthorized, login } = this.context

    return (
      <header className={'header'}>
        <div className={'header-logo'}>
          <Link to={'/'}><img src="logo.svg" alt="SAS"/></Link>
        </div>

        <div className={'header-main-refs'}>
          <Link to={'/'}>Главная</Link>
          <Link to={'/documentation'}>Документация</Link>
          <Link to={'/sensors'}>Датчики</Link>
        </div>


        {!isAuthorized &&
          <div className={'header-sign-refs'}>
            <Link to={'/signUp'}>Зарегистрироваться</Link>
            <Link to={'/signIn'}>Войти</Link>
          </div>
        }

        {isAuthorized &&
          <div className={'header-sign-refs'}>
            <Link to={'/account'}>{login}</Link>
            <Link to={'/signOut'}>Выйти</Link>
          </div>
        }
      </header>
    )
  }
}

HeaderBlock.contextType = UserContext
