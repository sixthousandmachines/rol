import React from 'react'
import PropTypes from 'prop-types'
import AudioPlayer from 'react-responsive-audio-player'
import './Player.css'

export const Player = ({ playerlist }) => {
  return (
    <div className='App-intro'>
      <div className='App-player'>
        <AudioPlayer playlist={playerlist} preload='auto' autoplay autoplayDelayInSeconds={2.1} />
      </div>
    </div>
  )
}

Player.propTypes = {
  playerlist: PropTypes.array.isRequired
}
