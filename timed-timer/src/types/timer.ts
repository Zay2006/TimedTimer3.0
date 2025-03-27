export interface TimerPreset {
  id: string;
  name: string;
  duration: number;
}

export interface Session {
  id: string;
  startTime: string;
  endTime?: string;
  duration: number;
  focusTime: number;
  completed: boolean;
  breaks: {
    startTime: string;
    endTime?: string;
    duration: number;
  }[];
}

export interface DailyGoal {
  completed: boolean;
  focusTime: number;
  target: number;
}

export interface Analytics {
  totalFocusTime: number;
  totalSessions: number;
  completedSessions: number;
  averageFocusTime: number;
  currentStreak: number;
  longestStreak: number;
  bestFocusTime: number;
  completionRate: number;
  dailyGoals: { [date: string]: DailyGoal };
}

export interface TimerData {
  sessions: Session[];
  analytics: Analytics;
}

export interface TimerSettings {
  theme: 'light' | 'dark';
  volume: number;
  notifications: boolean;
  autoStartBreaks: boolean;
  autoStartNextSession: boolean;
  defaultDuration: number;
  defaultBreakDuration: number;
  spotifyEnabled: boolean;
  presets: TimerPreset[];
}

export type TimerState = 'idle' | 'running' | 'paused' | 'break';
