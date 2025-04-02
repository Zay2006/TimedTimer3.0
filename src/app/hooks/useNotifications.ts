"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';

export type NotificationType = 'success' | 'error' | 'info' | 'achievement';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  addNotification: () => {},
  removeNotification: () => {},
});

export function NotificationProvider({ children }: { children: ReactNode }): React.ReactElement {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback(({ type, title, message, duration = 5000 }: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const notification = { id, type, title, message, duration };
    
    setNotifications(prev => [...prev, notification]);

    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  return React.createElement(NotificationContext.Provider, {
    value: {
      notifications,
      addNotification,
      removeNotification,
    },
    children,
  });
}

export function useNotifications(): NotificationContextType {
  return useContext(NotificationContext);
}
