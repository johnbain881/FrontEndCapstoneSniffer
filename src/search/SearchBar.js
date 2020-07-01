import React, { useState } from 'react'
import { Input } from 'reactstrap'
import UserList from '../users/UserList'


const SearchBar = () => {
  const [search, setSearch] = useState("")

  const doSearch = (evt) => {
    setSearch(evt.target.value)
  }
  //returns an input box that gets a user list that grabs the data with a query for whatever was typed in the box
  return (
    <div id="searchBarBox" className="placeholder">
      <div id="searchBar">
        <Input type="text" onChange={doSearch} placeholder="Search for friends" />
        <UserList calledFrom="search" search={search}/>
      </div>
    </div>
  )
}

export default SearchBar