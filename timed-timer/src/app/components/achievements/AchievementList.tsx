"use client";

import React from 'react';
import { useAchievements } from '../../context/AchievementContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { AchievementCard } from './AchievementCard';
import { Achievement, achievementTypes } from '../../types/achievements';

export function AchievementList() {
  const { achievements, getNextAchievement } = useAchievements();

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
