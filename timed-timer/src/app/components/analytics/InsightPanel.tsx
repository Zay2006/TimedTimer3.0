"use client";

import React from 'react';
import { Card, CardContent } from "../ui/card";
import { useAnalytics } from '../../context/AnalyticsContext';
import { Brain, TrendingUp, Award } from 'lucide-react';
import { TimeRange, FocusPattern } from '../../types/analytics';

interface InsightPanelProps {
  timeRange: TimeRange;
}

export function InsightPanel({ timeRange }: InsightPanelProps) {
  const { analyticsData, getFocusPatterns } = useAnalytics();

  const patterns = getFocusPatterns(timeRange);

  const mostProductiveTime = patterns.reduce((best, current) => 
    current.productivity > best.productivity ? current : best
  , patterns[0]);

  const generateInsights = () => {
    const insights: { icon: React.ReactNode; title: string; description: string }[] = [];

    // Add productivity time insight
    if (mostProductiveTime) {
      insights.push({
        icon: <Brain className="w-5 h-5 text-blue-500" />,
        title: "Peak Productivity Time",
        description: `You're most productive during ${mostProductiveTime.timeOfDay}`
      });
    }

    // Analyze consistency
    const recentStats = analyticsData.dailyStats
      .filter(stat => {
        const date = new Date(stat.date);
        return date >= timeRange.start && date <= timeRange.end;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (recentStats.length >= 2) {
      const trend = recentStats[0].metrics.productivityScore - recentStats[1].metrics.productivityScore;
      insights.push({
        icon: trend >= 0 
          ? <TrendingUp className="w-5 h-5 text-green-500" />
          : <TrendingUp className="w-5 h-5 text-red-500 rotate-180" />,
        title: "Productivity Trend",
        description: trend >= 0 
          ? "Your productivity is improving! Keep up the good work!"
          : "Your productivity has slightly decreased. Consider adjusting your schedule."
      });
    }

    // Session completion rate
    const completionRate = recentStats.reduce((sum, stat) => 
      sum + stat.metrics.completedSessions, 0) / recentStats.length;

    insights.push({
      icon: <Award className="w-5 h-5 text-purple-500" />,
      title: "Session Completion",
      description: completionRate >= 4
        ? "Great job maintaining consistent focus sessions!"
        : "Try to complete more focus sessions to build momentum."
    });

    // Weekly progress
    const weeklyProgress = analyticsData.weeklyStats
      .filter(stat => new Date(stat.weekStart) >= timeRange.start)
      .sort((a, b) => new Date(b.weekStart).getTime() - new Date(a.weekStart).getTime());

    if (weeklyProgress.length >= 1) {
      insights.push({
        icon: <Award className="w-5 h-5 text-orange-500" />,
        title: "Weekly Progress",
        description: `You've completed ${weeklyProgress[0].metrics.completedSessions} sessions this week`
      });
    }

    // Achievement progress
    const achievements = recentStats.reduce((sum, stat) => 
      sum + stat.metrics.achievements, 0);

    if (achievements > 0) {
      insights.push({
        icon: <Award className="w-5 h-5 text-yellow-500" />,
        title: "Achievements",
        description: `You've earned ${achievements} achievements in this period!`
      });
    }

    return insights;
  };

  const insights = generateInsights();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {insights.map((insight, index) => (
        <Card key={index}>
          <CardContent className="p-4">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                {insight.icon}
              </div>
              <div>
                <h3 className="font-medium">{insight.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {insight.description}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
