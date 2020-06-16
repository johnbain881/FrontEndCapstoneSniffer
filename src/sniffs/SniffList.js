import React, { useState, useEffect } from 'react'
import SniffCard from './SniffCard'
import SniffModal from './SniffModal'
import DataManager from '../modules/DataManager'


const SniffList = (props) => {

  const [sniffArray, setSniffArray] = useState([])

  useEffect(() => {
    let stateToChange = [];
    switch(props.calledFrom) {
      case "feed":
        DataManager.getAll(`follows?userFollowingId=${parseInt(sessionStorage.getItem("userId"))}`)
        .then(usersFollowed => {
          console.log(usersFollowed)
          stateToChange = usersFollowed.map(users => users.userId)
        })

        break;
      case "profile":
        DataManager.getAll(`sniffs?userId=${props.userId}`)
        .then(sniffs => {
          function sortByTimestamp(a, b) {
            if (a.timestamp > b.timestamp) {
              return -1
            }
            if (a.timestamp < b.timestamp) {
              return 1
            }
            return 0
          }
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
  }, [props.calledFrom])

  return (
    <div id={props.calledFrom === "feed" ? "sniffsList" : ""}>

      {props.calledFrom === "feed" ? 
      <div id="feedHeading">
        <h1>Feed</h1>
        <SniffModal />
      </div> 
      : null}
     
      <div id="sniffsDiv">
        {sniffArray.map(sniffId => <SniffCard key={sniffId} sniffId={sniffId} />)}
      </div>
    </div>
  )
}

export default SniffList