"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAchievements } from '@/app/context/AchievementContext';
import { Trophy, Flame, Clock, Target } from 'lucide-react';

/**
 * ProgressTracker Component
 * 
 * A dashboard component that displays overall achievement progress and key statistics.
 * Provides a quick overview of the user's accomplishments and current status.
 * 
 * Features:
 * - Overall achievement statistics
 * - Focus time tracking
 * - Streak monitoring
 * - Visual indicators with icons
 * - Responsive grid layout
 * 
 * Statistics Displayed:
 * - Total achievements unlocked
 * - Current streak
 * - Total focus time
 * - Sessions completed
 * 
 * @component
 * @returns {JSX.Element} Rendered ProgressTracker component
 * 
 * @example
 * ```tsx
 * <ProgressTracker />
 * ```
 */
export function ProgressTracker() {
  const { stats, achievements } = useAchievements();

  /**
   * Formats seconds into a human-readable time string
   * @param {number} seconds - Total seconds to format
   * @returns {string} Formatted time string in "Xh Ym" format
   */
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  /**
   * Array of statistics to display in the tracker
   * Each stat includes title, value, and associated icon
   * @constant
   */
  const stats_display = [
    {
      title: "Total Achievements",
      value: stats.totalUnlocked,
      icon: Trophy,
      description: "Unlocked achievements"
    },
    {
      title: "Current Streak",
      value: `${stats.currentStreak} days`,
      icon: Flame,
      description: "Consecutive days with focus sessions"
    },
    {
      title: "Total Focus Time",
      value: formatTime(stats.focusTimeTotal),
      icon: Clock,
      description: "Time spent focusing"
    },
    {
      title: "Sessions Completed",
      value: stats.sessionsCompleted,
      icon: Target,
      description: "Total completed focus sessions"
    }
  ];

  /**
   * Retrieves the 3 most recent achievements
   * @type {Array} Recent achievements
   */
  const recentAchievements = achievements
    .sort((a, b) => new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime())
    .slice(0, 3);

  return (
    <div className="space-y-6">
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

      {recentAchievements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAchievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="flex items-center space-x-4"
                >
                  <div className="p-2 rounded-lg bg-muted">
                    <Trophy className="h-4 w-4" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {achievement.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(achievement.unlockedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {achievement.reward}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
