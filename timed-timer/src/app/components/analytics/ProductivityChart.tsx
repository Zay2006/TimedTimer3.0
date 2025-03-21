"use client";

import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { useAnalytics } from '@/app/context/AnalyticsContext';
import { TimeRange } from '@/app/types/analytics';

interface ProductivityChartProps {
  timeRange: TimeRange;
}

export function ProductivityChart({ timeRange }: ProductivityChartProps) {
  const { analyticsData } = useAnalytics();

  const chartData = useMemo(() => {
    return analyticsData.dailyStats
      .filter(stat => {
        const date = new Date(stat.date);
        return date >= timeRange.start && date <= timeRange.end;
      })
      .map(stat => ({
        date: new Date(stat.date).toLocaleDateString(),
        score: Math.round(stat.metrics.score),
        focusHours: +(stat.metrics.focusTime / 3600).toFixed(1),
        sessions: stat.metrics.completedSessions
      }));
  }, [analyticsData, timeRange]);

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="score"
            stroke="#8884d8"
            name="Productivity Score"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="focusHours"
            stroke="#82ca9d"
            name="Focus Hours"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="sessions"
            stroke="#ffc658"
            name="Completed Sessions"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
