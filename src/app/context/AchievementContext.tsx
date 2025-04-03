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
import { ProductivityMetrics, DailyStat } from '../types/analytics';

interface AchievementContextType {
  achievements: Achievement[];
  progress: Record<string, AchievementProgress>;
  stats: AchievementStats;
  checkAchievements: () => void;
  getNextAchievement: (typeId: string) => Achievement | null;
  getProgress: (typeId: string) => number;
  getRecentAchievements: (count?: number) => Achievement[];
  getCategoryProgress: (category: string) => number;
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
  getProgress: () => 0,
  getRecentAchievements: () => [],
  getCategoryProgress: () => 0
};

const AchievementContext = createContext<AchievementContextType>(defaultContext);

export function AchievementProvider({ children }: { children: React.ReactNode }) {
  const { totalFocusTime, completedSessions, currentSession } = useTimer();
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
        icon: `/achievements/${newAchievement.icon}.png`
      });
    }

    // Play achievement sound if enabled
    if (settings.soundEnabled) {
      const audio = new Audio('/Good Job.mp3');
      audio.volume = settings.volume;
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

    // Check time-based achievements
    const currentHour = new Date().getHours();
    if (currentHour >= 5 && currentHour <= 9) {
      // Early Bird achievement
      const earlyBirdSessions = analyticsData.dailyStats
        .filter(stat => {
          const sessionHour = new Date(stat.date).getHours();
          return sessionHour >= 5 && sessionHour <= 9;
        }).length;

      achievementTypes.earlyBird.tiers.forEach(tier => {
        if (earlyBirdSessions >= tier.requirement) {
          const currentProgress = progress.earlyBird?.currentTier || 0;
          if (tier.level > currentProgress) {
            unlockAchievement('earlyBird', tier.level);
          }
        }
      });
    } else if (currentHour >= 22 || currentHour <= 4) {
      // Night Owl achievement
      const nightOwlSessions = analyticsData.dailyStats
        .filter(stat => {
          const sessionHour = new Date(stat.date).getHours();
          return sessionHour >= 22 || sessionHour <= 4;
        }).length;

      achievementTypes.nightOwl.tiers.forEach(tier => {
        if (nightOwlSessions >= tier.requirement) {
          const currentProgress = progress.nightOwl?.currentTier || 0;
          if (tier.level > currentProgress) {
            unlockAchievement('nightOwl', tier.level);
          }
        }
      });
    }

    // Check Weekend Warrior achievement
    const weekendSessions = analyticsData.dailyStats
      .filter(stat => {
        const day = new Date(stat.date).getDay();
        return day === 0 || day === 6; // Sunday or Saturday
      }).length;

    achievementTypes.weekendWarrior.tiers.forEach(tier => {
      if (weekendSessions >= tier.requirement) {
        const currentProgress = progress.weekendWarrior?.currentTier || 0;
        if (tier.level > currentProgress) {
          unlockAchievement('weekendWarrior', tier.level);
        }
      }
    });

    // Check Perfect Timer achievement
    if (currentSession?.completed && !currentSession.interrupted) {
      const perfectSessions = analyticsData.dailyStats
        .filter((stat): stat is DailyStat => 
          stat.metrics.completedSessions > 0 && stat.metrics.incompleteSessions === 0
        )
        .length;

      achievementTypes.perfectTimer.tiers.forEach(tier => {
        if (perfectSessions >= tier.requirement) {
          const currentProgress = progress.perfectTimer?.currentTier || 0;
          if (tier.level > currentProgress) {
            unlockAchievement('perfectTimer', tier.level);
          }
        }
      });
    }

    // Update stats
    setStats(prev => ({
      ...prev,
      focusTimeTotal: totalFocusTime,
      sessionsCompleted: completedSessions,
      dailyGoalsReached: Object.values(analyticsData.dailyStats).filter(
        stat => stat.metrics.completedSessions > 0 && stat.metrics.incompleteSessions === 0
      ).length
    }));
  }, [totalFocusTime, completedSessions, analyticsData, progress, unlockAchievement, currentSession]);

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

  const getRecentAchievements = useCallback((count: number = 5): Achievement[] => {
    return achievements
      .sort((a, b) => new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime())
      .slice(0, count);
  }, [achievements]);

  const getCategoryProgress = useCallback((category: string): number => {
    const categoryAchievements = Object.entries(achievementTypes)
      .filter(([_, type]) => type.icon === category)
      .map(([typeId]) => typeId);

    const totalTiers = categoryAchievements.reduce((sum, typeId) => 
      sum + achievementTypes[typeId].tiers.length, 0);

    const unlockedTiers = categoryAchievements.reduce((sum, typeId) => 
      sum + (progress[typeId]?.currentTier || 0), 0);

    return totalTiers > 0 ? (unlockedTiers / totalTiers) * 100 : 0;
  }, [progress]);

  return (
    <AchievementContext.Provider value={{
      achievements,
      progress,
      stats,
      checkAchievements,
      getNextAchievement,
      getProgress,
      getRecentAchievements,
      getCategoryProgress
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
