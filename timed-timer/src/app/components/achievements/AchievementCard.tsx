"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import { 
  Trophy,
  Target,
  Flame,
  Crown,
  Coffee,
  TrendingUp,
  Icon,
  Star,
  LucideIcon
} from 'lucide-react';
import { Achievement } from '../../types/achievements';
import { useAchievements } from '../../context/AchievementContext';

interface AchievementCardProps {
  typeId: string;
  achievement: Achievement;
  icon?: LucideIcon;
  progress?: number;
}

const icons: Record<string, LucideIcon> = {
  target: Target,
  flame: Flame,
  crown: Crown,
  coffee: Coffee,
  "trending-up": TrendingUp,
  trophy: Trophy
};

export function AchievementCard({ typeId, achievement, icon, progress }: AchievementCardProps) {
  const { achievements, getNextAchievement, getProgress } = useAchievements();
  
  const latestAchievement = achievements
    .filter(a => a.typeId === typeId)
    .sort((a, b) => b.tier - a.tier)[0];

  const nextAchievement = getNextAchievement(typeId);
  const progressValue = progress !== undefined ? progress : getProgress(typeId);

  const IconComponent = icon 
    ? icon 
    : latestAchievement 
      ? icons[latestAchievement.icon] 
      : nextAchievement 
        ? icons[nextAchievement.icon]
        : Trophy;

  return (
    <Card className="relative overflow-hidden">
      {latestAchievement && (
        <div className="absolute top-2 right-2">
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">
            {latestAchievement.tier}
          </div>
        </div>
      )}
      <CardHeader className="space-y-1">
        <div className="flex items-start space-x-4">
          <div className="p-2 rounded-lg bg-muted">
            <IconComponent className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-sm font-medium">
              {latestAchievement?.name || nextAchievement?.name}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {latestAchievement?.description || nextAchievement?.description}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {latestAchievement && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Unlocked</span>
              <span>{new Date(latestAchievement.unlockedAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Reward</span>
              <span>{latestAchievement.reward}</span>
            </div>
          </div>
        )}
        {!latestAchievement && nextAchievement && progressValue !== undefined && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Next Reward</span>
              <span>{nextAchievement.reward}</span>
            </div>
            <Progress value={progressValue} className="h-2" />
            <p className="text-xs text-muted-foreground text-center">
              {Math.round(progressValue)}% Complete
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
