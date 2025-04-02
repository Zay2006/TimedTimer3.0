"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useAnalytics } from '../../context/AnalyticsContext';
import { useAchievements } from '../../context/AchievementContext';
import { Clock, Target, Trophy, TrendingUp } from 'lucide-react';

export function StatsSummary() {
  const { analyticsData } = useAnalytics();
  const { stats } = useAchievements();

  // Calculate daily averages
  const dailyStats = analyticsData.dailyStats;
  const totalDays = dailyStats.length;
  const averageFocusTime = totalDays > 0 
    ? dailyStats.reduce((acc, day) => acc + day.metrics.focusTime, 0) / totalDays 
    : 0;
  const averageProductivity = totalDays > 0
    ? dailyStats.reduce((acc, day) => acc + day.metrics.productivityScore, 0) / totalDays
    : 0;

  const summaryItems = [
    {
      title: "Average Focus Time",
      value: `${Math.floor(averageFocusTime / 3600)}h ${Math.floor((averageFocusTime % 3600) / 60)}m`,
      description: "Daily average focus time",
      icon: Clock,
      change: "+12%",
      trend: "up"
    },
    {
      title: "Productivity Score",
      value: `${Math.round(averageProductivity)}%`,
      description: "Average daily score",
      icon: TrendingUp,
      change: "+5%",
      trend: "up"
    },
    {
      title: "Achievement Rate",
      value: `${Math.round((stats.totalUnlocked / Object.keys(stats).length) * 100)}%`,
      description: "Achievements unlocked",
      icon: Trophy,
      change: "+3",
      trend: "up"
    },
    {
      title: "Session Completion",
      value: `${Math.round((stats.sessionsCompleted / (stats.sessionsCompleted + dailyStats.reduce((acc, day) => acc + day.metrics.incompleteSessions, 0))) * 100)}%`,
      description: "Sessions completed successfully",
      icon: Target,
      change: "+8%",
      trend: "up"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {summaryItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {item.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.value}</div>
              <p className="text-xs text-muted-foreground">
                {item.description}
              </p>
              <div className={`text-xs ${
                item.trend === "up" 
                  ? "text-green-500" 
                  : "text-red-500"
              }`}>
                {item.change}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
