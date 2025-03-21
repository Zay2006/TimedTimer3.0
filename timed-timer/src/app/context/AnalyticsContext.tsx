"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';
import { useTimer } from './TimerContext';
import { useSettings } from './SettingsContext';
import { 
  TimeRange, 
  ProductivityMetrics, 
  FocusPattern, 
  ProductivityScore, 
  AnalyticsData 
} from '../types/analytics';

interface AnalyticsContextType {
  analyticsData: AnalyticsData;
  getProductivityScore: (timeRange: TimeRange) => ProductivityScore;
  getFocusPatterns: (timeRange: TimeRange) => FocusPattern[];
  generateReport: (timeRange: TimeRange, templateId: string) => Promise<Blob>;
  exportData: (timeRange: TimeRange, format: 'pdf' | 'csv') => Promise<Blob>;
  updateAnalytics: () => void;
}

const defaultAnalyticsData: AnalyticsData = {
  dailyStats: [],
  weeklyStats: [],
  monthlyStats: [],
  focusPatterns: [],
  productivityScore: {
    score: 0,
    factors: {
      duration: 0,
      consistency: 0,
      completion: 0
    }
  }
};

const defaultContext: AnalyticsContextType = {
  analyticsData: defaultAnalyticsData,
  getProductivityScore: () => defaultAnalyticsData.productivityScore,
  getFocusPatterns: () => [],
  generateReport: async () => new Blob(),
  exportData: async () => new Blob(),
  updateAnalytics: () => {}
};

const AnalyticsContext = createContext<AnalyticsContextType>(defaultContext);

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const { settings } = useSettings();
  const timer = useTimer();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>(defaultAnalyticsData);

  const calculateProductivityScore = (focusTime: number, completedSessions: number, consistency: number): number => {
    const weights = settings.analyticsConfig?.metrics.focusScore.weights || [0.4, 0.3, 0.3];
    const durationScore = Math.min(focusTime / (4 * 60 * 60), 1); // Max 4 hours per day
    const completionScore = Math.min(completedSessions / 8, 1); // Max 8 sessions per day
    const consistencyScore = consistency;

    return (
      durationScore * weights[0] +
      completionScore * weights[1] +
      consistencyScore * weights[2]
    ) * 100;
  };

  const getProductivityScore = useCallback((timeRange: TimeRange): ProductivityScore => {
    const relevantStats = analyticsData.dailyStats.filter(stat => {
      const date = new Date(stat.date);
      return date >= timeRange.start && date <= timeRange.end;
    });

    const totalFocusTime = relevantStats.reduce((sum, stat) => sum + stat.metrics.focusTime, 0);
    const totalSessions = relevantStats.reduce((sum, stat) => sum + stat.metrics.completedSessions, 0);
    
    // Calculate consistency based on daily activity
    const daysWithActivity = new Set(relevantStats.map(stat => stat.date)).size;
    const totalDays = Math.ceil((timeRange.end.getTime() - timeRange.start.getTime()) / (1000 * 60 * 60 * 24));
    const consistency = daysWithActivity / totalDays;

    const score = calculateProductivityScore(totalFocusTime, totalSessions, consistency);

    return {
      score,
      factors: {
        duration: totalFocusTime / (totalDays * 4 * 60 * 60), // Normalized to 4 hours per day
        consistency,
        completion: totalSessions / (totalDays * 8) // Normalized to 8 sessions per day
      }
    };
  }, [analyticsData, settings]);

  const getFocusPatterns = useCallback((timeRange: TimeRange): FocusPattern[] => {
    const relevantStats = analyticsData.dailyStats.filter(stat => {
      const date = new Date(stat.date);
      return date >= timeRange.start && date <= timeRange.end;
    });

    const patterns: Record<string, { totalProductivity: number; count: number }> = {
      'Morning (6-12)': { totalProductivity: 0, count: 0 },
      'Afternoon (12-18)': { totalProductivity: 0, count: 0 },
      'Evening (18-24)': { totalProductivity: 0, count: 0 },
      'Night (0-6)': { totalProductivity: 0, count: 0 }
    };

    relevantStats.forEach(stat => {
      // Implementation would analyze session timestamps and aggregate data
      // This is a simplified version
      Object.keys(patterns).forEach(timeOfDay => {
        patterns[timeOfDay].totalProductivity += stat.metrics.score;
        patterns[timeOfDay].count++;
      });
    });

    return Object.entries(patterns).map(([timeOfDay, data]) => ({
      timeOfDay,
      productivity: data.count > 0 ? data.totalProductivity / data.count : 0,
      frequency: data.count
    }));
  }, [analyticsData]);

  const generateReport = useCallback(async (timeRange: TimeRange, templateId: string): Promise<Blob> => {
    // Implementation would use react-pdf to generate PDF reports
    // This is a placeholder that returns an empty blob
    return new Blob(['Report data'], { type: 'application/pdf' });
  }, []);

  const exportData = useCallback(async (timeRange: TimeRange, format: 'pdf' | 'csv'): Promise<Blob> => {
    const relevantData = {
      dailyStats: analyticsData.dailyStats.filter(stat => {
        const date = new Date(stat.date);
        return date >= timeRange.start && date <= timeRange.end;
      }),
      productivityScore: getProductivityScore(timeRange),
      focusPatterns: getFocusPatterns(timeRange)
    };

    if (format === 'csv') {
      // Convert data to CSV format
      const csvContent = 'Date,Focus Time,Break Time,Completed Sessions,Score\n' +
        relevantData.dailyStats.map(stat => 
          `${stat.date},${stat.metrics.focusTime},${stat.metrics.breakTime},${stat.metrics.completedSessions},${stat.metrics.score}`
        ).join('\n');
      return new Blob([csvContent], { type: 'text/csv' });
    } else {
      // Generate PDF report
      return generateReport(timeRange, 'default');
    }
  }, [analyticsData, getProductivityScore, getFocusPatterns, generateReport]);

  const updateAnalytics = useCallback(() => {
    // This would be called whenever timer state changes
    const today = new Date().toISOString().split('T')[0];
    const todayStats = analyticsData.dailyStats.find(stat => stat.date === today);

    const newMetrics: ProductivityMetrics = {
      focusTime: timer.totalFocusTime,
      breakTime: timer.totalBreakTime,
      completedSessions: timer.completedSessions,
      achievements: 0, // Would be updated from achievements system
      score: calculateProductivityScore(
        timer.totalFocusTime,
        timer.completedSessions,
        1 // Today's consistency is always 1
      )
    };

    if (todayStats) {
      setAnalyticsData(prev => ({
        ...prev,
        dailyStats: prev.dailyStats.map(stat =>
          stat.date === today ? { ...stat, metrics: newMetrics } : stat
        )
      }));
    } else {
      setAnalyticsData(prev => ({
        ...prev,
        dailyStats: [...prev.dailyStats, { date: today, metrics: newMetrics }]
      }));
    }
  }, [timer, analyticsData]);

  return (
    <AnalyticsContext.Provider value={{
      analyticsData,
      getProductivityScore,
      getFocusPatterns,
      generateReport,
      exportData,
      updateAnalytics
    }}>
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalytics() {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
}
