export interface TimeRange {
  start: Date;
  end: Date;
}

export interface AnalyticsStats {
  totalFocusTime: number;
  totalSessions: number;
  completedSessions: number;
  averageFocusTime: number;
  bestFocusTime: number;
  completionRate: number;
  currentStreak: number;
  longestStreak: number;
}

export interface DailyStats {
  date: string;
  focusTime: number;
  sessionsCount: number;
  completedCount: number;
  targetMet: boolean;
}

export interface ReportTemplate {
  type: 'summary' | 'detailed' | 'analytics';
  timeRange: TimeRange;
  format: 'pdf' | 'csv' | 'json';
  title?: string;
  description?: string;
  sections?: string[];
}
