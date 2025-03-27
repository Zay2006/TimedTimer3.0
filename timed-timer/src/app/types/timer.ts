export interface Session {
  id: string;
  startTime: string;
  endTime?: string;
  duration: number;
  completed: boolean;
  breaks: number;
  focusTime: number;
}

export interface TimerPreset {
  id: string;
  name: string;
  duration: number;  // in seconds
  breakDuration: number;  // in seconds
  color?: string;  // optional theme color
}

export interface TimerStateType {
  currentTime: number;  // in seconds
  totalTime: number;  // in seconds
  timerState: 'idle' | 'running' | 'paused' | 'break';
  activePresetId: string | null;
  completedSessions: number;
  totalFocusTime: number;  // in seconds
  totalBreakTime: number;  // in seconds
}

export interface AnalyticsConfig {
  metrics: {
    focusScore: {
      factors: string[];
      weights: number[];
    };
    productivity: {
      factors: string[];
      weights: number[];
    };
  };
  timeRanges: {
    daily: {
      intervals: string[];
      aggregation: string;
    };
    weekly: {
      intervals: string[];
      aggregation: string;
    };
    monthly: {
      intervals: string[];
      aggregation: string;
    };
  };
}

export interface TimerSettings {
  soundEnabled: boolean;
  /** Volume level between 0 and 1 */
  volume: number;
  notificationsEnabled: boolean;
  theme: 'light' | 'dark' | 'system';
  presets: TimerPreset[];
  spotifyEnabled: boolean;
  spotifyToken: string | null;
  youtubeEnabled: boolean;
  analyticsConfig: AnalyticsConfig;
  // Timer-specific settings
  defaultDuration: number;
  autoStartBreaks: boolean;
  autoStartNextSession: boolean;
  longBreakInterval: number;  // number of sessions before long break
  longBreakDuration: number;  // in seconds
  showProgressBar: boolean;
  showTimeInTitle: boolean;
}

export interface SessionStats {
  id: string;
  startTime: string;
  endTime: string;
  duration: number;  // in seconds
  breakDuration: number;  // in seconds
  presetId: string | null;
  completed: boolean;
  interrupted: boolean;
}

export interface Analytics {
  totalSessions: number;
  totalFocusTime: number;
  completedSessions: number;
  completionRate: number;
  longestStreak: number;
  currentStreak: number;
  bestFocusTime: number;
  averageFocusTime: number;
  dailyGoals: {
    [date: string]: {
      completed: boolean;
      focusTime: number;
      sessions: number;
    };
  };
}

export interface TimerData {
  sessions: Session[];
  analytics: Analytics;
}
