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
  totalSessions: 0,
  totalFocusTime: 0,
  completedSessions: 0,
  completionRate: 0,
  longestStreak: 0,
  currentStreak: 0,
  bestFocusTime: 0,
  averageFocusTime: 0,
  dailyGoals: {},
  productivityScore: 0,
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
  analytics: defaultAnalytics,
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
   * 
   * Loads saved data from localStorage and updates the state.
   * If data is corrupted or missing, defaults to initial state.
   */
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem('timerData');
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          setData(parsedData);
        } catch (error) {
          console.error('Error parsing saved data:', error);
        }
      }
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
   * Automatically checks all achievement types and unlocks new achievements
   */
  const checkAchievements = () => {
    const newProgress = { ...data.achievementProgress };
    let achievementsChanged = false;

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
          value = data.analytics.productivityScore;
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
   * @param {TimerData} data - New timer data to update
   */
  const updateData = (newData: TimerData) => {
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
