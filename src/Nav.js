import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './Nav.css'

let self

class Nav extends Component {
  constructor (props) {
    super(props)
    self = this
  }

  renderNavItem (name, index) {
    let computedClass = 'nav-link'
    if (name === self.props.selected) {
      computedClass += ' active'
    }
    return (
      <li className='nav-item'>
        <button key={index} id={name} className={computedClass} onClick={() => self.props.onSelect(name)}>{name}</button>
      </li>
    )
  }

  render () {
    return (
      <div className='App-nav'>
        <div className='container'>
          <ul className='nav nav-pills nav-fill'>
            {self.props.navItems.map(self.renderNavItem)}
          </ul>
        </div>
      </div>
    )
  }
}

Nav.propTypes = {
  navItems: PropTypes.array.isRequired,
  selected: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired
}

export default Nav
