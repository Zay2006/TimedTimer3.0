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
```
