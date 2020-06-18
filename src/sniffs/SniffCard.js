import React, { useState, useEffect } from 'react'
import { Card, CardTitle, CardText, Button } from 'reactstrap'
import { Link } from 'react-router-dom'
import DataManager from '../modules/DataManager'


const SniffCard = (props) => {

  const [sniff, setSniff] = useState({id: props.sniffId, body: "", timestamp: 0, userId: 0, user: {displayName: "", username: "", profilePicUrl: ""}})
  const [liked, setLiked] = useState({status: false, likeId: 0})
  const [numLikes, setNumLikes] = useState(0)

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
  }, [props.sniffId])

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

  return (
    <Card body>
      <CardTitle>
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
          <Button color="primary" onClick={changeLikeStatus} active={liked.status}>{liked.status ? "Unlike" : "Like"}</Button>
          {'  '}
          <Link to={`/likes/${sniff.id}`}>{numLikes}</Link>
        </div>
      </div>
    </Card>
  )
}

export default SniffCard