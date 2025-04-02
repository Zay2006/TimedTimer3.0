"use client";

import React from 'react';
import { useAchievements } from '../../context/AchievementContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { AchievementCard } from './AchievementCard';
import { Achievement, achievementTypes } from '../../types/achievements';

/**
 * AchievementList Component
 * 
 * A tabbed interface that displays user achievements categorized by type.
 * Shows both earned achievements and progress towards upcoming achievements.
 * 
 * Features:
 * - Categorized achievement display using tabs
 * - Dynamic achievement card rendering
 * - Progress tracking for upcoming achievements
 * - Integration with achievement context for state management
 * - Responsive grid layout for achievement cards
 * 
 * Implementation Details:
 * - Uses shadcn/ui Tabs component for category navigation
 * - Renders AchievementCard components for each achievement
 * - Handles both earned and upcoming achievement states
 * - Automatically updates when new achievements are earned
 * 
 * @component
 * @returns {JSX.Element} Rendered AchievementList component
 * 
 * @example
 * ```tsx
 * <AchievementList />
 * ```
 */
export function AchievementList() {
  const { achievements, getNextAchievement } = useAchievements();

  /**
   * Renders an achievement card for a specific achievement type
   * @param {string} typeId - The type ID of the achievement
   * @returns {JSX.Element | null} The rendered achievement card or null if no achievement exists
   */
  const renderAchievementCard = (typeId: string) => {
    const achievement = achievements.find(a => a.typeId === typeId);
    const nextAchievement = getNextAchievement(typeId);
    
    if (!achievement && !nextAchievement) {
      return null;
    }

    return (
      <AchievementCard
        key={typeId}
        typeId={typeId}
        achievement={achievement || nextAchievement!}
      />
    );
  };

  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="unlocked">Unlocked</TabsTrigger>
        <TabsTrigger value="progress">In Progress</TabsTrigger>
        <TabsTrigger value="locked">Locked</TabsTrigger>
      </TabsList>

      <TabsContent value="all" className="mt-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Object.keys(achievementTypes).map((typeId) => renderAchievementCard(typeId))}
        </div>
      </TabsContent>

      <TabsContent value="unlocked" className="mt-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Object.keys(achievementTypes).map((typeId) => renderAchievementCard(typeId))}
        </div>
      </TabsContent>

      <TabsContent value="progress" className="mt-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Object.keys(achievementTypes).map((typeId) => renderAchievementCard(typeId))}
        </div>
      </TabsContent>

      <TabsContent value="locked" className="mt-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Object.keys(achievementTypes).map((typeId) => renderAchievementCard(typeId))}
        </div>
      </TabsContent>
    </Tabs>
  );
}
