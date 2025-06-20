import React, { useEffect } from 'react'
import { Provider } from 'react-redux'
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  useParams, 
  Outlet,
  UNSAFE_DataRouterContext,
  UNSAFE_DataRouterStateContext
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
    <h2>Select a DJ to begin</h2>
  </div>
)

// 4. DJ Page Component
const DJPage = () => {
  const { djName } = useParams()
  const dispatch = useAppDispatch()
  const { playlist, djNameMap } = useAppSelector(state => state.music)

  useEffect(() => {
    if (djName && djNameMap[djName]) {
      // Use the original name from our mapping
      dispatch(setArtist(djNameMap[djName]))
    }
  }, [djName, djNameMap, dispatch])

  // Use the original DJ name for display
  const originalDjName = djName ? djNameMap[djName] : ''

  return <Playlist playlist={playlist} djName={originalDjName} />
}

export default AppWrapper
