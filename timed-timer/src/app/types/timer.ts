import type { Achievement, AchievementProgress, AchievementStats } from './achievements';

export interface Session {
  id: string;
  startTime: string;
  endTime?: string;
  duration: number;
  completed: boolean;
  interrupted: boolean;
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

export interface TimerContextType {
  currentSession: Session | null;
  totalFocusTime: number;
  completedSessions: number;
  startTimer: (duration: number) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
  addBreak: () => void;
  isRunning: boolean;
  isPaused: boolean;
  timeLeft: number;
  progress: number;
}

export interface ProductivityMetrics {
  completedSessions: number;
  interrupted: boolean;
  focusTime: number;
  breaks: number;
  achievements: number;
  productivityScore: number;
  targetSessions: number;
}

export interface DailyStats {
  date: string;
  metrics: ProductivityMetrics;
}

export interface WeeklyStats {
  weekStart: string;
  weekEnd: string;
  metrics: ProductivityMetrics;
}

export interface MonthlyStats {
  monthStart: string;
  monthEnd: string;
  metrics: ProductivityMetrics;
}

export interface Analytics {
  dailyStats: DailyStats[];
  weeklyStats: WeeklyStats[];
  monthlyStats: MonthlyStats[];
  totalFocusTime: number;
  totalSessions: number;
  averageSessionLength: number;
  completionRate: number;
  productivityScore: number;
}

export interface TimerData {
  sessions: Session[];
  analytics: Analytics;
  achievements: Achievement[];
  achievementProgress: Record<string, AchievementProgress>;
  achievementStats: AchievementStats;
}

export * from './achievements';
