import PropTypes from 'prop-types'
import React from 'react'
import './Nav.css'

export const Nav = ({ navItems, selected, handleSelect }) => {
  let defaultClass = 'nav-item'
  return (
    <div className='App-nav'>
      <div className='container'>
        <ul className='nav nav-pills nav-fill'>
          {navItems.map((name, index) => {
            const computedClass = name === selected ? defaultClass + ' nav-item-active' : defaultClass
            return (
              <li key={index} className={computedClass} onClick={() => handleSelect(name)} >
                <label key={index} id={name} >{name}</label>
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
