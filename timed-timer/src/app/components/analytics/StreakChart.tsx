"use client";

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useAnalytics } from '../../context/AnalyticsContext';
import { useAchievements } from '../../context/AchievementContext';

export function StreakChart() {
  const { analyticsData } = useAnalytics();
  const { stats } = useAchievements();

  const data = analyticsData.dailyStats.slice(-14).map(stat => ({
    date: new Date(stat.date).toLocaleDateString('en-US', { weekday: 'short' }),
    focusHours: stat.metrics.focusTime / 3600,
    completedSessions: stat.metrics.completedSessions,
    productivity: stat.metrics.productivityScore
  }));

  return (
    <Card className="col-span-3">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Streak Analysis</CardTitle>
        <div className="text-sm text-muted-foreground">
          Current Streak: {stats.currentStreak} days
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
              <Tooltip />
              <Bar yAxisId="left" dataKey="focusHours" fill="#8884d8" name="Focus Hours" />
              <Bar yAxisId="right" dataKey="productivity" fill="#82ca9d" name="Productivity Score" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Longest Streak</span>
            <span className="font-medium">{stats.longestStreak} days</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Average Sessions/Day</span>
            <span className="font-medium">
              {(stats.sessionsCompleted / analyticsData.dailyStats.length).toFixed(1)}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total Focus Time</span>
            <span className="font-medium">
              {Math.floor(stats.focusTimeTotal / 3600)}h {Math.floor((stats.focusTimeTotal % 3600) / 60)}m
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
