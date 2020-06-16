import React from 'react'
import { Nav, NavItem, NavLink } from "reactstrap"


const SideNav = (props) => {

  return (
    <div className="placeholder">
      <Nav vertical>
        <NavItem>
          <NavLink href="/feed">Home</NavLink>
        </NavItem>
        <NavItem>
          <NavLink href={`/profile/${sessionStorage.getItem("userId")}`}>Profile</NavLink>
        </NavItem>
        <NavItem>
          <NavLink onClick={props.doLogout} href={`/`}>Logout</NavLink>
        </NavItem>
      </Nav>
    </div>
  )
}

export default SideNav