import PropTypes from 'prop-types'
import React from 'react'
import './Nav.css'

export const Nav = ({ navItems, selected, handleSelect }) => {
  let computedClass = 'nav-link'
  return (
    <div className='App-nav'>
      <div className='container'>
        <ul className='nav nav-pills nav-fill'>
          {navItems.map((name, index) => {
            if (name === selected) {
              computedClass += ' active'
            }
            return (
              <li key={index} className='nav-item'>
                <button key={index} id={name} className={computedClass} onClick={() => handleSelect(name)}>{name}</button>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

Nav.propTypes = {
  navItems: PropTypes.array.isRequired,
  selected: PropTypes.string.isRequired,
  handleSelect: PropTypes.func.isRequired
}
