import React, { Component } from "react";
import { HashRouter } from "react-router-dom";

import { UserContext, user } from "./contexts/UserContext";

import HeaderBlock from "./HeaderBlock";
import ContentBlock from "./ContentBlock";

import "./App.css";

export default class App extends Component {
  constructor(props) {
    super(props);

    this.changeAccessToken = (val) => {
      this.setState({
        accessToken: val,
      });
    };

    this.changeAccessTokenIntervalId = (val) => {
      this.setState({
        accessTokenIntervalId: val,
      });
    };

    this.changeRefreshToken = (val) => {
      this.setState({
        refreshToken: val,
      });
    };

    this.changeLogin = (val) => {
      this.setState({
        login: val,
      });
    };

    this.changeEmail = (val) => {
      this.setState({
        email: val,
      });
    };

    this.changeIsAuthorized = (val) => {
      this.setState({
        isAuthorized: val,
      });
    };

    this.logOut = () => {
      this.changeAccessToken(undefined);
      this.changeRefreshToken(undefined);
      this.changeLogin(undefined);
      this.changeEmail(undefined);

      this.changeIsAuthorized(false);
      clearInterval(this.state.accessTokenIntervalId);
      this.changeAccessTokenIntervalId(undefined);

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("login");
      localStorage.removeItem("email");
      localStorage.removeItem("isAuthorized");
    };

    // --------------for the future----------------------------------
    // this.updateAccessToken = () => {
    //
    //   let data = {
    //     refresh: this.state.refreshToken
    //   }
    //   let dataJSON = JSON.stringify(data)
    //
    //   fetch('http://localhost:8000/api/token/refresh/', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: dataJSON
    //   })
    //   .then(req => req.json())
    //   .then(data => {
    //     if('detail' in data){
    //       console.log(data['detail'])
    //       this.logOut()
    //     } else {
    //       if('access' in data) this.changeAccessToken(data['access'])
    //       else console.log('Unexpected error')
    //     }
    //   })
    //   .catch(this.handleError)
    // }

    this.logIn = (accessToken, refreshToken, login, email) => {
      this.changeAccessToken(accessToken);
      this.changeRefreshToken(refreshToken);

      this.changeLogin(login);
      this.changeEmail(email);

      this.changeIsAuthorized(true);
      // this.changeAccessTokenIntervalId(setInterval(this.updateAccessToken, (23*60 + 55) * 60 * 1000)) // every 23 hours 55 minutes
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("login", login);
      localStorage.setItem("email", email);
      localStorage.setItem("isAuthorized", true);
    };

    this.state = {
      accessToken: user.accessToken,
      accessTokenIntervalId: undefined,
      refreshToken: user.refreshToken,
      login: user.login,
      email: user.email,
      isAuthorized: user.isAuthorized,

      changeAccessToken: this.changeAccessToken,
      changeAccessTokenIntervalId: this.changeAccessTokenIntervalId,
      changeRefreshToken: this.changeRefreshToken,
      changeLogin: this.changeLogin,
      changeEmail: this.changeEmail,
      changeIsAuthorized: this.changeIsAuthorized,
      logOut: this.logOut,
      logIn: this.logIn,
    };
  }

  componentDidMount(){
    if(localStorage.getItem("isAuthorized")){
      this.logIn(localStorage.getItem("accessToken"), localStorage.getItem("refreshToken"), localStorage.getItem("login"), localStorage.getItem("email"))
    }
  }

  render() {
    return (
      <UserContext.Provider value={this.state}>
        <HashRouter>
          <div className="App">
            <HeaderBlock />
            <ContentBlock />
          </div>
        </HashRouter>
      </UserContext.Provider>
    );
  }
}
