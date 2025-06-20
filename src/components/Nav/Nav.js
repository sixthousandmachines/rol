import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import './Nav.css'

export const Nav = ({ navItems }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const getCleanUrl = (name) => name.replace(/\s+/g, '')

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  if (!navItems || navItems.length === 0) {
    return (
      <div className='nav-loading'>
        <div className='spinner'></div>
        <span>Loading DJs...</span>
      </div>
    )
  }

  const renderNavItems = () => (
    navItems.map((item) => (
      <NavLink
        key={item}
        to={`/${getCleanUrl(item)}`}
        className={({ isActive }) => (isActive ? 'nav-item nav-item-active' : 'nav-item')}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <span className='nav-item-text'>{item}</span>
      </NavLink>
    ))
  )

  return (
    <div className='App-nav'>
      <nav className='nav-container'>
        {/* Mobile Menu Toggle */}
        <button 
          className='nav-toggle'
          onClick={toggleMobileMenu}
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          <span className='material-icons'>
            {isMobileMenuOpen ? 'close' : 'menu'}
          </span>
          {isMobileMenuOpen ? 'Close Menu' : 'Browse DJs'}
        </button>

        {/* Navigation Menu */}
        <div className={`nav-menu ${isMobileMenuOpen ? 'expanded' : 'collapsed'}`}>
          {renderNavItems()}
        </div>
      </nav>
    </div>
  )
}

Nav.propTypes = {
  navItems: PropTypes.array.isRequired
}
