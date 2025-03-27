"use client";

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { Trophy } from "lucide-react";
import { useTimerData } from "../../context/DataContext";
import { Card } from "../ui/card";

export default function AchievementsDialog() {
  const { data } = useTimerData();

  const achievements = [
    {
      title: "Focus Master",
      description: "Complete 10 focus sessions",
      progress: Math.min(data.analytics.completedSessions / 10, 1) * 100,
      unlocked: data.analytics.completedSessions >= 10,
    },
    {
      title: "Streak Champion",
      description: "Maintain a 5-day streak",
      progress: Math.min(data.analytics.longestStreak / 5, 1) * 100,
      unlocked: data.analytics.longestStreak >= 5,
    },
    {
      title: "Time Lord",
      description: "Accumulate 10 hours of focus time",
      progress: Math.min(data.analytics.totalFocusTime / (10 * 3600), 1) * 100,
      unlocked: data.analytics.totalFocusTime >= 10 * 3600,
    },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="h-9 w-9">
          <Trophy className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Achievements
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {achievements.map((achievement) => (
            <Card key={achievement.title} className={`p-4 ${achievement.unlocked ? 'bg-primary/10' : ''}`}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{achievement.title}</h3>
                  <p className="text-sm text-muted-foreground">{achievement.description}</p>
                </div>
                {achievement.unlocked && (
                  <Trophy className="h-5 w-5 text-primary" />
                )}
              </div>
              <div className="mt-2 h-2 w-full bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${achievement.progress}%` }}
                />
              </div>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
