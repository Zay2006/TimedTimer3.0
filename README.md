# TimedTimer 3.0

## Project Overview
TimedTimer is a modern focus timer application built with Next.js that helps users maintain concentration and track productivity through customizable timer sessions.

## Quick Start

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)
- Git

### Installation

1. **Clone and Install**
   ```bash
   git clone https://github.com/Zay2006/TimedTimer3.0.git
   cd TimedTimer3.0
   npm install
   ```

2. **Environment Setup**
   Create a `.env.local` file in the root directory with:
   ```env
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   
   # Optional: Spotify Integration
   SPOTIFY_CLIENT_ID=your_client_id
   SPOTIFY_CLIENT_SECRET=your_client_secret
   ```

3. **Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

4. **Production Build**
   ```bash
   npm run build
   npm start
   ```

### Troubleshooting
- **Port Conflicts**: Use `npm run dev -- -p 3001` for a different port
- **Dependencies Issues**: 
  ```bash
  npm cache clean --force
  rm -rf node_modules
  npm install
  ```

## Features
- **Advanced Timer System**
  - Multiple timer presets (Pomodoro, Custom, Short Focus)
  - Break timer functionality
  - Session planning and tracking
  - Real-time progress visualization

- **Analytics & Tracking**
  - Comprehensive session statistics
  - Daily progress tracking
  - Streak system with achievements
  - Focus time analytics
  - Session completion rates

- **Settings & Customization**
  - Theme customization (Light/Dark mode)
  - Sound notifications
  - Timer presets management
  - System notifications
  - Spotify integration for focus music

- **Data Management**
  - Local storage persistence
  - Session history tracking
  - Analytics data management
  - Achievement system

## Tech Stack
- **Framework**: Next.js 14+ with React 18
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Calendar**: react-day-picker

## Project Structure
```
/
├── components/ui/           # shadcn/ui base components
├── src/
│   ├── app/
│   │   ├── analytics/      # Analytics page routing
│   │   ├── components/     # Feature components
│   │   │   ├── analytics/  # Analytics visualization
│   │   │   ├── timer/     # Timer functionality
│   │   │   └── settings/  # Settings management
│   │   ├── contexts/      # Global state management
│   │   └── utils/        # Shared utilities
│   └── styles/           # Global styles
├── public/               # Static assets
├── package.json         # Project dependencies
└── tsconfig.json        # TypeScript configuration
```

## Required Charts
Located in `/src/app/components/analytics/`:

1. **Focus Time Chart** (`FocusChart.tsx`)
   - Displays daily focus time
   - Shows time spent in focused sessions
   - Accessible at `/analytics` page

2. **Streak Chart** (`StreakChart.tsx`)
   - Visualizes consecutive days of activity
   - Shows current and best streaks
   - Accessible at `/analytics` page

3. **Daily Focus Chart** (`DailyFocusChart.tsx`)
   - Shows focus patterns throughout the day
   - Helps identify peak productivity hours
   - Accessible at `/analytics` page

### Accessing the Charts
1. Start the development server: `npm run dev`
2. Open http://localhost:3000
3. Navigate to Analytics page
4. All three charts are displayed in the main dashboard

## Documentation
See [CodeExplanation.md](./CodeExplanation.md) for detailed:
- Development guidelines
- Component documentation
- State management
- Performance optimization
- Testing procedures
- Deployment instructions

## Contributing
1. Fork the repository
2. Create your feature branch
3. Make your changes
4. Run tests and lint checks
5. Submit a pull request

## License
MIT License - See LICENSE file for details
