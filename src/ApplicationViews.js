import React, { useState } from 'react'
import { Route, Redirect } from 'react-router-dom';
import Login from './login/Login'
import Register from './login/Register'
import Profile from './profile/Profile'
import UserList from './users/UserList'
import SniffList from './sniffs/SniffList'
import SideNav from './nav/SideNav'
import SearchBar from './search/SearchBar';

const ApplicationViews = (props) => {

  const [isLoggedIn, setIsLoggedIn] = useState(sessionStorage.getItem("userId")? true : false)


  const doLogin = (userId) => {
    sessionStorage.setItem("userId", userId)
    setIsLoggedIn(true)
  }
  const doLogout = () => {
    sessionStorage.clear()
    setIsLoggedIn(false)
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
                <SideNav doLogout={doLogout} />
                <Profile userId={parseInt(props.match.params.userId)} {...props} />
                <SearchBar />
              </>
            )
          } else {
            return <Redirect to="/"/>
          }
        }}
      />
      <Route
        exact
        path="/followers/:userId(\d+)"
        render={props => {
          if (isLoggedIn) {
            return (
              <>
                <SideNav doLogout={doLogout} />
                <UserList calledFrom="followers" userId={parseInt(props.match.params.userId)} {...props} />
                <SearchBar />
              </>
            )
          } else {
            return <Redirect to="/"/>
          }
        }}
      />
      <Route
        exact
        path="/following/:userId(\d+)"
        render={props => {
          if (isLoggedIn) {
            return (
              <>
                <SideNav doLogout={doLogout} />
                <UserList calledFrom="following" userId={parseInt(props.match.params.userId)} {...props} />
                <SearchBar />
              </>
            )
          } else {
            return <Redirect to="/"/>
          }
        }}
      />
      <Route
        exact
        path="/likes/:sniffId(\d+)"
        render={props => {
          if (isLoggedIn) {
            return (
              <>
                <SideNav doLogout={doLogout} />
                <UserList calledFrom="likes" sniffId={parseInt(props.match.params.sniffId)} {...props} />
                <SearchBar />
              </>
            )
          } else {
            return <Redirect to="/"/>
          }
        }}
      />
      <Route
        exact
        path="/resniffs/:sniffId(\d+)"
        render={props => {
          if (isLoggedIn) {
            return (
              <>
                <SideNav doLogout={doLogout} />
                <UserList calledFrom="resniffs" sniffId={parseInt(props.match.params.sniffId)} {...props} />
                <SearchBar />
              </>
            )
          } else {
            return <Redirect to="/"/>
          }
        }}
      />
      <Route
        exact
        path="/feed"
        render={props => {
          if (isLoggedIn) {
            return (
              <>
                <SideNav doLogout={doLogout} />
                <SniffList calledFrom="feed" {...props}/>
                <SearchBar />
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