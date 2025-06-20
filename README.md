# ROL - Rideout Lane Music Player

A modern React-based music streaming application that fetches and plays audio files from AWS S3.

## 🚀 Features

- **Modern React 18** with functional components and hooks
- **Redux Toolkit** for state management
- **React Router** for bookmarkable DJ pages
- **AWS S3 Integration** for music storage and streaming
- **Modern Audio Player** with:
  - Seeking functionality
  - Progress bar
  - Play/Pause controls
  - Download capability
  - Material Icons integration
- **Responsive Design** for mobile and desktop
- **Loading States** and error handling
- **Artist Navigation** and track selection
- **Bookmarkable URLs** for favorite DJs

## 🛠 Tech Stack

- **React 18.3.1** - Latest React with modern patterns
- **Redux Toolkit 2.2.1** - Modern state management
- **React Router DOM 6.28.0** - Client-side routing
- **AWS SDK v3** - S3 and Cognito integration
- **Material Icons** - Modern icon system
- **React Scripts 5.0.1** - Latest build tools
- **Task** - Task runner for deployment automation

## 🏃‍♂️ Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm start
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🚀 Deployment

This project uses [Task](https://taskfile.dev/) for deployment automation to AWS S3.

### Prerequisites

1. **Install Task CLI:**
   ```bash
   # Windows (using Scoop)
   scoop install task
   
   # macOS (using Homebrew)
   brew install go-task
   
   # Linux
   sh -c "$(curl --location https://taskfile.dev/install.sh)" -- -d -b ~/.local/bin
   ```

2. **Configure AWS CLI:**
   ```bash
   aws configure
   ```

### Available Tasks

- `task build` - Build the React application
- `task deploy` - Build and deploy to S3
- `task deploy:no-build` - Deploy without rebuilding
- `task clean:bucket` - Remove all files from S3 bucket
- `task list:bucket` - List contents of S3 bucket
- `task check:bucket` - Check S3 bucket configuration
- `task setup:bucket` - Configure bucket for static website hosting

### Deploy to Production

```bash
# Build and deploy
task deploy

# Deploy without rebuilding (if you just want to sync changes)
task deploy:no-build
```

### AWS Configuration

- **Website Bucket:** rideoutlane.com
- **Media Bucket:** media.rideoutlane.com
- **Region:** us-east-1
- **CORS:** Configured for cross-origin requests between buckets

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── Nav/            # Navigation component
│   ├── Player/         # Audio player component with seeking
│   └── Playlist/       # Track list component with downloads
├── store/              # Redux store
│   ├── index.js        # Store configuration
│   ├── musicSlice.js   # Music state management
│   └── hooks.js        # Redux hooks
├── App.js              # Main app component
└── index.js            # App entry point
Taskfile.yml            # Deployment automation
```

## 🔧 Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm run lint` - Check code quality
- `npm run lint:fix` - Fix linting issues
- `npm run format` - Format code with Prettier

## 🎵 How It Works

1. **Catalog Loading** - App fetches music catalog from AWS S3
2. **Artist Selection** - Users can browse by artist/DJ
3. **Track Selection** - Select individual tracks to play
4. **Audio Playback** - Modern audio player with:
   - Seeking functionality
   - Progress bar updates
   - Download capability
   - Material Icons
   - Proper metadata handling

## 🌐 Routing & URLs

The app supports bookmarkable URLs for easy sharing and navigation:

- **Home Page:** `http://localhost:3000/`
- **DJ Pages:** `http://localhost:3000/[dj-name]`
- **Examples:**
  - `http://localhost:3000/DJ%20Name` (URL encoded)
  - `http://localhost:3000/My%20Favorite%20DJ`

### Features:
- ✅ **Bookmarkable URLs** - Save your favorite DJ pages
- ✅ **Direct Links** - Share specific DJ pages with friends
- ✅ **Browser Navigation** - Use back/forward buttons
- ✅ **Home Navigation** - Easy return to main page
- ✅ **URL Encoding** - Handles special characters in DJ names
- ✅ **Case-Insensitive URLs** - Works with any case combination (e.g., `/Decksimus`, `/decksimus`, `/DECKSIMUS`)
- ✅ **Server-Side Routing** - Direct URL access works without 404 errors
- ✅ **404 Handling** - Friendly error messages for invalid DJ names

## 🔒 AWS Configuration

The app uses AWS Cognito Identity Pool for secure access to S3:
- **Region:** us-east-1
- **Bucket:** media.rideoutlane.com
- **Identity Pool:** us-east-1:d78ad54c-3a62-4e9a-9549-f203580ba151

## 🌐 Server Configuration

For proper client-side routing support, the hosting server must be configured to serve `index.html` for all routes. This project includes:

### Netlify Configuration
- `public/_redirects` - Redirects all routes to `index.html` for client-side routing
- This enables direct URL access to DJ pages without 404 errors

### Alternative Hosting
For other hosting providers (AWS S3, Vercel, etc.), configure:
- **Error Pages:** Set 404.html to redirect to index.html
- **Routing Rules:** Serve index.html for all non-file routes
- **SPA Support:** Enable single-page application routing

## 🎨 Modern Features

- **Loading States** - Visual feedback during data fetching
- **Error Handling** - Graceful error display and retry functionality
- **Responsive Design** - Works on all device sizes
- **Modern UI** - Clean, gradient-based design with glassmorphism effects
- **Type Safety** - Better development experience with proper typing
- **Fixed Player** - Audio controls always visible at bottom
- **URL Routing** - Bookmarkable pages for each DJ
- **Material Icons** - Professional icon system
- **Download Support** - Direct track downloads
- **Seeking** - Precise audio position control
- **Progress Bars** - Visual playback progress
- **Metadata Handling** - Proper audio metadata management
