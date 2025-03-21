"use client";

import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { useAnalytics } from '@/app/context/AnalyticsContext';
import { TimeRange } from '@/app/types/analytics';

interface ComparisonChartProps {
  timeRange: TimeRange;
}

export function ComparisonChart({ timeRange }: ComparisonChartProps) {
  const { analyticsData } = useAnalytics();

  const chartData = useMemo(() => {
    // Calculate the previous period for comparison
    const periodLength = timeRange.end.getTime() - timeRange.start.getTime();
    const previousPeriodStart = new Date(timeRange.start.getTime() - periodLength);
    const previousPeriodEnd = new Date(timeRange.start);

    // Get data for current period
    const currentPeriodData = analyticsData.dailyStats
      .filter(stat => {
        const date = new Date(stat.date);
        return date >= timeRange.start && date <= timeRange.end;
      });

    // Get data for previous period
    const previousPeriodData = analyticsData.dailyStats
      .filter(stat => {
        const date = new Date(stat.date);
        return date >= previousPeriodStart && date < previousPeriodEnd;
      });

    // Calculate averages for both periods
    const calculateAverages = (data: typeof currentPeriodData) => ({
      avgScore: data.reduce((sum, stat) => sum + stat.metrics.score, 0) / (data.length || 1),
      avgFocusHours: data.reduce((sum, stat) => sum + stat.metrics.focusTime / 3600, 0) / (data.length || 1),
      avgSessions: data.reduce((sum, stat) => sum + stat.metrics.completedSessions, 0) / (data.length || 1)
    });

    const currentAverages = calculateAverages(currentPeriodData);
    const previousAverages = calculateAverages(previousPeriodData);

    return [
      {
        metric: 'Productivity Score',
        current: Math.round(currentAverages.avgScore),
        previous: Math.round(previousAverages.avgScore)
      },
      {
        metric: 'Focus Hours',
        current: +currentAverages.avgFocusHours.toFixed(1),
        previous: +previousAverages.avgFocusHours.toFixed(1)
      },
      {
        metric: 'Sessions',
        current: +currentAverages.avgSessions.toFixed(1),
        previous: +previousAverages.avgSessions.toFixed(1)
      }
    ];
  }, [analyticsData, timeRange]);

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer>
        <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="metric" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar 
            dataKey="current" 
            fill="#8884d8" 
            name="Current Period"
          />
          <Bar 
            dataKey="previous" 
            fill="#82ca9d" 
            name="Previous Period"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
