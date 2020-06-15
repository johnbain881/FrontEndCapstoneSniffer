import React, { useState, useEffect } from 'react'
import UserCard from './UserCard'
import DataManager from '../modules/DataManager'


const UserList = (props) => {
  const [userArray, setUserArray] = useState([])

  useEffect(() => {
    let stateToChange = [];
    switch(props.calledFrom) {
      case "followers":
        DataManager.getAll(`follows?userId=${props.userId}`)
        .then(followers => {
          stateToChange = followers.map(follower => follower.userFollowingId)
          setUserArray(stateToChange)
        })
        break;
      case "following":
        DataManager.getAll(`follows?userFollowingId=${props.userId}`)
        .then(following => {
          stateToChange = following.map(follower => follower.userId)
          setUserArray(stateToChange)
        })
        break;
      case "likes":
        break;
      case "search":
        if (props.search !== "") {
          DataManager.getAll(`users?username_like=${props.search}`)
          .then(users => {
            stateToChange = users.map(user => user.id)
            setUserArray(stateToChange)
          })
        }
        break;
      default:
        break;
    }
  }, [props.search, props.calledFrom, props.userId])
  return (
    <div id={props.calledFrom !== "search" ? "userList" : ""}>
      {props.calledFrom !== "search" ? <h1 id="userListH1">{props.calledFrom}</h1> : null}
      {userArray.map(user => <UserCard key={user} userId={user} />)}
    </div>
  )
}

export default UserList