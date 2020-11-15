import React from 'react'
import PropTypes from 'prop-types'
import './Nav.css'

export const Nav = ({ navItems, selected, onSelect }) => {
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
              <li className='nav-item'>
                <button key={index} id={name} className={computedClass} onClick={() => onSelect(name)}>{name}</button>
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
  onSelect: PropTypes.func.isRequired
}
