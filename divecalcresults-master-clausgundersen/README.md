# Diving Competition Scoreboard

A modern web application for displaying diving competition results and scoreboard data. This application receives data from DiveCalc and displays it in various formats for scoreboards, big screens, and information displays.

## Features

- Real-time display of diving competition data
- Multiple view modes: Scoreboard, Big Screen, Info Screen, Controls
- Support for commercial breaks
- Responsive design
- Automatic cycling between competitions
- Support for multiple simultaneous competitions

## Technology Stack

- **Backend**: Node.js with Koa framework
- **Frontend**: React 18 with functional components and hooks
- **Build Tool**: Vite
- **Deployment**: PM2 for process management
- **Real-time Communication**: Socket.IO

## Prerequisites

- Node.js (v18 or newer)
- npm (v8 or newer)
- For production: PM2

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd divecalc-scoreboard
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `build` directory for static files:
   ```
   mkdir -p dist/img
   ```

4. Add required flag images to the `dist/img` directory.

## Development

Start the development server:

```
npm run dev
```

This will start both the client development server (Vite) and the backend server concurrently.

- Frontend will be available at: http://localhost:3000
- Backend will be available at: http://localhost:9000

## Building for Production

1. Build the frontend:
   ```
   npm run build
   ```

2. Start the production server:
   ```
   npm start
   ```

## PM2 Deployment

For production deployment with PM2:

```
npm run pm2
```

## Project Structure

```
divecalc-scoreboard/
├── dist/                  # Build output directory
├── src/
│   ├── client/            # Frontend React application
│   │   ├── components/    # React components
│   │   ├── data/          # Static data (dives, logos)
│   │   ├── hooks/         # Custom React hooks
│   │   ├── styles/        # SCSS styles
│   │   └── index.jsx      # Main client entry point
│   └── server/            # Backend server application
│       └── index.js       # Main server entry point
├── public/                # Static files
├── *.html                 # HTML entry points
├── package.json           # Project dependencies
├── vite.config.js         # Vite configuration
└── ecosystem.config.js    # PM2 configuration
```

## Usage Options

The application supports various URL parameters to customize behavior:

- `?channel=name` - Specify the channel/stream to listen to (default: 'screen')
- `?competition=name` - Show only a specific competition
- `?auto=true` - Enable auto-transition mode
- `?hideScore=true` - Hide scores (for live broadcasts before results are announced)
- `?filter=results` - Force display of only results
- `?dods=true` - Use special branding

## View Modes

To select different view modes, add a class to the body tag:

- Default - Regular scoreboard
- `bigscreen` - Large display for venue screens
- `infoscreen` - Simplified info display
- `controls` - Admin control panel

Example (can be set in index.html or via JavaScript):
```html
<body class="bigscreen">
```

## License

ISC