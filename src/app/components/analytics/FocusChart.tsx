"use client";

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useAnalytics } from '../../context/AnalyticsContext';

/**
 * Interface for FocusChart component props
 * @interface FocusChartProps
 * @property {'daily' | 'weekly' | 'monthly'} timeRange - Time range for data aggregation
 */
interface FocusChartProps {
  timeRange: 'daily' | 'weekly' | 'monthly';
}

/**
 * FocusChart Component
 * 
 * A responsive area chart component that visualizes focus session data over time.
 * Displays focus duration trends based on the selected time range (daily, weekly, or monthly).
 * Integrates with the analytics context to fetch and display session data.
 * 
 * Features:
 * - Responsive design that adapts to container width
 * - Smooth area chart visualization
 * - Interactive tooltips showing detailed data points
 * - Customizable time range views
 * - Automatic data aggregation based on time range
 * 
 * @component
 * @param {FocusChartProps} props - Component props
 * @param {'daily' | 'weekly' | 'monthly'} props.timeRange - Time range for data aggregation
 * @returns {JSX.Element} Rendered FocusChart component
 * 
 * @example
 * ```tsx
 * <FocusChart timeRange="weekly" />
 * ```
 */
export function FocusChart({ timeRange }: FocusChartProps) {
  const { analyticsData } = useAnalytics();

  const formatData = () => {
    switch (timeRange) {
      case 'daily':
        return analyticsData.dailyStats.slice(-7).map(stat => ({
          date: new Date(stat.date).toLocaleDateString('en-US', { weekday: 'short' }),
          focusTime: stat.metrics.focusTime / 3600, // Convert to hours
          completedSessions: stat.metrics.completedSessions
        }));
      case 'weekly':
        return analyticsData.weeklyStats.slice(-4).map(stat => ({
          date: `Week ${stat.weekNumber}`,
          focusTime: stat.metrics.focusTime / 3600,
          completedSessions: stat.metrics.completedSessions
        }));
      case 'monthly':
        return analyticsData.monthlyStats.slice(-6).map(stat => ({
          date: new Date(stat.date).toLocaleDateString('en-US', { month: 'short' }),
          focusTime: stat.metrics.focusTime / 3600,
          completedSessions: stat.metrics.completedSessions
        }));
      default:
        return [];
    }
  };

  const data = formatData();

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Focus Time Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" label={{ value: 'Focus Hours', angle: -90, position: 'insideLeft' }} />
              <YAxis yAxisId="right" orientation="right" label={{ value: 'Sessions', angle: 90, position: 'insideRight' }} />
              <Tooltip />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="focusTime"
                stroke="#8884d8"
                fill="#8884d8"
                name="Focus Hours"
              />
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="completedSessions"
                stroke="#82ca9d"
                fill="#82ca9d"
                name="Completed Sessions"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
