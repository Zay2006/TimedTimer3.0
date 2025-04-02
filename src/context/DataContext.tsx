"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Session, TimerData } from '@/types/timer';

interface DataContextType {
  data: TimerData;
  addSession: (session: Session) => void;
  updateSession: (sessionId: string, updates: Partial<Session>) => void;
  getSessionsByDateRange: (startDate: Date, endDate: Date) => Session[];
}

const defaultData: TimerData = {
  sessions: [],
  analytics: {
    totalFocusTime: 0,
    totalSessions: 0,
    completedSessions: 0,
    averageFocusTime: 0,
    currentStreak: 0,
    longestStreak: 0,
    bestFocusTime: 0,
    completionRate: 0,
    dailyGoals: {},
  }
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<TimerData>(() => {
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem('timerData');
      return savedData ? JSON.parse(savedData) : defaultData;
    }
    return defaultData;
  });

  useEffect(() => {
    localStorage.setItem('timerData', JSON.stringify(data));
  }, [data]);

  const addSession = (session: Session) => {
    setData((prev: TimerData) => {
      const newSessions = [...prev.sessions, session];
      
      // Calculate new analytics
      const totalFocusTime = newSessions.reduce((acc, s) => acc + s.focusTime, 0);
      const totalSessions = newSessions.length;
      const completedSessions = newSessions.filter(s => s.completed).length;
      const bestFocusTime = Math.max(...newSessions.map(s => s.focusTime));
      const completionRate = totalSessions > 0 ? completedSessions / totalSessions : 0;

      // Calculate streak
      const today = new Date().toISOString().split('T')[0];
      const sessionsByDate = new Map<string, boolean>();
      newSessions.forEach(s => {
        const date = s.startTime.split('T')[0];
        sessionsByDate.set(date, true);
      });

      let currentStreak = 0;
      let checkDate = new Date();
      while (sessionsByDate.has(checkDate.toISOString().split('T')[0])) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      }

      return {
        ...prev,
        sessions: newSessions,
        analytics: {
          ...prev.analytics,
          totalFocusTime,
          totalSessions,
          completedSessions,
          averageFocusTime: totalFocusTime / totalSessions,
          bestFocusTime,
          completionRate,
          currentStreak,
          longestStreak: Math.max(currentStreak, prev.analytics.longestStreak),
        }
      };
    });
  };

  const updateSession = (sessionId: string, updates: Partial<Session>) => {
    setData((prev: TimerData) => ({
      ...prev,
      sessions: prev.sessions.map(s => 
        s.id === sessionId ? { ...s, ...updates } : s
      )
    }));
  };

  const getSessionsByDateRange = (startDate: Date, endDate: Date) => {
    return data.sessions.filter(s => {
      const sessionDate = new Date(s.startTime);
      return sessionDate >= startDate && sessionDate <= endDate;
    });
  };

  return (
    <DataContext.Provider value={{ data, addSession, updateSession, getSessionsByDateRange }}>
      {children}
    </DataContext.Provider>
  );
}

export function useTimerData(): DataContextType {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useTimerData must be used within a DataProvider');
  }
  return context;
}
