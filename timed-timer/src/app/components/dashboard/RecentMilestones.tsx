"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useAchievements } from '../../context/AchievementContext';
import { useAnalytics } from '../../context/AnalyticsContext';
import { Trophy, Star, Target, TrendingUp } from 'lucide-react';
import { Achievement } from '../../types/achievements';

type ProductivityMilestone = {
  type: 'productivity';
  date: Date;
  score: number;
  description: string;
};

type StreakMilestone = {
  type: 'streak';
  date: Date;
  tier: number;
  description: string;
};

type AchievementMilestone = {
  type: 'achievement';
  date: Date;
  achievement: Achievement;
};

type Milestone = ProductivityMilestone | StreakMilestone | AchievementMilestone;

export function RecentMilestones() {
  const { achievements } = useAchievements();
  const { analyticsData } = useAnalytics();

  const recentAchievements = achievements
    .sort((a, b) => new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime())
    .slice(0, 5);

  // Get productivity milestones
  const productivityMilestones: ProductivityMilestone[] = analyticsData.dailyStats
    .filter(stat => stat.metrics.productivityScore >= 90)
    .slice(-3)
    .map(stat => ({
      type: 'productivity',
      date: new Date(stat.date),
      score: stat.metrics.productivityScore,
      description: 'Achieved excellent productivity'
    }));

  // Get streak milestones
  const streakMilestones: StreakMilestone[] = achievements
    .filter(a => a.typeId === 'streakChampion')
    .map(a => ({
      type: 'streak',
      date: new Date(a.unlockedAt),
      tier: a.tier,
      description: `Reached ${a.tier === 1 ? '3' : a.tier === 2 ? '7' : '14'} day streak`
    }));

  // Combine and sort all milestones
  const allMilestones: Milestone[] = [
    ...recentAchievements.map((a): AchievementMilestone => ({
      type: 'achievement',
      date: new Date(a.unlockedAt),
      achievement: a
    })),
    ...productivityMilestones,
    ...streakMilestones
  ].sort((a, b) => b.date.getTime() - a.date.getTime())
   .slice(0, 5);

  const getIcon = (type: Milestone['type']) => {
    switch (type) {
      case 'achievement':
        return Trophy;
      case 'productivity':
        return TrendingUp;
      case 'streak':
        return Star;
      default:
        return Target;
    }
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const getMilestoneContent = (milestone: Milestone) => {
    switch (milestone.type) {
      case 'achievement':
        return {
          title: milestone.achievement.name,
          description: milestone.achievement.description
        };
      case 'productivity':
        return {
          title: `${milestone.score}% Productivity Score`,
          description: milestone.description
        };
      case 'streak':
        return {
          title: `Streak Milestone: Tier ${milestone.tier}`,
          description: milestone.description
        };
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Milestones</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {allMilestones.map((milestone, index) => {
            const Icon = getIcon(milestone.type);
            const content = getMilestoneContent(milestone);
            return (
              <div key={index} className="flex items-center space-x-4">
                <div className="p-2 rounded-lg bg-muted">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {content.title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {content.description}
                  </p>
                </div>
                <div className="text-sm text-muted-foreground">
                  {formatDate(milestone.date)}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
