import React, { useState } from 'react'
import { Input, Button } from 'reactstrap'
import DataManager from '../modules/DataManager'


const Login = (props) => {

  const [user, setUser] = useState({username: "", password1: "", password2: ""})
  const [taken, setTaken] = useState(false)
  const [same, setSame] = useState(false)

  function handleUsernameChange(evt) {
    let stateToChange = {...user}
    stateToChange.username = evt.target.value
    setUser(stateToChange)
    DataManager.getAll(`users?username=${stateToChange.username}`)
    .then(users => {
      if (users.length !== 0) {
        setTaken(true)
      } else {
        setTaken(false)
      }
    })
  }

  function handlePasswordChange(evt) {
    let stateToChange = {...user}
    stateToChange[evt.target.id] = evt.target.value;
    setUser(stateToChange)
    setSame(stateToChange.password1 !== stateToChange.password2 ? true : false)
  }

  function handleSubmit() {
    if (user.username !== "" || user.password1 !== "" || user.password2 !== "") {
      if (!taken && !same) {
        DataManager.post("users", {username: user.username, password: user.password1, bio: "", displayName: user.username})
        .then(() => {
          DataManager.getAll("users")
          .then(users => props.doLogin(users[users.length-1].id))
        })
      }
    }
  }

  return (
    <>
    <div className="placeholder"></div>
      <div id="LoginDiv">
        <Input onChange={handleUsernameChange} className={taken ? "loginInput red" : "loginInput"} id="username" type="text" placeholder="Username"></Input>
        <Input onChange={handlePasswordChange} className={same ? "loginInput red" : "loginInput"} id="password1" type="password" placeholder="Password"></Input>
        <Input onChange={handlePasswordChange} className={same ? "loginInput red" : "loginInput"} id="password2" type="password" placeholder="Password"></Input>
        <div id="LoginButtons">
          <Button onClick={handleSubmit} className="LoginButton" id="LoginButton">Submit</Button>
        </div>
      </div>
    <div className="placeholder"></div>
    </>
  )
}

export default Login