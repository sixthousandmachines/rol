import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './Player.css'

let self

class Playlist extends Component {
  constructor (props) {
    super(props)
    self = this
  }

  renderPlaylistItem (item, index) {
    return (
      <div className='row'>
        <button key={index} id={item.id} className='playlist-item' onClick={() => self.props.onSelect(item.id)}>{item.displayText}</button>
      </div>
    )
  }

  render () {
    return (
      <div className='App-playlist'>
        <div className='container'>
          {self.props.playlist.map(self.renderPlaylistItem)}
        </div>
      </div>
    )
  }
}

Playlist.propTypes = {
  playlist: PropTypes.array.isRequired,
  onSelect: PropTypes.func.isRequired
}

export default Playlist
