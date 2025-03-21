export interface TimeRange {
  start: Date;
  end: Date;
}

export interface ProductivityMetrics {
  focusTime: number;
  breakTime: number;
  completedSessions: number;
  incompleteSessions: number;
  achievements: number;
  productivityScore: number;
}

export interface FocusPattern {
  timeOfDay: string;
  productivity: number;
  frequency: number;
}

export interface ProductivityScore {
  score: number;
  factors: {
    duration: number;
    consistency: number;
    completion: number;
  };
}

export interface DailyStat {
  date: string;
  metrics: ProductivityMetrics;
}

export interface WeeklyStat {
  weekStart: string;
  weekNumber: number;
  metrics: ProductivityMetrics;
}

export interface MonthlyStat {
  month: string;
  date: string;
  metrics: ProductivityMetrics;
}

export interface AnalyticsData {
  dailyStats: DailyStat[];
  weeklyStats: WeeklyStat[];
  monthlyStats: MonthlyStat[];
  focusPatterns: FocusPattern[];
  productivityScore: ProductivityScore;
}

export interface AnalyticsConfig {
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
}

export interface ReportTemplate {
  id: string;
  name: string;
  sections: {
    type: 'chart' | 'table' | 'summary';
    title: string;
    data: keyof AnalyticsData;
    options?: Record<string, any>;
  }[];
}
