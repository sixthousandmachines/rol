import React, { Component } from 'react'
// import logo from './biohazard.gif'
import { Nav } from './components/Nav/Nav'
import { Playlist } from './components/Playlist/Playlist'
import { Player } from './components/Player/Player'
import Store from './stores/Store'
import './App.css'

let self

class App extends Component {
  constructor(props) {
    super(props)
    this.onSelect = this.onSelect.bind(this)
    this.state = {
      page: Store.getPage()
    }
    self = this
  }

  componentDidMount () {
    Store.subscribe('APP', this.onSelectCallback)
  }

  componentWillUnmount () {
    Store.unsubscribe('APP')
  }

  onNavigation (e) {
    Store.setArtist(e)
  }

  onSelect (e) {
    Store.setSelection(e)
  }

  onSelectCallback (page) {
    self.setState({
      page
    })
  }

  render () {
    return (
      <div className='App'>
        {/* <header className='App-header'>
          <img src={logo} className='App-logo' alt='logo' />
        </header> */}
        <Nav navItems={self.state.page.navItems} selected={self.state.page.navSelected} onSelect={self.onNavigation} />
        <Playlist playlist={self.state.page.playlist} onSelect={self.onSelect} />
        <Player playerlist={self.state.page.playerlist} />
      </div>
    )
  }
}

export default App
