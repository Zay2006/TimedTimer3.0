"use client";

import React from 'react';
import { AchievementList } from '../components/achievements/AchievementList';
import { ProgressTracker } from '../components/achievements/ProgressTracker';

export default function AchievementsPage() {
  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Achievements</h1>
        <p className="text-muted-foreground">
          Track your progress and unlock rewards as you build better focus habits.
        </p>
      </div>
      
      <ProgressTracker />
      
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Your Achievements</h2>
        <AchievementList />
      </div>
    </div>
  );
}
