"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useTimer } from './TimerContext';
import { useSettings } from './SettingsContext';
import { useAnalytics } from './AnalyticsContext';
import { 
  Achievement, 
  AchievementProgress, 
  AchievementStats,
  achievementTypes 
} from '../types/achievements';

interface AchievementContextType {
  achievements: Achievement[];
  progress: Record<string, AchievementProgress>;
  stats: AchievementStats;
  checkAchievements: () => void;
  getNextAchievement: (typeId: string) => Achievement | null;
  getProgress: (typeId: string) => number;
}

const defaultStats: AchievementStats = {
  totalUnlocked: 0,
  currentStreak: 0,
  longestStreak: 0,
  focusTimeTotal: 0,
  sessionsCompleted: 0,
  dailyGoalsReached: 0
};

const defaultContext: AchievementContextType = {
  achievements: [],
  progress: {},
  stats: defaultStats,
  checkAchievements: () => {},
  getNextAchievement: () => null,
  getProgress: () => 0
};

const AchievementContext = createContext<AchievementContextType>(defaultContext);

export function AchievementProvider({ children }: { children: React.ReactNode }) {
  const { totalFocusTime, completedSessions } = useTimer();
  const { settings } = useSettings();
  const { analyticsData } = useAnalytics();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [progress, setProgress] = useState<Record<string, AchievementProgress>>({});
  const [stats, setStats] = useState<AchievementStats>(defaultStats);

  // Load achievements from localStorage on mount
  useEffect(() => {
    const savedAchievements = localStorage.getItem('achievements');
    const savedProgress = localStorage.getItem('achievementProgress');
    const savedStats = localStorage.getItem('achievementStats');

    if (savedAchievements) {
      setAchievements(JSON.parse(savedAchievements));
    }
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress));
    }
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }
  }, []);

  // Save achievements to localStorage when they change
  useEffect(() => {
    localStorage.setItem('achievements', JSON.stringify(achievements));
    localStorage.setItem('achievementProgress', JSON.stringify(progress));
    localStorage.setItem('achievementStats', JSON.stringify(stats));
  }, [achievements, progress, stats]);

  const unlockAchievement = useCallback((typeId: string, tier: number) => {
    const type = achievementTypes[typeId];
    if (!type) return;

    const tierData = type.tiers[tier - 1];
    if (!tierData) return;

    const newAchievement: Achievement = {
      id: `${typeId}-${tier}-${Date.now()}`,
      typeId,
      name: `${type.title} ${tier}`,
      description: type.description,
      tier,
      unlockedAt: new Date().toISOString(),
      icon: type.icon,
      reward: tierData.reward
    };

    setAchievements(prev => [...prev, newAchievement]);
    setStats(prev => ({
      ...prev,
      totalUnlocked: prev.totalUnlocked + 1
    }));

    // Show notification
    if (settings.notificationsEnabled) {
      new Notification('Achievement Unlocked! 🏆', {
        body: `${newAchievement.name}\n${newAchievement.reward}`,
        icon: '/achievements/${newAchievement.icon}.png'
      });
    }

    // Play sound if enabled
    if (settings.soundEnabled) {
      const audio = new Audio('/sounds/achievement.mp3');
      audio.volume = settings.volume; // Volume is already between 0-1
      audio.play();
    }
  }, [settings]);

  const checkAchievements = useCallback(() => {
    // Check Focus Master achievements
    const focusHours = totalFocusTime / 3600;
    achievementTypes.focusMaster.tiers.forEach(tier => {
      const hoursRequired = tier.requirement / 3600;
      if (focusHours >= hoursRequired) {
        const currentProgress = progress.focusMaster?.currentTier || 0;
        if (tier.level > currentProgress) {
          unlockAchievement('focusMaster', tier.level);
          setProgress(prev => ({
            ...prev,
            focusMaster: {
              typeId: 'focusMaster',
              currentTier: tier.level,
              progress: focusHours
            }
          }));
        }
      }
    });

    // Check Streak Champion achievements
    const currentStreak = analyticsData.dailyStats.reduce((streak, stat) => {
      if (stat.metrics.completedSessions > 0) return streak + 1;
      return 0;
    }, 0);

    achievementTypes.streakChampion.tiers.forEach(tier => {
      if (currentStreak >= tier.requirement) {
        const currentProgress = progress.streakChampion?.currentTier || 0;
        if (tier.level > currentProgress) {
          unlockAchievement('streakChampion', tier.level);
          setProgress(prev => ({
            ...prev,
            streakChampion: {
              typeId: 'streakChampion',
              currentTier: tier.level,
              progress: currentStreak
            }
          }));
        }
      }
    });

    // Check Consistency King achievements
    const totalSessions = completedSessions;
    achievementTypes.consistencyKing.tiers.forEach(tier => {
      if (totalSessions >= tier.requirement) {
        const currentProgress = progress.consistencyKing?.currentTier || 0;
        if (tier.level > currentProgress) {
          unlockAchievement('consistencyKing', tier.level);
          setProgress(prev => ({
            ...prev,
            consistencyKing: {
              typeId: 'consistencyKing',
              currentTier: tier.level,
              progress: totalSessions
            }
          }));
        }
      }
    });

    // Update stats
    setStats(prev => ({
      ...prev,
      currentStreak,
      longestStreak: Math.max(prev.longestStreak, currentStreak),
      focusTimeTotal: totalFocusTime,
      sessionsCompleted: completedSessions
    }));
  }, [totalFocusTime, completedSessions, analyticsData, progress, unlockAchievement]);

  // Check achievements whenever relevant data changes
  useEffect(() => {
    checkAchievements();
  }, [checkAchievements, totalFocusTime, completedSessions]);

  const getNextAchievement = useCallback((typeId: string): Achievement | null => {
    const type = achievementTypes[typeId];
    if (!type) return null;

    const currentProgress = progress[typeId]?.currentTier || 0;
    const nextTier = type.tiers.find(tier => tier.level > currentProgress);
    if (!nextTier) return null;

    return {
      id: `next-${typeId}-${nextTier.level}`,
      typeId,
      name: `${type.title} ${nextTier.level}`,
      description: type.description,
      tier: nextTier.level,
      unlockedAt: '',
      icon: type.icon,
      reward: nextTier.reward
    };
  }, [progress]);

  const getProgress = useCallback((typeId: string): number => {
    const type = achievementTypes[typeId];
    if (!type) return 0;

    const currentProgress = progress[typeId]?.progress || 0;
    const currentTier = progress[typeId]?.currentTier || 0;
    const nextTier = type.tiers.find(tier => tier.level > currentTier);
    if (!nextTier) return 100;

    return Math.min(100, (currentProgress / nextTier.requirement) * 100);
  }, [progress]);

  return (
    <AchievementContext.Provider value={{
      achievements,
      progress,
      stats,
      checkAchievements,
      getNextAchievement,
      getProgress
    }}>
      {children}
    </AchievementContext.Provider>
  );
}

export function useAchievements() {
  const context = useContext(AchievementContext);
  if (!context) {
    throw new Error('useAchievements must be used within an AchievementProvider');
  }
  return context;
}
