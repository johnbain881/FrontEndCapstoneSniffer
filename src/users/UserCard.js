import React, { useState, useEffect } from 'react'
import { Button, CardLink} from 'reactstrap'
import DataManager from '../modules/DataManager'


const UserCard = (props) => {
  const [user, setUser] = useState({displayName: "", username: "", isFollowing: false, id: props.userId})
  const [followId, setFollowId] = useState(0)

  useEffect(() => {
    DataManager.getOne("users", props.userId)
    .then(thisUser => {
      DataManager.getAll(`follows?userId=${props.userId}&userFollowingId=${sessionStorage.getItem("userId")}`)
      .then(users => {
        if (users.length !== 0) {
          setFollowId(users[0].id)
        }
        setUser({displayName: thisUser.displayName, username: thisUser.username, id: thisUser.id, isFollowing: users.length !== 0})
      })
    })
  }, [props.userId])

  const changeFollowStatus = (evt) => {
    const stateToChange = {...user}
    stateToChange.isFollowing = !stateToChange.isFollowing
    setUser(stateToChange)
    if (!stateToChange.isFollowing) {
      DataManager.delete("follows", followId)
    } else {
      DataManager.post("follows", {userId: props.userId, userFollowingId: parseInt(sessionStorage.getItem("userId"))})
      .then(() => {
        DataManager.getAll(`follows?userId=${props.userId}&userFollowingId=${sessionStorage.getItem("userId")}`)
        .then(users => {
          setFollowId(users[0].id)
        })
      })
    }
  }

  return (
    <div>
      <div className="userCard">
        <div>
          <h4>{user.displayName}</h4>
          <CardLink href={`/profile/${props.userId}`}>@{user.username}</CardLink>
        </div>
        <div>
          {props.userId === parseInt(sessionStorage.getItem("userId")) ? null : <Button color="primary" onClick={changeFollowStatus} active={user.isFollowing}>{user.isFollowing ? "Following" : "Follow"}</Button>}
        </div>
      </div>
      <hr/>
    </div>
  )
}

export default UserCard
