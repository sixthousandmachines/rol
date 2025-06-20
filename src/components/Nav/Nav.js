import PropTypes from 'prop-types'
import React from 'react'
import { NavLink } from 'react-router-dom'
import './Nav.css'

export const Nav = ({ navItems }) => {
  const getCleanUrl = (name) => name.replace(/\s+/g, '')

  return (
    <div className='App-nav'>
      <nav className='nav-container'>
        {navItems.map((item) => (
          <NavLink
            key={item}
            to={`/${getCleanUrl(item)}`}
            className={({ isActive }) => (isActive ? 'nav-item nav-item-active' : 'nav-item')}
          >
            <span className='nav-item-text'>{item}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

Nav.propTypes = {
  navItems: PropTypes.array.isRequired
}
