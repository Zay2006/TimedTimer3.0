"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { TimerData, Analytics, Session } from '../types/timer';

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
};

const defaultData: TimerData = {
  sessions: [],
  analytics: defaultAnalytics,
};

interface DataContextType {
  data: TimerData;
  updateData: (data: TimerData) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [data, setData] = useState<TimerData>(defaultData);

  // Initialize data from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem('timerData');
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          setData(parsedData);
        } catch (error) {
          console.error('Failed to parse saved timer data:', error);
        }
      }
      setIsInitialized(true);
    }
  }, []);

  // Persist data changes to localStorage
  useEffect(() => {
    if (isInitialized && typeof window !== 'undefined') {
      localStorage.setItem('timerData', JSON.stringify(data));
    }
  }, [data, isInitialized]);

  // Update daily goals at midnight
  useEffect(() => {
    if (!isInitialized) return;

    const updateDailyGoals = () => {
      const today = new Date().toISOString().split('T')[0];
      if (!data.analytics.dailyGoals[today]) {
        setData(prev => ({
          ...prev,
          analytics: {
            ...prev.analytics,
            dailyGoals: {
              ...prev.analytics.dailyGoals,
              [today]: {
                completed: false,
                focusTime: 0,
                sessions: 0,
              },
            },
          },
        }));
      }
    };

    updateDailyGoals();

    // Schedule next update at midnight
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const msUntilMidnight = tomorrow.getTime() - now.getTime();

    const timer = setTimeout(updateDailyGoals, msUntilMidnight);
    return () => clearTimeout(timer);
  }, [data.analytics.dailyGoals, isInitialized]);

  const updateData = (newData: TimerData) => {
    setData(newData);
  };

  // Don't render children until data is initialized from localStorage
  if (!isInitialized) {
    return null;
  }

  return (
    <DataContext.Provider value={{ data, updateData }}>
      {children}
    </DataContext.Provider>
  );
}

export function useTimerData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useTimerData must be used within a DataProvider');
  }
  return context;
}
