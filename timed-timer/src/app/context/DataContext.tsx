"use client";

/**
 * Data Management System
 * 
 * This context provides centralized data management for timer sessions, analytics, and achievements.
 * It handles data persistence, analytics calculations, and real-time updates.
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { TimerData, Analytics, Session } from '../types/timer';
import { Achievement, AchievementProgress, AchievementStats, achievementTypes } from '../types/achievements';

/**
 * Default analytics state
 * Initializes all analytics metrics to their default values
 * 
 * @constant
 * @type {Analytics}
 */
const defaultAnalytics: Analytics = {
  totalFocusTime: 0,
  totalSessions: 0,
  completedSessions: 0,
  averageSessionLength: 0,
  completionRate: 0,
  productivityScore: 0,
  currentStreak: 0,
  longestStreak: 0,
  dailyStats: [],
  weeklyStats: [],
  monthlyStats: []
};

/**
 * Default achievement stats state
 * Initializes achievement stats to their default values
 * 
 * @constant
 * @type {AchievementStats}
 */
const defaultAchievementStats: AchievementStats = {
  totalUnlocked: 0,
  currentStreak: 0,
  longestStreak: 0,
  focusTimeTotal: 0,
  sessionsCompleted: 0,
  dailyGoalsReached: 0,
};

/**
 * Default timer data state
 * Combines sessions, analytics, achievements, and achievement progress into a single data structure
 * 
 * @constant
 * @type {TimerData}
 */
const defaultData: TimerData = {
  sessions: [],
  analytics: {
    ...defaultAnalytics,
    dailyStats: [{
      date: new Date().toISOString().split('T')[0],
      metrics: {
        completedSessions: 0,
        focusTime: 0,
        interrupted: false,
        breaks: 0,
        achievements: 0,
        productivityScore: 0,
        targetSessions: 4
      }
    }]
  },
  achievements: [],
  achievementProgress: {},
  achievementStats: defaultAchievementStats,
};

/**
 * Data context interface
 * Defines the shape of the data context and its methods
 * 
 * @interface DataContextType
 */
interface DataContextType {
  /**
   * Current timer data state
   * @type {TimerData}
   */
  data: TimerData;
  
  /**
   * Updates the timer data state
   * Triggers analytics recalculation and persistence
   * 
   * @param {TimerData} data - New timer data to update
   */
  updateData: (data: TimerData) => void;
  
  /**
   * Checks and updates achievement progress
   * Automatically checks all achievement types and unlocks new achievements
   */
  checkAchievements: () => void;
  
  /**
   * Unlocks a new achievement
   * Creates a new achievement record and updates stats
   * 
   * @param {string} typeId - Achievement type ID
   * @param {number} tier - Achievement tier level
   */
  unlockAchievement: (typeId: string, tier: number) => void;
}

/**
 * Data context
 * @constant
 */
const DataContext = createContext<DataContextType | undefined>(undefined);

/**
 * Data Provider Component
 * 
 * Manages timer data state and provides it to child components.
 * Handles data persistence, initialization, and updates.
 * 
 * Features:
 * - Automatic data persistence
 * - Lazy initialization from localStorage
 * - Type-safe data management
 * - Real-time analytics updates
 * - Achievement management and progress tracking
 * 
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export function DataProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [data, setData] = useState<TimerData>(defaultData);

  /**
   * Initialize data from localStorage
   */
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem('timerData');
      let initialData = defaultData;
      
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          // Ensure analytics has the correct structure
          initialData = {
            ...parsedData,
            analytics: {
              ...defaultAnalytics,
              ...parsedData.analytics,
              dailyStats: parsedData.analytics?.dailyStats || defaultData.analytics.dailyStats
            }
          };
        } catch (error) {
          console.error('Error parsing saved data:', error);
        }
      }

      // Ensure today's stats exist
      const today = new Date().toISOString().split('T')[0];
      if (!initialData.analytics.dailyStats.find(stat => stat.date === today)) {
        initialData.analytics.dailyStats.push({
          date: today,
          metrics: {
            completedSessions: 0,
            focusTime: 0,
            interrupted: false,
            breaks: 0,
            achievements: 0,
            productivityScore: 0,
            targetSessions: 4
          }
        });
      }

      setData(initialData);
      setIsInitialized(true);
    }
  }, []);

  /**
   * Persist data changes to localStorage
   * 
   * Updates localStorage with the latest data state.
   */
  useEffect(() => {
    if (isInitialized && typeof window !== 'undefined') {
      localStorage.setItem('timerData', JSON.stringify(data));
    }
  }, [data, isInitialized]);

  /**
   * Check achievements when data changes
   * Automatically checks all achievement types and unlocks new achievements
   */
  useEffect(() => {
    if (isInitialized) {
      checkAchievements();
    }
  }, [data.analytics, isInitialized]);

  /**
   * Check and update achievement progress
   */
  const checkAchievements = () => {
    const newProgress = { ...data.achievementProgress };
    let achievementsChanged = false;

    // Get today's stats
    const today = new Date().toISOString().split('T')[0];
    const todayStats = data.analytics.dailyStats.find(stat => stat.date === today)?.metrics;
    if (!todayStats) return;

    // Check each achievement type
    Object.entries(achievementTypes).forEach(([typeId, type]) => {
      const progress = newProgress[typeId] || { typeId, currentTier: 0, progress: 0 };
      let value = 0;

      // Calculate progress based on achievement type
      switch (typeId) {
        case 'focusMaster':
          value = data.analytics.totalFocusTime;
          break;
        case 'streakChampion':
          value = data.analytics.currentStreak;
          break;
        case 'consistencyKing':
          value = data.analytics.completedSessions;
          break;
        case 'productivityPro':
          value = todayStats.productivityScore;
          break;
      }

      // Update progress
      if (value > progress.progress) {
        progress.progress = value;
        achievementsChanged = true;

        // Check for new tier unlocks
        type.tiers.forEach((tier) => {
          if (value >= tier.requirement && tier.level > progress.currentTier) {
            unlockAchievement(typeId, tier.level);
            progress.currentTier = tier.level;
            todayStats.achievements++;
          }
        });
      }

      newProgress[typeId] = progress;
    });

    if (achievementsChanged) {
      setData((prev) => ({
        ...prev,
        achievementProgress: newProgress,
      }));
    }
  };

  /**
   * Unlock a new achievement
   * Creates a new achievement record and updates stats
   * 
   * @param {string} typeId - Achievement type ID
   * @param {number} tier - Achievement tier level
   */
  const unlockAchievement = (typeId: string, tier: number) => {
    const type = achievementTypes[typeId];
    if (!type) return;

    const tierData = type.tiers[tier - 1];
    if (!tierData) return;

    const newAchievement: Achievement = {
      id: `${typeId}-${tier}-${Date.now()}`,
      typeId,
      name: `${type.title} - Level ${tier}`,
      description: type.description,
      tier,
      unlockedAt: new Date().toISOString(),
      icon: type.icon,
      reward: tierData.reward,
    };

    setData((prev) => ({
      ...prev,
      achievements: [...prev.achievements, newAchievement],
      achievementStats: {
        ...prev.achievementStats,
        totalUnlocked: prev.achievementStats.totalUnlocked + 1,
      },
    }));

    // TODO: Show achievement unlock notification
  };

  /**
   * Updates the timer data state
   * Triggers analytics recalculation and persistence
   * 
   * @param {TimerData} newData - New timer data to update
   */
  const updateData = (newData: TimerData) => {
    // Ensure today's stats exist
    const today = new Date().toISOString().split('T')[0];
    if (!newData.analytics.dailyStats.find(stat => stat.date === today)) {
      newData.analytics.dailyStats.push({
        date: today,
        metrics: {
          completedSessions: 0,
          focusTime: 0,
          interrupted: false,
          breaks: 0,
          achievements: 0,
          productivityScore: 0,
          targetSessions: 4
        }
      });
    }

    // Update analytics
    const todayStats = newData.analytics.dailyStats.find(stat => stat.date === today)!;
    todayStats.metrics.completedSessions = newData.sessions.filter(s => 
      s.completed && new Date(s.startTime).toISOString().split('T')[0] === today
    ).length;
    todayStats.metrics.focusTime = newData.sessions.filter(s => 
      new Date(s.startTime).toISOString().split('T')[0] === today
    ).reduce((acc, s) => acc + s.focusTime, 0);
    todayStats.metrics.breaks = newData.sessions.filter(s => 
      new Date(s.startTime).toISOString().split('T')[0] === today
    ).reduce((acc, s) => acc + s.breaks, 0);

    // Update completion rate
    if (todayStats.metrics.targetSessions > 0) {
      newData.analytics.completionRate = (todayStats.metrics.completedSessions / todayStats.metrics.targetSessions) * 100;
    }

    setData(newData);
  };

  // Don't render children until data is initialized from localStorage
  if (!isInitialized) {
    return null;
  }

  return (
    <DataContext.Provider value={{ data, updateData, checkAchievements, unlockAchievement }}>
      {children}
    </DataContext.Provider>
  );
}

/**
 * useTimerData Hook
 * 
 * Provides access to the timer data context.
 * Throws an error if used outside a DataProvider.
 * 
 * @hook
 * @returns {DataContextType} Timer data context
 */
export function useTimerData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useTimerData must be used within a DataProvider');
  }
  return context;
}
