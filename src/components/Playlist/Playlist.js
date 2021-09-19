import PropTypes from 'prop-types'
import React from 'react'
import './Playlist.css'

export const Playlist = ({ playlist, handleSelect }) => {
  return (
    <div className='App-playlist'>
      <div className='container'>
        {playlist.map((item, index) => {
          return (
            <div key={index} className='row'>
              <button key={index} id={item.id} className='playlist-item' onClick={() => handleSelect(item.id)}>{item.displayText}</button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

Playlist.propTypes = {
  playlist: PropTypes.array.isRequired,
  handleSelect: PropTypes.func.isRequired
}
