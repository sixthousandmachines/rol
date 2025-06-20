import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity'
import { ListObjectsCommand, S3Client } from '@aws-sdk/client-s3'
import { fromCognitoIdentityPool } from '@aws-sdk/credential-provider-cognito-identity'

// AWS Configuration
const region = 'us-east-1'
const identityPoolId = 'us-east-1:d78ad54c-3a62-4e9a-9549-f203580ba151'
const bucketName = 'media.rideoutlane.com'

// Initialize AWS clients
const s3Client = new S3Client({
  region,
  credentials: fromCognitoIdentityPool({
    client: new CognitoIdentityClient({ region }),
    identityPoolId: identityPoolId
  })
})

export const fetchMusicCatalog = createAsyncThunk(
  'music/fetchMusicCatalog',
  async () => {
    try {
      const command = new ListObjectsCommand({
        Bucket: bucketName
      })
      const response = await s3Client.send(command)
      // Convert Date objects to ISO strings to make them serializable
      return (response.Contents || []).map(item => ({
        ...item,
        LastModified: item.LastModified.toISOString()
      }))
    } catch (error) {
      throw error
    }
  }
)

const initialState = {
  catalog: [],
  navItems: [],
  navSelected: '',
  playlist: [],
  trackSelected: null,
  playerlist: [],
  loading: false,
  error: null,
  // Map between URL-friendly names and original names
  djNameMap: {},
  // Global audio state
  audioState: {
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    currentTrackId: null,
    volume: 1
  }
}

const musicSlice = createSlice({
  name: 'music',
  initialState,
  reducers: {
    setArtist: (state, action) => {
      const artistId = action.payload
      state.navSelected = artistId
      
      // Filter catalog for selected artist and build playlist with null checks
      const artistTracks = state.catalog
        .filter(item => item && item.Key && item.Key.startsWith(artistId + '/'))
        .map(item => {
          const trackName = item.Key.substring(item.Key.indexOf('/') + 1)
          if (!trackName) return null
          
          // Parse track name from DJ_NAME__TRACK_NAME.mp3 convention
          const parseTrackName = (filename) => {
            if (!filename) return ''
            // Remove file extension
            const nameWithoutExt = filename.replace(/\.(mp3|wav|flac|m4a)$/i, '')
            
            // Split by double underscore
            const parts = nameWithoutExt.split('__')
            
            let trackName
            if (parts.length >= 2) {
              // Return everything after the first double underscore
              trackName = parts.slice(1).join('__')
            } else {
              // Fallback: return the filename without extension
              trackName = nameWithoutExt
            }
            
            // Replace underscores with spaces
            return trackName.replace(/_/g, ' ')
          }
          
          // Format file size
          const formatFileSize = (bytes) => {
            if (!bytes || bytes === 0) return '0 Bytes'
            const k = 1024
            const sizes = ['Bytes', 'KB', 'MB', 'GB']
            const i = Math.floor(Math.log(bytes) / Math.log(k))
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
          }
          
          // Format date
          const formatDate = (dateString) => {
            if (!dateString) return 'Unknown Date'
            return new Date(dateString).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })
          }
          
          return {
            id: item.Key,
            url: `http://${bucketName}/${item.Key}`,
            displayText: parseTrackName(trackName),
            fileSize: formatFileSize(item.Size),
            lastModified: formatDate(item.LastModified),
            selected: false
          }
        })
        .filter(Boolean) // Remove any null values
      
      state.playlist = artistTracks
    },
    
    setSelection: (state, action) => {
      const trackId = action.payload
      
      if (state.audioState.currentTrackId !== trackId) {
        state.trackSelected = trackId
        
        const selectedTrack = state.playlist.find(item => item.id === trackId)
        if (selectedTrack) {
          state.playerlist = [selectedTrack]
          state.audioState.currentTrackId = trackId
          state.audioState.currentTime = 0
          state.audioState.duration = 0
        }
      }
    },
    
    // Global audio actions
    setAudioPlaying: (state, action) => {
      state.audioState.isPlaying = action.payload
    },
    
    setAudioTime: (state, action) => {
      state.audioState.currentTime = action.payload
    },
    
    setAudioDuration: (state, action) => {
      const duration = action.payload
      if (duration && duration !== Infinity) {
        console.log('Setting audio duration in Redux:', duration)
        state.audioState.duration = duration
      } else {
        console.log('Invalid duration received:', duration)
      }
    },
    
    toggleAudioPlay: (state) => {
      state.audioState.isPlaying = !state.audioState.isPlaying
    },
    
    clearError: (state) => {
      state.error = null
    },
    
    setPlaylist: (state, action) => {
      state.playlist = action.payload
    },
    
    setTrackSelected: (state, action) => {
      state.trackSelected = action.payload
      // Reset audio state when changing tracks
      state.audioState.currentTime = 0
      state.audioState.duration = 0
    },
    
    setVolume: (state, action) => {
      state.audioState.volume = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMusicCatalog.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMusicCatalog.fulfilled, (state, action) => {
        state.loading = false
        state.catalog = action.payload
        
        // Extract unique artist names and create URL mapping
        const artists = [...new Set(action.payload
          .filter(item => item && item.Key)
          .map(item => {
            const parts = item.Key.split('/')
            return parts && parts.length > 0 ? parts[0] : null
          })
          .filter(Boolean)
        )]

        // Create mapping between clean URLs and original names
        const djNameMap = {}
        artists.forEach(name => {
          const cleanName = name.replace(/\s+/g, '')
          // Store with lowercase key for case-insensitive lookup
          djNameMap[cleanName.toLowerCase()] = name
        })

        state.djNameMap = djNameMap
        state.navItems = artists.sort()
      })
      .addCase(fetchMusicCatalog.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  }
})

export const { 
  setArtist, 
  setSelection, 
  setAudioPlaying,
  setAudioTime,
  setAudioDuration,
  toggleAudioPlay,
  clearError,
  setPlaylist,
  setTrackSelected,
  setVolume
} = musicSlice.actions

export default musicSlice.reducer 