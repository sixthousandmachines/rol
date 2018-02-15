import React, { Component } from 'react'
import AudioPlayer from 'react-responsive-audio-player'
import logo from './biohazard.gif'
import './Player.css'
import './App.css'

let playlist =
  [{
    url: 'http://media.rideoutlane.com/decksimus_&_cubanb__live@myth_20170101.mp3',
    displayText: 'Live @ Myth'
  },
  {
    url: 'http://media.rideoutlane.com/club/radio_rehab_uncut_mix.mp3',
    displayText: 'Radio Rehab'
  }]

class App extends Component {
  render () {
    return (
      <div className='App'>
        <header className='App-header'>
          <img src={logo} className='App-logo' alt='logo' />
        </header>
        <p className='App-intro'>
          <div className='App-player'>
            <AudioPlayer playlist={playlist} />
          </div>
        </p>
      </div>
    )
  }
}

export default App
