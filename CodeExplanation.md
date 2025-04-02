# Timer Code Overview

## Core Components

### 1. Timer State
```typescript
const [timeRemaining, setTimeRemaining] = useState(defaultDuration);
const [isRunning, setIsRunning] = useState(false);
const [isBreak, setIsBreak] = useState(false);
```
Manages timer state for countdown, running status, and break periods.

### 2. Session Data
```typescript
type Session = {
    id: string,            // Unique identifier
    startTime: Date,       // Session start
    endTime: Date,        // Session end
    duration: number,      // Total minutes
    completed: boolean,    // Success status
    breaks: Break[],       // Break periods
    focusTime: number      // Actual focus time
}
```

### 3. Timer Logic
```typescript
useEffect(() => {
    let intervalId: number;
    if (isRunning && timeRemaining > 0) {
        intervalId = window.setInterval(() => {
            setTimeRemaining(prev => prev - 1);
        }, 1000);
    }
    return () => clearInterval(intervalId);
}, [isRunning, timeRemaining]);
```

### 4. Analytics
Tracks key metrics:
- Total sessions
- Completion rate
- Focus time
- Daily streaks

### 5. Data Storage
- Uses localStorage for session persistence
- Tracks streaks and analytics
- Maintains theme preferences

## Key Features

### Performance
- Memoized calculations
- Efficient state updates
- Proper cleanup

### User Experience
- Real-time feedback
- Theme customization
- Progress tracking

## Common Issues

### Timer Accuracy
```typescript
// Use Date objects for precise timing
const elapsed = new Date().getTime() - startTime.getTime();
```

### State Management
```typescript
// Use functional updates for reliability
setTimeRemaining(prev => prev - 1);  // Correct

# TimedTimer 3.0 - Development Guide

## Installation and Setup

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)
- Git

### Step-by-Step Installation
1. **Clone the Repository**
   ```bash
   git clone https://github.com/Zay2006/TimedTimer3.0.git
   cd TimedTimer3.0
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```
   
   Key dependencies:
   - Next.js 14+
   - React 18
   - shadcn/ui
   - Tailwind CSS
   - date-fns
   - react-day-picker

3. **Environment Setup**
   - Copy `.env.example` to `.env.local`
   ```bash
   cp .env.example .env.local
   ```
   - Configure environment variables:
     ```env
     NEXT_PUBLIC_APP_URL=http://localhost:3000
     # Add Spotify credentials if using music integration
     SPOTIFY_CLIENT_ID=your_client_id
     SPOTIFY_CLIENT_SECRET=your_client_secret
     ```

4. **Development Server**
   ```bash
   npm run dev
   ```
   - Access the application at http://localhost:3000
   - Hot reload enabled for development

5. **Build for Production**
   ```bash
   npm run build
   npm start
   ```

### Common Setup Issues

1. **Node Version Mismatch**
   - Use `nvm` to switch to the correct Node version:
     ```bash
     nvm use 18
     ```

2. **Port Conflicts**
   - Default port: 3000
   - To use a different port:
     ```bash
     npm run dev -- -p 3001
     ```

3. **Dependencies Issues**
   - Clear npm cache if needed:
     ```bash
     npm cache clean --force
     rm -rf node_modules
     npm install
     ```

## Project Organization

### Component Structure

1. **UI Components** (`/components/ui/`)
   - Base UI components from shadcn/ui
   - Reusable design system elements
   - Examples: button.tsx, calendar.tsx, accordion.tsx
   - These should NOT contain business logic

2. **Feature Components** (`/src/app/components/`)
   - Feature-specific components organized by domain
   - Contains business logic and feature implementations
   - Organized into subdirectories by feature:
     - `/timer/`: Core timer functionality
     - `/analytics/`: Analytics visualization and reporting
     - `/settings/`: Settings management
     - `/achievements/`: Achievement system
     - `/spotify/`: Music integration
     - etc.

3. **Analytics Implementation**
   - `/src/app/analytics/`: Analytics page and routing
     - Contains page.tsx for the analytics dashboard route
   - `/src/app/components/analytics/`: Analytics components
     - Visualization components (charts, graphs)
     - Control components (filters, date pickers)
     - Statistical components (insights, summaries)

### Project Structure
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
├── .env.example         # Environment variables template
├── package.json         # Project dependencies
└── tsconfig.json        # TypeScript configuration
```

## Development Guidelines

### Code Style
- Use TypeScript for all components
- Follow ESLint configuration
- Use Prettier for code formatting
- Follow React best practices

### State Management
- **DataContext**: Session and analytics data
  ```typescript
  interface DataContextType {
    sessions: Session[];
    analytics: Analytics;
    addSession: (session: Session) => void;
    updateAnalytics: () => void;
  }
  ```

- **SettingsContext**: User preferences
  ```typescript
  interface SettingsContextType {
    theme: 'light' | 'dark' | 'system';
    timerPresets: TimerPreset[];
    updateSettings: (settings: Partial<Settings>) => void;
  }
  ```

- **TimerContext**: Timer state
  ```typescript
  interface TimerContextType {
    timeRemaining: number;
    isRunning: boolean;
    startTimer: () => void;
    pauseTimer: () => void;
    resetTimer: () => void;
  }
  ```

### Testing
1. **Unit Tests**
   ```bash
   npm run test
   ```

2. **E2E Tests**
   ```bash
   npm run test:e2e
   ```

3. **Lint Checks**
   ```bash
   npm run lint
   ```

## Required Features

### Core Charts Implementation
Located in `/src/app/components/analytics/`:

1. **Focus Time Chart** (`FocusChart.tsx`)
   ```typescript
   // Displays daily focus time metrics
   const FocusChart: React.FC = () => {
     // Renders a bar chart showing daily focus duration
     // X-axis: Days
     // Y-axis: Hours spent focusing
   }
   ```

2. **Streak Chart** (`StreakChart.tsx`)
   ```typescript
   // Visualizes user's consistency
   const StreakChart: React.FC = () => {
     // Shows streak information
     // Current streak
     // Best streak
     // Daily completion status
   }
   ```

3. **Daily Focus Chart** (`DailyFocusChart.tsx`)
   ```typescript
   // Shows focus patterns throughout the day
   const DailyFocusChart: React.FC = () => {
     // Time-of-day focus patterns
     // Peak productivity hours
     // Session distribution
   }
   ```

### Chart Integration
The charts are integrated into the analytics dashboard:
1. Main dashboard layout (`/src/app/analytics/page.tsx`)
2. Chart components imported from `/src/app/components/analytics/`
3. Data provided through DataContext

### Accessing the Charts
1. Start the development server:
   ```bash
   npm run dev
   ```
2. Open http://localhost:3000
3. Click on Analytics in the navigation
4. All three required charts are displayed in the main dashboard

## Performance Considerations

### Optimization Techniques
1. **Memoization**
   ```typescript
   const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
   ```

2. **Event Handlers**
   ```typescript
   const handleClick = useCallback(() => {
     // Handle click event
   }, [dependencies]);
   ```

3. **Render Optimization**
   - Use React.memo for pure components
   - Implement proper dependency arrays in hooks
   - Avoid unnecessary re-renders

### Best Practices
1. Keep UI components in `/components/ui/`
2. Place feature components in `/src/app/components/[feature]/`
3. Use contexts for global state management
4. Implement proper TypeScript types
5. Follow React best practices for hooks and effects

## Deployment

### Production Build
1. Create production build:
   ```bash
   npm run build
   ```

2. Start production server:
   ```bash
   npm start
   ```

### Environment Configuration
- Set appropriate environment variables
- Configure proper NODE_ENV
- Set up proper CORS settings if needed

## Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and lint checks
5. Submit a pull request

For more information, see the [README.md](./README.md) file.
