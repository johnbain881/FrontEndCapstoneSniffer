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
            .then(() => {
              feedSniffs.sort(sortByTimestamp)
              stateToChange = feedSniffs.map(sniff => sniff.id)
              setSniffArray(stateToChange)
            })
          })
        })

        break;
      case "profile":
        DataManager.getAll(`sniffs?userId=${props.userId}`)
        .then(sniffs => {
          sniffs.sort(sortByTimestamp)
          stateToChange = sniffs.map(sniff => sniff.id)
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
        <SniffModal />
      </div> 
      : null}
     
      <div id="">
        {sniffArray.map(sniffId => <SniffCard {...props} key={sniffId} sniffId={sniffId} />)}
      </div>
    </div>
  )
}

export default SniffList