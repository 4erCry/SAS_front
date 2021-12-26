import React, { Component } from "react"
import { Redirect } from "react-router-dom"

import { UserContext } from '../contexts/UserContext'

export default class SignOutPage extends Component {

  componentDidMount(){
    this.context.logOut()
  }

  render(){
    return <Redirect to={'/'}/>
  }
}

SignOutPage.contextType = UserContext
