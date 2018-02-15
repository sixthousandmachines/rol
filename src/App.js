import React, { Component } from 'react'
import AudioPlayer from 'react-responsive-audio-player'
import logo from './biohazard.gif'
import './Player.css'
import './Playlist.css'
import './App.css'

let playlist =
  [{
    id: 1,
    url: 'http://media.rideoutlane.com/decksimus_&_cubanb__live@myth_20170101.mp3',
    displayText: 'Live @ Myth',
    selected: false
  },
  {
    id: 2,
    url: 'http://media.rideoutlane.com/club/radio_rehab_uncut_mix.mp3',
    displayText: 'Radio Rehab',
    selected: false
  }]

class App extends Component {
  constructor (props) {
    super(props)
    this.onMediaEvent = this.onMediaEvent.bind(this)
    this.onItemSelect = this.onItemSelect.bind(this)
  }

  onMediaEvent (e) {
    window.alert(e)
  }

  onItemSelect (e) {
    window.alert(e)
  }

  renderPlaylistItem (item) {
    return (
      <button id={item.id} className='playlist-item'>{item.displayText}</button>
    )
  }

  render () {
    return (
      <div className='App'>
        <header className='App-header'>
          <img src={logo} className='App-logo' alt='logo' />
        </header>
        {playlist.map(this.renderPlaylistItem)}
        <p className='App-intro'>
          <div className='App-player'>
            <AudioPlayer playlist={playlist} onMediaEvent={this.OnMediaEvent} />
          </div>
        </p>
      </div>
    )
  }
}

export default App
