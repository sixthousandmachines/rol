import React from 'react'
import PropTypes from 'prop-types'
import './Playlist.css'

export const Playlist = ({ playlist, onSelect }) => {
  return (
    <div className='App-playlist'>
      <div className='container'>
        {playlist.map((item, index) => {
          return (
            <div className='row'>
              <button key={index} id={item.id} className='playlist-item' onClick={() => onSelect(item.id)}>{item.displayText}</button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

Playlist.propTypes = {
  playlist: PropTypes.array.isRequired,
  onSelect: PropTypes.func.isRequired
}
