import React, { useState, useEffect } from 'react'
import SniffCard from './SniffCard'
import SniffModal from './SniffModal'
import DataManager from '../modules/DataManager'


const SniffList = (props) => {

  const [sniffArray, setSniffArray] = useState([])

  function sortByTimestamp(a, b) {
    if (a.timestamp > b.timestamp) {
      return -1
    }
    if (a.timestamp < b.timestamp) {
      return 1
    }
    return 0
  }

  useEffect(() => {
    let stateToChange = [];
    let userIds = [];
    let feedSniffs = []
    switch(props.calledFrom) {
      case "feed":
        DataManager.getAll(`follows?userFollowingId=${parseInt(sessionStorage.getItem("userId"))}`)
        .then(usersFollowed => {
          userIds = usersFollowed.map(users => users.userId)
          userIds.push(parseInt(sessionStorage.getItem("userId")))
          userIds.forEach(userId => {
            DataManager.getAll(`sniffs?userId=${userId}`)
            .then(sniffs => {
              feedSniffs = feedSniffs.concat(sniffs)
            })
            DataManager.getAll(`resniffs?userId=${userId}`)
            .then(resniffs => {
              feedSniffs = feedSniffs.concat(resniffs)
            })
            .then(() => {
              feedSniffs.sort(sortByTimestamp)
              stateToChange = feedSniffs.map(sniffs => sniffs.sniffId ? {id: sniffs.sniffId, resniff: sniffs.userId} : {id: sniffs.id, resniff: 0})
              setSniffArray(stateToChange)
            })
          })
        })

        break;
      case "profile":
        DataManager.getAll(`sniffs?userId=${props.userId}`)
        .then(sniffs => {
          feedSniffs = feedSniffs.concat(sniffs)
          DataManager.getAll(`resniffs?userId=${props.userId}`)
          .then(resniffs => {
            feedSniffs = feedSniffs.concat(resniffs)
            feedSniffs.sort(sortByTimestamp)
            stateToChange = feedSniffs.map(sniffs => sniffs.sniffId ? {id: sniffs.sniffId, resniff: sniffs.userId} : {id: sniffs.id, resniff: 0})
            setSniffArray(stateToChange)
          })
        })
        .then(() => {
          setSniffArray(stateToChange)
        })
        break;
      default:
        break;
    }
  }, [props.calledFrom, props.userId])

  return (
    <div id={props.calledFrom === "feed" ? "sniffsListFeed" : "sniffsListProfile"}>

      {props.calledFrom === "feed" ? 
      <div id="feedHeading">
        <h1>Feed</h1>
        <SniffModal calledFrom="feed"/>
      </div> 
      : null}
     
      <div id="">
        {sniffArray.map(sniffId => <SniffCard {...props} resniff={sniffId.resniff} key={sniffId.resniff ? sniffId.id + Math.floor(Math.random() * 10001) : sniffId.id} sniffId={sniffId.id} />)}
      </div>
    </div>
  )
}

export default SniffList