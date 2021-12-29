import React, { Component } from "react"
import { Link } from "react-router-dom"

import { UserContext } from './contexts/UserContext'

import './HeaderBlock.css'
import logo from "./UI/logo.svg";

export default class HeaderBlock extends Component {

  render() {
    const { isAuthorized, login } = this.context

    return (
      <header className={'header'}>
        <div className={'header-logo'}>
          <Link to={'/'}><img src={logo} width={60} height={60}/></Link>
        </div >

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

        <div className="burger-menu">
            <input id="menu_toggle" type="checkbox"/>
            <label className="menu_btn" htmlFor="menu_toggle">
                <span></span>
            </label>
            <ul className="menu_box">
                <li><Link to={'/'}><a className="menu_item">Главная</a></Link></li>
                <li><Link to={'/documentation'}><a className="menu_item">Документация</a></Link></li>
                <li><Link to={'/sensors'}><a className="menu_item">Датчики</a></Link></li>
                {!isAuthorized &&
                <div className={'header-sign-refs-menu'}>
                    <li><Link to={'/signUp'}><a className="menu_item">Зарегистрироваться</a></Link></li>
                    <li><Link to={'/signIn'}><a className="menu_item">Войти</a></Link></li>
                </div>
                }
                {isAuthorized &&
                <div className={'header-sign-refs-menu'}>
                    <li><Link to={'/account'}><a className="menu_item">{login}</a></Link></li>
                    <li><Link to={'/signOut'}><a className="menu_item">Выйти</a></Link></li>
                </div>
                }
            </ul>
        </div>
      </header>
    )
  }
}

HeaderBlock.contextType = UserContext
