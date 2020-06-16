import React, { useState, useEffect } from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Label } from 'reactstrap';
import DataManager from '../modules/DataManager'
import SniffModal from '../sniffs/SniffModal'
import SniffList from '../sniffs/SniffList';


const Profile = (props) => {
  const [user, setUser] = useState({id: "", username: "", password: "", bio: "", displayName: "", followers: 0, following: 0})
  const [userEdit, setUserEdit] = useState({bio: "", displayName: ""})
  
  const {
    buttonLabel = "Edit Profile",
    className = "red"
  } = props;

  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);

  const edit = (evt) => {
    let stateToChange = {...userEdit}
    stateToChange[evt.target.id] = evt.target.value
    setUserEdit(stateToChange)
  }

  const saveEdit = () => {
    let stateToChange = {...user};
    stateToChange.displayName = userEdit.displayName;
    stateToChange.bio = userEdit.bio;
    setUser(stateToChange)
    DataManager.put("users", props.userId, stateToChange)
    toggle();
  }

  const showFollowers = () => {
    props.history.push(`/followers/${props.userId}`)
  }

  const showFollowing = () => {
    props.history.push(`/following/${props.userId}`)
  }


  useEffect(() => {
    let stateToChange
    DataManager.getOne("users", `${props.userId}`)
    .then(userData => {
      stateToChange = {...userData}
    })
    .then(() => {
      DataManager.getAll(`follows?userId=${props.userId}`)
      .then(users => {
        stateToChange.followers = users.length;
      }).then(() => {
        DataManager.getAll(`follows?userFollowingId=${props.userId}`)
        .then(users => {
          stateToChange.following = users.length;
          setUser(stateToChange)
          setUserEdit({bio: stateToChange.bio, displayName: stateToChange.displayName})
        })
      })
    })
  }, [props.userId])

  return (
    <div id="profile">

      <div>
        <h3>{user.displayName}</h3>
        {props.userId === parseInt(sessionStorage.getItem("userId")) ? <Button color="primary" onClick={toggle}>{buttonLabel}</Button> : null}
        {props.userId === parseInt(sessionStorage.getItem("userId")) ? <SniffModal /> : null}
      </div>

      <div>
        @{user.username}
      </div>

      <div>
        {user.bio}
      </div>

      <div>
        Followers: <Button onClick={showFollowers} color="link">{user.followers}</Button>
        Following: <Button onClick={showFollowing} color="link">{user.following}</Button>
      </div>

      <div>
        <SniffList calledFrom="profile" userId={props.userId} {...props} />
      </div>

      <div>
        <Modal isOpen={modal} toggle={toggle} className={className}>
          <ModalHeader toggle={toggle}>
            Edit Profile
          </ModalHeader>
          <ModalBody>
            <Label for="displayName">Display Name</Label>
            <Input onChange={edit} placeholder="Display Name" id="displayName" defaultValue={user.displayName}></Input>
            <Label for="bio">Bio</Label>
            <Input onChange={edit} type="textarea" placeholder="Bio" id="bio" defaultValue={user.bio}></Input>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={saveEdit}>Save</Button>{' '}
            <Button color="secondary" onClick={toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>

    </div>
  )
}

export default Profile