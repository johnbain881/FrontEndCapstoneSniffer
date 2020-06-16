import React, { useState, useEffect } from 'react'
import { Card, CardTitle, CardText, Button, CardSubtitle } from 'reactstrap'
import DataManager from '../modules/DataManager'


const SniffCard = (props) => {

  const [sniff, setSniff] = useState({id: props.sniffId, body: "", timestamp: 0, userId: 0, user: {displayName: "", username: ""}})

  useEffect(() => {
    DataManager.getOne("sniffs", `${props.sniffId}?_expand=user`)
    .then(sniffFromDB => setSniff(sniffFromDB))
  }, [props.sniffId])

  function goto() {
    props.history.push(`/profile/${sniff.userId}`)
  }

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
    }
  }

  return (
    <Card body>
      <CardTitle><Button onClick={goto} color="link">{sniff.user.displayName}</Button></CardTitle>
      <CardSubtitle><Button onClick={goto} className="sniffUsername" color="link">@{sniff.user.username}</Button></CardSubtitle>
      <CardText>{sniff.body}</CardText>
      <CardText>{timeSince()}</CardText>
    </Card>
  )
}

export default SniffCard