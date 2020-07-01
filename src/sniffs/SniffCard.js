import React, { useState, useEffect } from 'react'
import { Card, CardTitle, CardText, Button } from 'reactstrap'
import { Link } from 'react-router-dom'
import DataManager from '../modules/DataManager'


const SniffCard = (props) => {

  const [sniff, setSniff] = useState({id: props.sniffId, body: "", timestamp: 0, userId: 0, user: {displayName: "", username: "", profilePicUrl: ""}})
  const [liked, setLiked] = useState({status: false, likeId: 0})
  const [resniffed, setResniffed] = useState({status: false, resniffId: 0})
  const [numLikes, setNumLikes] = useState(0)
  const [numResniffs, setNumResniffs] = useState(0)
  const [whoResniffed, setWhoResniffed] = useState({username: "", displayName: "", userId: 0})

  useEffect(() => {
    DataManager.getOne("sniffs", `${props.sniffId}?_expand=user`)
    .then(sniffFromDB => setSniff(sniffFromDB))
    DataManager.getAll(`likes?sniffId=${props.sniffId}&userId=${sessionStorage.getItem("userId")}`)
    .then(like => {
      if (like.length !== 0)
      setLiked({status: true, likeId: like[0].id})
    })
    DataManager.getOne("sniffs", `${props.sniffId}?_embed=likes`)
    .then(likes => {
      setNumLikes(likes.likes.length)
    })
    DataManager.getAll(`resniffs?sniffId=${props.sniffId}&userId=${sessionStorage.getItem("userId")}`)
    .then(resniff => {
      if (resniff.length !== 0)
      setResniffed({status: true, resniffId: resniff[0].id})
    })
    DataManager.getOne("sniffs", `${props.sniffId}?_embed=resniffs`)
    .then(resniffs => {
      setNumResniffs(resniffs.resniffs.length)
    })
    if (props.resniff) {
      DataManager.getOne("users", props.resniff)
      .then(user => {
        setWhoResniffed({username: user.username, displayName: user.displayName, userId: props.resniff})
      })
    }
  }, [props.sniffId, props.resniff])

  function timeSince() {
    const elapsedTime = Math.floor((Date.now() - sniff.timestamp)/1000);
    switch(true) {
      case (elapsedTime < 3600):
        return `${Math.floor(elapsedTime/60)} min`
      case (elapsedTime < 86400):
        return `${Math.floor((elapsedTime/60)/60)} hr`
      case (elapsedTime < 31622400):
        return `${Math.floor(((elapsedTime/60)/60)/24)} day`
      case (elapsedTime >= 31622400):
        return `${Math.floor((((elapsedTime/60)/60)/24)/365)} yr`
      default:
        break;
    }
  }

  const changeLikeStatus = () => {
    const stateToChange = {...liked}
    stateToChange.status = !stateToChange.status
    if (!stateToChange.status) {
      DataManager.delete("likes", liked.likeId)
      stateToChange.likeId = 0;
      setLiked(stateToChange)
      setNumLikes(numLikes - 1)
    } else {
      DataManager.post("likes", {sniffId: sniff.id, userId: parseInt(sessionStorage.getItem("userId"))})
      .then(() => {
        DataManager.getAll(`likes?userId=${parseInt(sessionStorage.getItem("userId"))}&sniffId=${sniff.id}`)
        .then(like => {
          stateToChange.likeId = like[0].id
          setLiked(stateToChange)
          setNumLikes(numLikes + 1)
        })
      })
    }
  }

  const changeResniffStatus = () => {
    const stateToChange = {...resniffed}
    stateToChange.status = !stateToChange.status
    if (!stateToChange.status) {
      DataManager.delete("resniffs", resniffed.resniffId)
      stateToChange.resniffId = 0;
      setResniffed(stateToChange)
      setNumResniffs(numResniffs - 1)
    } else {
      DataManager.post("resniffs", {sniffId: sniff.id, userId: parseInt(sessionStorage.getItem("userId")), timestamp: Date.now()})
      .then(() => {
        DataManager.getAll(`resniffs?userId=${parseInt(sessionStorage.getItem("userId"))}&sniffId=${sniff.id}`)
        .then(resniff => {
          stateToChange.resniffId = resniff[0].id
          setResniffed(stateToChange)
          setNumResniffs(numResniffs + 1)
        })
      })
    }
  }

  const handleDelete = (sniffId) => {
    DataManager.delete("sniffs", sniffId)
    window.location.reload()
  }

  return (
    <Card body>
      <CardTitle>
        {props.resniff ? <Link to={`/profile/${whoResniffed.userId}`}>Resniffed by {whoResniffed.displayName} @ {whoResniffed.username}</Link> : null}
        <Link to={`/profile/${sniff.userId}`} color="link" className="sniffCardPhotoAndUsername">
          <img src={sniff.user.profilePicUrl} alt="" height={75} width={75}/>
          <div className='sniffCardUsername'>
            <div>
              {sniff.user.displayName}
            </div>
            <div>
              @{sniff.user.username}
            </div>
          </div>
        </Link>
        </CardTitle>
      <CardText>{sniff.body}</CardText>
      <div className="elapsedTimeAndLikes">
        <h6 className="elapsedTime">{timeSince()} ago</h6>
        <div>
          {sniff.userId === parseInt(sessionStorage.getItem("userId")) ? <Button className="deleteSniffButton" color="primary" onClick={() => handleDelete(sniff.id)}>Delete</Button> : null}
          <Button color="primary" onClick={changeResniffStatus} active={resniffed.status}>{resniffed.status ? "Unresniff" : "Resniff"}</Button>
          {'  '}
          <Link className="resniffLink" to={`/resniffs/${sniff.id}`}>{numResniffs}</Link>
          <Button color="primary" onClick={changeLikeStatus} active={liked.status}>{liked.status ? "Unlike" : "Like"}</Button>
          {'  '}
          <Link to={`/likes/${sniff.id}`}>{numLikes}</Link>
        </div>
      </div>
    </Card>
  )
}

export default SniffCard