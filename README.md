# TimedTimer 3.0

## Project Overview
TimedTimer is a modern focus timer application built with Next.js 14 that helps users maintain concentration and track productivity through customizable timer sessions. It features comprehensive analytics, achievement tracking, and integrations with popular services.

## Features

- **Smart Timer Management**
  - Customizable focus sessions
  - Break timer integration
  - Session pause/resume functionality
  - Progress tracking

- **Analytics & Insights**
  - Detailed productivity metrics
  - Focus patterns analysis
  - Daily, weekly, and monthly statistics
  - Performance scoring

- **Achievement System**
  - Progress-based achievements
  - Streak tracking
  - Performance milestones
  - Daily goals

- **Modern UI/UX**
  - Clean, minimal interface
  - Dark/light mode support
  - Responsive design
  - Floating timer widget

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Lucide icons

## Quick Start

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)
- Git

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Zay2006/TimedTimer3.0.git
   cd TimedTimer3.0
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`

4. **Build for Production**
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── app/              # Next.js app directory
│   ├── components/   # React components
│   ├── context/      # React context providers
│   ├── hooks/        # Custom React hooks
│   └── types/        # TypeScript type definitions
├── public/           # Static assets
└── styles/          # Global styles
```

## Key Features Implementation

### Timer System
- Accurate session tracking with breaks
- Focus time calculation excluding breaks
- Session persistence
- Progress tracking

### Analytics
- Real-time productivity metrics
- Focus pattern detection
- Achievement progress tracking
- Performance scoring system

### Data Management
- Local storage persistence
- Type-safe operations
- Automatic state updates
- Session history tracking

## Environment Setup

1. **Create Environment File**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   
   # Optional: Spotify Integration
   SPOTIFY_CLIENT_ID=your_client_id
   SPOTIFY_CLIENT_SECRET=your_client_secret
   ```

## Troubleshooting

### Common Issues
- **Port Conflicts**: Use `npm run dev -- -p 3001` for a different port
- **Dependencies Issues**: 
  ```bash
  npm cache clean --force
  rm -rf node_modules
  npm install
  ```

### Development Tips
- Use the development server with `npm run dev` for hot reloading
- Check the browser console for any errors
- Verify environment variables are properly set
- Make sure all dependencies are installed correctly
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
