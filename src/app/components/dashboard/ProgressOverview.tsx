"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useAchievements } from '../../context/AchievementContext';
import { useAnalytics } from '../../context/AnalyticsContext';
import { Trophy, Target, Clock, Flame } from 'lucide-react';
import { Progress } from "../ui/progress";

export function ProgressOverview() {
  const { stats, getNextAchievement, getProgress } = useAchievements();
  const { analyticsData } = useAnalytics();

  const nextAchievements = [
    'focusMaster',
    'streakChampion',
    'consistencyKing',
  ].map(typeId => ({
    achievement: getNextAchievement(typeId),
    progress: getProgress(typeId)
  })).filter(item => item.achievement !== null);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const stats_display = [
    {
      title: "Focus Time Today",
      value: formatTime(analyticsData.dailyStats[analyticsData.dailyStats.length - 1]?.metrics.focusTime || 0),
      icon: Clock,
      description: "Today's total focus time"
    },
    {
      title: "Current Streak",
      value: `${stats.currentStreak} days`,
      icon: Flame,
      description: "Keep it going!"
    },
    {
      title: "Achievements",
      value: `${stats.totalUnlocked}`,
      icon: Trophy,
      description: "Total achievements unlocked"
    },
    {
      title: "Sessions Today",
      value: analyticsData.dailyStats[analyticsData.dailyStats.length - 1]?.metrics.completedSessions || 0,
      icon: Target,
      description: "Completed focus sessions today"
    }
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats_display.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {nextAchievements.map(({ achievement, progress }) => (
          <Card key={achievement!.id} className="relative overflow-hidden">
            <div className="absolute top-2 right-2">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold">
                {achievement!.tier}
              </div>
            </div>
            <CardHeader>
              <CardTitle className="text-sm font-medium">{achievement!.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{achievement!.description}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  Reward: {achievement!.reward}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
