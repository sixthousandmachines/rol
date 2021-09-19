import PropTypes from 'prop-types'
import React from 'react'
import './Playlist.css'

export const Playlist = ({ playlist, selected, handleSelect }) => {
  const defaultClass = 'playlist-item'
  return (
    <div className='App-playlist'>
      {playlist.map((item, index) => {
        const computedClass = item.id === selected ? defaultClass + ' playlist-item-active' : defaultClass
        return (
          <div className={computedClass} key={index} onClick={() => handleSelect(item.id)}>
            <label className='row playlist-item-title' key={index} id={item.id}>{item.displayText}</label>
            <span><a href={item.url} download={item.displayText}>Download</a></span>
          </div>
        )
      })}
    </div>
  )
}

Playlist.propTypes = {
  playlist: PropTypes.array.isRequired,
  handleSelect: PropTypes.func.isRequired
}
