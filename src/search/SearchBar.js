import React, { useState } from 'react'
import { Input } from 'reactstrap'
import UserList from '../users/UserList'


const SearchBar = () => {
  const [search, setSearch] = useState("")

  const doSearch = (evt) => {
    setSearch(evt.target.value)
  }

  return (
    <div className="placeholder">
      <Input type="text" onChange={doSearch} placeholder="Search for friends" />
      <UserList calledFrom="search" search={search}/>
    </div>
  )
}

export default SearchBar