import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import { UserContext } from '../contexts/UserContext'
import '../styles/MainPage.css'

export default class MainPage extends Component {

  render() {
    const { isAuthorized } = this.context

    return (
      <main>
        <div className='main-blocks'>
          <div className='main-block'>
            <div className='main-img'></div>
            <div className='main-text'>Добавляй датчики</div>
          </div>

          <div className='main-block'>
            <div className='main-text'>Отправляй данные</div>
            <div className='main-img'></div>
          </div>

          <div className='main-block'>
            <div className='main-img'></div>
            <div className='main-text'>Визуализируй</div>
          </div>

          {!isAuthorized &&
            <Link className='main-reg-butt' to='/signUp'>Зарегистрироваться</Link>
          }
        </div>
      </main>
    )
  }
}

MainPage.contextType = UserContext
