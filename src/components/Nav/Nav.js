import PropTypes from 'prop-types'
import React, { useState } from 'react'
import './Nav.css'

export const Nav = ({ navItems, selected, handleSelect }) => {
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)
  const handleClick = (name) => { handleSelect(name); setShow(false) }
  const defaultClass = 'nav-item'
  const navbarCollapse = show ? 'navbar-collapse show' : 'navbar-collapse'
  return (
    <div className='App-nav'>
      <div className='container'>
        <nav class='navbar navbar-expand-lg navbar-dark'>
          <button class='navbar-toggler' type='button' data-trigger='#main_nav' onClick={handleShow}>
            <span class='navbar-toggler-icon' />
          </button>
          <div class={navbarCollapse} id='main_nav'>
            <div class='offcanvas-header mt-3'>
              <button class='btn btn-outline-danger btn-close float-right' onClick={handleClose}> &#10006; </button>
            </div>
            <ul class='nav nav-pills nav-fill navbar-nav '>
              {navItems.map((name, index) => {
                const computedClass = name === selected ? defaultClass + ' nav-item-active' : defaultClass
                return (
                  <li key={index} className={computedClass} onClick={() => handleClick(name)}>
                    <label key={index} id={name}>{name}</label>
                  </li>
                )
              })}
            </ul>
          </div>
        </nav>
      </div>
    </div>
  )
}

Nav.propTypes = {
  navItems: PropTypes.array.isRequired,
  selected: PropTypes.string.isRequired,
  handleSelect: PropTypes.func.isRequired
}
