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
  Star,
  LucideIcon
} from 'lucide-react';
import { Achievement } from '../../types/achievements';
import { useAchievements } from '../../context/AchievementContext';

/**
 * Interface for AchievementCard component props
 * @interface AchievementCardProps
 * @property {string} typeId - Unique identifier for the achievement type
 * @property {Achievement} [achievement] - Achievement data if already earned
 * @property {LucideIcon} [icon] - Icon component to display for the achievement
 * @property {number} [progress] - Current progress towards the achievement (0-100)
 */
interface AchievementCardProps {
  typeId: string;
  achievement?: Achievement;
  icon?: LucideIcon;
  progress?: number;
}

/**
 * Mapping of achievement types to their corresponding Lucide icons
 * @constant
 */
const icons: Record<string, LucideIcon> = {
  target: Target,
  flame: Flame,
  crown: Crown,
  coffee: Coffee,
  "trending-up": TrendingUp,
  trophy: Trophy
};

/**
 * AchievementCard Component
 * 
 * A card component that displays achievement information and progress.
 * Supports both earned and in-progress achievements with visual feedback.
 * 
 * Features:
 * - Visual representation of achievement status
 * - Progress bar for incomplete achievements
 * - Dynamic icon display based on achievement type
 * - Animated progress indicators
 * - Responsive design with proper spacing
 * 
 * Visual States:
 * - Earned: Shows completion status with trophy icon
 * - In Progress: Displays current progress with progress bar
 * - Locked: Indicates requirements for unlocking
 * 
 * @component
 * @param {AchievementCardProps} props - Component props
 * @param {string} props.typeId - Unique identifier for the achievement type
 * @param {Achievement} [props.achievement] - Achievement data if already earned
 * @param {LucideIcon} [props.icon] - Icon component to display
 * @param {number} [props.progress] - Current progress towards achievement
 * @returns {JSX.Element} Rendered AchievementCard component
 * 
 * @example
 * ```tsx
 * <AchievementCard
 *   typeId="daily_streak"
 *   achievement={userAchievement}
 *   icon={Flame}
 *   progress={75}
 * />
 * ```
 */
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
