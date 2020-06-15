import React, { useState } from 'react'
import { Input, Button } from 'reactstrap'
import DataManager from '../modules/DataManager'


const Login = (props) => {

  const [user, setUser] = useState({username: "", password: ""})

  function handleChange(evt) {
    let stateToChange = {...user};
    stateToChange[evt.target.id] = evt.target.value;
    setUser(stateToChange)
  }

  function handleSubmit() {
    DataManager.getAll(`users?username=${user.username}`)
    .then(credentials => {
      if (credentials.length === 0) {
        alert("User not found")
      } else {
        if(credentials[0].password === user.password) {
          props.doLogin(credentials[0].id)
        } else {
          alert("Incorrect password")
        }
      }
    })
  }

  function handleRegister() {
    props.history.push("/register")
  }

  return (
    <>
    <div className="placeholder"></div>
      <div id="LoginDiv">
        <Input onChange={handleChange} className="loginInput" id="username" type="text" placeholder="Username"></Input>
        <Input onChange={handleChange} className="loginInput" id="password" type="password" placeholder="Password"></Input>
        <div id="LoginButtons">
          <Button onClick={handleSubmit} className="LoginButton" id="LoginButton">Submit</Button>
          <Button onClick={handleRegister}className="LoginButton" id="RegisterButton">Register</Button>
        </div>
      </div>
    <div className="placeholder"></div>
    </>
  )
}

export default Login