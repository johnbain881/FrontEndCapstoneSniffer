import React, { useState } from 'react'
import { Route, Redirect } from 'react-router-dom';
import Login from './login/Login'
import Register from './login/Register'
import Profile from './profile/Profile'
// import SniffList from './sniffs/SniffList'
// import SideNav from './nav/SideNav'
// import SearchBar from './search/SearchBar';

const ApplicationViews = (props) => {

  const [isLoggedIn, setIsLoggedIn] = useState(sessionStorage.getItem("userId")? true : false)


  const doLogin = (userId) => {
    sessionStorage.setItem("userId", userId)
    setIsLoggedIn(true)
  }

  return (
    <>
      <Route
        exact
        path="/"
        render={props => {
          if (isLoggedIn) {
            return <Redirect to="/feed"/>
          } else {
            return <Login {...props} doLogin={doLogin}/>
          }
        }}
      />
      <Route
        exact
        path="/register"
        render={props => {
          if (isLoggedIn) {
            return <Redirect to="/feed"/>
          } else {
            return <Register {...props} doLogin={doLogin}/>
          }
        }}
      />
      <Route
        exact
        path="/profile/:userId(\d+)"
        render={props => {
          if (isLoggedIn) {
            return (
              <>
                <div className="placeholder"></div>
                <Profile userId={parseInt(props.match.params.userId)} {...props} />
                <div className="placeholder"></div>
              </>
            )
          } else {
            return <Redirect to="/"/>
          }
        }}
      />
    </>
  )

}

export default ApplicationViews