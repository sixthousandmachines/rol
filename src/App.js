import React, { useEffect } from 'react'
import { Provider } from 'react-redux'
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  useParams, 
  Outlet
} from 'react-router-dom'
import { store } from './store'
import { useAppDispatch, useAppSelector } from './store/hooks'
import { fetchMusicCatalog, setArtist } from './store/musicSlice'
import './App.css'
import { Nav } from './components/Nav/Nav'
import { Player } from './components/Player/Player'
import { Playlist } from './components/Playlist/Playlist'

// 1. App Wrapper with Provider
const AppWrapper = () => (
  <Provider store={store}>
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Home />} />
          <Route path='/:djName' element={<DJPage />} />
        </Route>
      </Routes>
    </Router>
  </Provider>
)

// 2. Main Layout Component
const Layout = () => {
  const dispatch = useAppDispatch()
  const { navItems, loading, error } = useAppSelector(state => state.music)

  useEffect(() => {
    dispatch(fetchMusicCatalog())
  }, [dispatch])

  return (
    <div className='App'>
      <header className='App-header'>
        <h1>rideoutlane</h1>
      </header>
      <Nav navItems={navItems} />
      <div className='content'>
        {loading && <p className='loading-text'>Loading Music...</p>}
        {error && <p className='error-text'>Error: {error}</p>}
        {!loading && !error && <Outlet />}
      </div>
      <Player />
    </div>
  )
}

// 3. Home Page Component
const Home = () => (
  <div className='home-placeholder'>
    <img src={require('./biohazard.gif')} alt="Biohazard" className='home-image' />
    <h2>Pick your poison</h2>
    <p>Choose your DJ</p>
  </div>
)

// 4. DJ Page Component
const DJPage = () => {
  const { djName } = useParams()
  const dispatch = useAppDispatch()
  const { playlist, djNameMap } = useAppSelector(state => state.music)

  useEffect(() => {
    if (djName && djNameMap[djName.toLowerCase()]) {
      // Use the original name from our mapping (case-insensitive lookup)
      dispatch(setArtist(djNameMap[djName.toLowerCase()]))
    }
  }, [djName, djNameMap, dispatch])

  // Use the original DJ name for display (case-insensitive lookup)
  const originalDjName = djName ? djNameMap[djName.toLowerCase()] : ''

  // Show error if DJ not found
  if (djName && !originalDjName) {
    return (
      <div className='error-container'>
        <h2>DJ Not Found</h2>
        <p>Sorry, we couldn't find a DJ named "{djName}".</p>
        <p>Please check the URL or browse our available DJs from the navigation.</p>
      </div>
    )
  }

  return <Playlist playlist={playlist} djName={originalDjName} />
}

export default AppWrapper
