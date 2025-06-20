import PropTypes from 'prop-types'
import React from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { setSelection, setAudioPlaying, toggleAudioPlay, setAudioTime } from '../../store/musicSlice'
import './Playlist.css'

export const Playlist = ({ playlist, djName }) => {
  const dispatch = useAppDispatch()
  const { audioState, trackSelected } = useAppSelector(state => state.music)

  const handleSelect = (trackId) => {
    dispatch(setSelection(trackId))
  }

  const handlePlayPause = (trackId) => {
    if (audioState.currentTrackId === trackId) {
      dispatch(toggleAudioPlay())
    } else {
      dispatch(setSelection(trackId))
      dispatch(setAudioPlaying(true))
    }
  }

  const handleSeek = (e, trackId) => {
    e.stopPropagation()
    
    if (audioState.currentTrackId !== trackId || !audioState.duration) {
      console.log('Cannot seek: wrong track or duration not available')
      return
    }
    
    const progressBar = e.currentTarget
    const rect = progressBar.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const percentage = Math.min(1, Math.max(0, clickX / rect.width))
    const seekTime = percentage * audioState.duration
    
    console.log('Mini progress bar clicked:', { 
      clickX,
      width: rect.width,
      percentage, 
      duration: audioState.duration,
      seekTime 
    })
    
    dispatch(setAudioTime(seekTime))
  }

  const handleDownload = async (e, track) => {
    e.preventDefault()
    e.stopPropagation()

    try {
      // Show loading state on the button
      const button = e.currentTarget
      const originalText = button.innerHTML
      button.innerHTML = '<span class="material-icons">hourglass_top</span>'
      button.style.opacity = '0.7'

      // Fetch the file
      const response = await fetch(track.url)
      if (!response.ok) throw new Error('Download failed')
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      
      // Create temporary link and trigger download
      const link = document.createElement('a')
      link.href = url
      link.download = track.id.split('/').pop() // Get filename from track ID
      document.body.appendChild(link)
      link.click()
      
      // Cleanup
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      // Restore button state
      button.innerHTML = originalText
      button.style.opacity = '1'
    } catch (error) {
      console.error('Download error:', error)
      // Show error state briefly
      const button = e.currentTarget
      button.innerHTML = '<span class="material-icons">error</span>'
      setTimeout(() => {
        button.innerHTML = '<span class="material-icons">download</span>'
        button.style.opacity = '1'
      }, 2000)
    }
  }

  if (!playlist || playlist.length === 0) {
    return (
      <div className='playlist-container'>
        <div className='playlist-placeholder'>
          <h2>Nothing here yet</h2>
          <p>{djName} is cooking up some fresh tracks</p>
        </div>
      </div>
    )
  }

  const parseTrackName = (filename) => {
    const parts = filename.split('__')
    if (parts.length >= 2) {
      return parts[1].replace('.mp3', '').replace(/_/g, ' ')
    }
    return filename.replace('.mp3', '').replace(/_/g, ' ')
  }

  return (
    <div className='playlist-container'>
      <div className='playlist-grid'>
        {playlist.map((track) => {
          const isSelected = trackSelected === track.id
          const isCurrentlyPlaying = audioState.currentTrackId === track.id && audioState.isPlaying
          const trackName = parseTrackName(track.id.split('/').pop())
          const progressPercentage = audioState.currentTrackId === track.id && audioState.duration > 0 
            ? (audioState.currentTime / audioState.duration) * 100 
            : 0
          
          return (
            <div 
              key={track.id} 
              className={`track-card ${isSelected || audioState.currentTrackId === track.id ? 'selected' : ''}`}
              onClick={() => handleSelect(track.id)}
            >
              <div className='track-header'>
                <div className='track-header-content'>
                  <div className='track-title-section'>
                    <h3 className='track-title'>{trackName}</h3>
                    <div className='track-meta'>
                      <span className='file-size'>{track.fileSize}</span>
                      <span className='last-modified'>{track.lastModified}</span>
                    </div>
                  </div>
                  <button 
                    className='download-btn'
                    onClick={(e) => handleDownload(e, track)}
                    title="Download track"
                  >
                    <span className="material-icons">download</span>
                  </button>
                </div>
              </div>
              
              <div className='track-content'>
                {isSelected ? (
                  <div className='mini-player-controls'>
                    <button 
                      className='mini-play-btn'
                      onClick={(e) => {
                        e.stopPropagation()
                        handlePlayPause(track.id)
                      }}
                    >
                      {isCurrentlyPlaying ? 
                        <span className="material-icons">pause</span> : 
                        <span className="material-icons">play_arrow</span>
                      }
                    </button>
                    
                    <div 
                      className='mini-progress-bar'
                      onClick={(e) => handleSeek(e, track.id)}
                    >
                      <div 
                        className='mini-progress-filled'
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className='track-info'>
                    <p className='dj-name'>{djName}</p>
                    <p className='track-duration'>
                      {track.duration || 'Duration: Unknown'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

Playlist.propTypes = {
  playlist: PropTypes.array,
  djName: PropTypes.string
}
