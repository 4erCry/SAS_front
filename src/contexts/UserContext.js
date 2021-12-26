import React from "react"

export const user = {
  accessToken: undefined,
  refreshToken: undefined,
  login: undefined,
  email: undefined,
  isAuthorized: false
}

export const UserContext = React.createContext({
  accessToken: user.accessToken,
  refreshToken: user.refreshToken,
  login: user.login,
  email: user.email,
  isAuthorized: user.isAuthorized,

  changeAccessToken: () => {},
  changeRefreshToken: () => {},
  changeLogin: () => {},
  changeEmail: () => {},
  changeIsAuthorized: () => {},
});
