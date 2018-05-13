import React, { Component } from 'react'
import PropTypes from 'prop-types'
import AudioPlayer from 'react-responsive-audio-player'
import './Player.css'

let self

class Player extends Component {
  constructor (props) {
    super(props)
    this.onMediaEvent = this.onMediaEvent.bind(this)
    self = this
  }

  onMediaEvent (e) {
    window.alert(e)
  }

  render () {
    return (
      <div className='App-intro'>
        <div className='App-player'>
          <AudioPlayer playlist={self.props.playerlist} onMediaEvent={self.OnMediaEvent} preload='auto' autoPlay />
        </div>
      </div>
    )
  }
}

Player.propTypes = {
  playerlist: PropTypes.array.isRequired
}

export default Player
