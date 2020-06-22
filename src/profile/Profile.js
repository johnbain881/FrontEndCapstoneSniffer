import React, { useState, useEffect } from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Label } from 'reactstrap';
import DataManager from '../modules/DataManager'
import SniffModal from '../sniffs/SniffModal'
import SniffList from '../sniffs/SniffList';


const Profile = (props) => {
  const [user, setUser] = useState({id: "", username: "", password: "", bio: "", displayName: "", followers: 0, following: 0, profilePicUrl: ""})
  const [userEdit, setUserEdit] = useState({bio: "", displayName: ""})
  const [following, setFollowing] = useState(false)
  const [followId, setFollowId] = useState(0)


  var widget = window.cloudinary.createUploadWidget({
    cloudName: "johnbain", uploadPreset: "unsigneduploadpreset"
  }, (error, result) => {getResults(result)});

  function getResults(result) {
    if (result.event === "success") {
      let stateToChange = {...user}
      stateToChange.profilePicUrl = result.info.secure_url
      DataManager.put("users", user.id, stateToChange)
      setUser(stateToChange)
    }
  }

  const changeFollowStatus = (evt) => {
    let stateToChange = following
    stateToChange = !stateToChange
    setFollowing(stateToChange)
    if (!stateToChange) {
      DataManager.delete("follows", followId)
    } else {
      DataManager.post("follows", {userId: props.userId, userFollowingId: parseInt(sessionStorage.getItem("userId"))})
      .then(() => {
        DataManager.getAll(`follows?userId=${props.userId}&userFollowingId=${parseInt(sessionStorage.getItem("userId"))}`)
        .then(users => {
          setFollowId(users[0].id)
        })
      })
    }
  }
  
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
    DataManager.getAll(`follows?userId=${props.userId}&userFollowingId=${parseInt(sessionStorage.getItem("userId"))}`)
    .then(follows => {
      if (follows.length !== 0) {
        setFollowing(true)
        setFollowId(follows[0].id)
      }
    })
  }, [props.userId])

  return (
    <div id="profile">
      <div id="header">
        <div>
          <div id="picAndNames">
            <img src={user.profilePicUrl} alt="" width={150} height={150} />
            <div id="usernameAndDisplayname">
              <h3>{user.displayName}</h3>
              <div>
                @{user.username}
              </div>
            </div>
          </div>
          <div id="followsAndButtons">
            <div id="profileFollows">
              <div>
                Followers: <Button onClick={showFollowers} color="link">{user.followers}</Button>
              </div>
              <div>
                Following: <Button onClick={showFollowing} color="link">{user.following}</Button>
              </div>
            </div>
            <div id="profileButtons">
              {props.userId === parseInt(sessionStorage.getItem("userId")) ? <Button color="primary" onClick={toggle}>{buttonLabel}</Button> : null}
              {props.userId === parseInt(sessionStorage.getItem("userId")) ? <SniffModal /> : null}
              {props.userId === parseInt(sessionStorage.getItem("userId")) ? <Button color="primary" onClick={() => widget.open()}>Add a photo</Button> : null}
              {props.userId === parseInt(sessionStorage.getItem("userId")) ? null : <Button color="primary" onClick={changeFollowStatus} active={following}>{following ? "Following" : "Follow"}</Button>}
            </div>
          </div>
        </div>

        <div id="bioAndFollows">
          <div id="bio">
            {user.bio}
          </div>

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

      <div id="content">
        <SniffList calledFrom="profile" userId={props.userId} {...props} />
      </div>


    </div>
  )
}

export default Profile