import PropTypes from 'prop-types'
import React, { useRef, useEffect, useState, useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { setAudioPlaying, setAudioTime, setAudioDuration, toggleAudioPlay, seekAudio } from '../../store/musicSlice'
import './Player.css'

export const Player = () => {
  const dispatch = useAppDispatch()
  const { audioState, playlist, trackSelected } = useAppSelector(state => state.music)
  const audioRef = useRef(null)
  const [isSeeking, setIsSeeking] = useState(false)
  const [isMetadataLoaded, setIsMetadataLoaded] = useState(false)
  const playPromiseRef = useRef(null)
  const [localTime, setLocalTime] = useState(0)
  const [localDuration, setLocalDuration] = useState(0)
  
  const currentTrack = playlist.find(track => track.id === trackSelected)

  // Sync local state with Redux state
  useEffect(() => {
    setLocalTime(audioState.currentTime)
  }, [audioState.currentTime])

  useEffect(() => {
    setLocalDuration(audioState.duration)
  }, [audioState.duration])

  const handlePlay = useCallback(async () => {
    const audio = audioRef.current
    if (!audio) return

    try {
      console.log('Attempting to play:', audio.src)
      const promise = audio.play()
      if (promise !== undefined) {
        playPromiseRef.current = promise
        await promise
        console.log('Playback started successfully')
        playPromiseRef.current = null
      }
    } catch (error) {
      console.error("Playback error:", error)
      dispatch(setAudioPlaying(false))
    }
  }, [dispatch])

  const handlePause = useCallback(async () => {
    const audio = audioRef.current
    if (!audio) return

    try {
      if (playPromiseRef.current) {
        await playPromiseRef.current
      }
      audio.pause()
      console.log('Playback paused')
    } catch (error) {
      console.error("Pause error:", error)
    }
  }, [])

  // Effect to handle track loading and playback state
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleCanPlay = () => {
      console.log('Audio can play now')
      // Update duration as soon as we can play
      if (audio.duration && audio.duration !== Infinity) {
        console.log('Setting initial duration on canplay:', audio.duration)
        setLocalDuration(audio.duration)
        dispatch(setAudioDuration(audio.duration))
        setIsMetadataLoaded(true)
      }
      if (audioState.isPlaying) {
        handlePlay()
      }
    }

    const handleLoadedData = () => {
      console.log('Audio data loaded:', {
        duration: audio.duration,
        readyState: audio.readyState
      })
      if (audio.duration && audio.duration !== Infinity) {
        console.log('Setting duration on loadeddata:', audio.duration)
        setLocalDuration(audio.duration)
        dispatch(setAudioDuration(audio.duration))
        setIsMetadataLoaded(true)
      }
    }

    if (currentTrack) {
      console.log('Current track:', currentTrack)
      if (audio.src !== currentTrack.url) {
        console.log('Loading new track URL:', currentTrack.url)
        // Reset states when loading new track
        setLocalDuration(0)
        setLocalTime(0)
        setIsMetadataLoaded(false)
        dispatch(setAudioDuration(0))
        dispatch(setAudioTime(0))
        
        audio.src = currentTrack.url
        audio.load()
        
        // Always listen for both canplay and loadeddata
        audio.addEventListener('canplay', handleCanPlay)
        audio.addEventListener('loadeddata', handleLoadedData)
      } else {
        if (audioState.isPlaying) {
          handlePlay()
        } else {
          handlePause()
        }
      }
    } else {
      handlePause()
      audio.src = ''
    }

    return () => {
      audio.removeEventListener('canplay', handleCanPlay)
      audio.removeEventListener('loadeddata', handleLoadedData)
    }
  }, [currentTrack, audioState.isPlaying, handlePlay, handlePause, dispatch])

  // Effect to handle audio time updates and metadata
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleTimeUpdate = () => {
      const newTime = audio.currentTime
      setLocalTime(newTime)
      dispatch(setAudioTime(newTime))
    }

    const handleLoadedMetadata = () => {
      console.log('Audio metadata loaded:', {
        duration: audio.duration,
        currentTime: audio.currentTime,
        readyState: audio.readyState,
        networkState: audio.networkState
      })
      if (audio.duration && audio.duration !== Infinity) {
        console.log('Setting duration on loadedmetadata:', audio.duration)
        setLocalDuration(audio.duration)
        dispatch(setAudioDuration(audio.duration))
        setIsMetadataLoaded(true)
      }
    }

    const handleDurationChange = () => {
      const newDuration = audio.duration
      console.log('Duration changed:', newDuration)
      if (newDuration && newDuration !== Infinity) {
        setLocalDuration(newDuration)
        dispatch(setAudioDuration(newDuration))
        setIsMetadataLoaded(true)
      }
    }

    const handleEnded = () => {
      console.log('Playback ended')
      dispatch(setAudioPlaying(false))
      setLocalTime(0)
      dispatch(setAudioTime(0))
    }

    const handleError = (e) => {
      console.error("Audio error:", e.target.error)
      dispatch(setAudioPlaying(false))
    }

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('durationchange', handleDurationChange)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('error', handleError)
    
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('durationchange', handleDurationChange)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('error', handleError)
    }
  }, [dispatch])

  // Reset metadata loaded state when track changes
  useEffect(() => {
    setIsMetadataLoaded(false)
  }, [trackSelected])

  const handleProgressBarClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    const audio = audioRef.current
    if (!audio || !isMetadataLoaded) {
      console.log('Cannot seek: audio not ready or metadata not loaded')
      return
    }

    const progressBar = e.currentTarget
    const rect = progressBar.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const percentage = Math.min(1, Math.max(0, clickX / rect.width))
    const seekTime = percentage * audio.duration
    
    console.log('Progress bar clicked:', { 
      clickX,
      width: rect.width,
      percentage, 
      duration: audio.duration,
      seekTime,
      isMetadataLoaded
    })
    
    try {
      audio.currentTime = seekTime
      setLocalTime(seekTime)
      dispatch(setAudioTime(seekTime))
    } catch (error) {
      console.error('Error seeking:', error)
    }
  }

  // Handle seek actions from Redux
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !audioState.currentTime) return

    try {
      audio.currentTime = audioState.currentTime
    } catch (error) {
      console.error('Error seeking from Redux:', error)
    }
  }, [audioState.currentTime])

  const handlePlayPause = async () => {
    if (currentTrack) {
      console.log('Play/Pause clicked, current state:', audioState.isPlaying)
      dispatch(toggleAudioPlay())
    }
  }

  if (!currentTrack) {
    return (
      <div className='App-player'>
        <div className='player-placeholder'>
          <p>Select a track to start playing</p>
        </div>
      </div>
    )
  }

  const progressPercentage = localDuration > 0 ? (localTime / localDuration) * 100 : 0

  return (
    <div className='App-player'>
      <div className='player-container'>
        <div className='track-info'>
          <h3>{currentTrack.displayText}</h3>
          <p className='artist-name'>{currentTrack.id.split('/')[0]}</p>
        </div>
        
        <audio 
          ref={audioRef}
          preload="auto"
          crossOrigin="anonymous"
        />
        
        <div className='main-player-controls'>
          <button 
            className='main-play-btn'
            onClick={handlePlayPause}
          >
            {audioState.isPlaying ? 
              <span className="material-icons">pause</span> : 
              <span className="material-icons">play_arrow</span>
            }
          </button>
          <div 
            className='main-progress-container'
            onClick={handleProgressBarClick}
          >
            <div className='main-progress-bar'>
              <div 
                className='main-progress-filled'
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
          <div className='main-time'>
            {localDuration > 0 ? 
              `${Math.floor(localTime / 60)}:${(localTime % 60).toFixed(0).padStart(2, '0')} / ${Math.floor(localDuration / 60)}:${(localDuration % 60).toFixed(0).padStart(2, '0')}`
              : '0:00 / 0:00'
            }
          </div>
        </div>
      </div>
    </div>
  )
}

Player.propTypes = {}

