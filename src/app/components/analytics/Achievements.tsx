"use client";

import React from 'react';
import { useTimerData } from '../../context/DataContext';
import { Card } from '../ui/card';
import { Trophy, Star, Target, Clock, Zap } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  condition: (data: ReturnType<typeof useTimerData>['data']) => boolean;
}

const achievements: Achievement[] = [
  {
    id: 'first_session',
    title: 'First Focus',
    description: 'Complete your first focus session',
    icon: Star,
    color: 'text-yellow-500',
    condition: (data) => data.analytics.completedSessions > 0,
  },
  {
    id: 'three_day_streak',
    title: 'Getting Focused',
    description: 'Maintain a 3-day focus streak',
    icon: Zap,
    color: 'text-orange-500',
    condition: (data) => data.analytics.currentStreak >= 3,
  },
  {
    id: 'seven_day_streak',
    title: 'Focus Master',
    description: 'Maintain a 7-day focus streak',
    icon: Trophy,
    color: 'text-yellow-600',
    condition: (data) => data.analytics.currentStreak >= 7,
  },
  {
    id: 'thirty_sessions',
    title: 'Focus Champion',
    description: 'Complete 30 focus sessions',
    icon: Target,
    color: 'text-blue-500',
    condition: (data) => data.analytics.completedSessions >= 30,
  },
  {
    id: 'ten_hours',
    title: 'Time Lord',
    description: 'Accumulate 10 hours of focus time',
    icon: Clock,
    color: 'text-purple-500',
    condition: (data) => data.analytics.totalFocusTime >= 36000, // 10 hours in seconds
  },
];

export default function Achievements() {
  const { data } = useTimerData();

  const calculateProgress = (achievement: Achievement) => {
    switch (achievement.id) {
      case 'first_session':
        return data.analytics.completedSessions > 0 ? 100 : 0;
      case 'three_day_streak':
        return Math.min((data.analytics.currentStreak / 3) * 100, 100);
      case 'seven_day_streak':
        return Math.min((data.analytics.currentStreak / 7) * 100, 100);
      case 'thirty_sessions':
        return Math.min((data.analytics.completedSessions / 30) * 100, 100);
      case 'ten_hours':
        return Math.min((data.analytics.totalFocusTime / 36000) * 100, 100);
      default:
        return 0;
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <Trophy className="w-5 h-5 text-primary" />
        Achievements
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {achievements.map((achievement) => {
          const isUnlocked = achievement.condition(data);
          const progress = calculateProgress(achievement);

          return (
            <TooltipProvider key={achievement.id}>
              <Card className={`p-4 ${isUnlocked ? 'bg-accent/10' : ''}`}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-4 cursor-help">
                      <achievement.icon className={`w-8 h-8 ${achievement.color} ${isUnlocked ? 'animate-pulse' : 'opacity-50'}`} />
                      <div className="flex-1">
                        <h3 className="font-semibold">{achievement.title}</h3>
                        <div className="h-1.5 w-full bg-secondary mt-2 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all duration-500"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{achievement.description}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {isUnlocked ? 'Unlocked!' : `${Math.round(progress)}% complete`}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </Card>
            </TooltipProvider>
          );
        })}
      </div>
    </div>
  );
}
