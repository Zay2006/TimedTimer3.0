"use client";

import React from 'react';
import { useNotifications } from '../../hooks/useNotifications';
import { CheckCircle, XCircle, Info, Trophy, X } from 'lucide-react';

const icons = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
  achievement: Trophy,
};

const variants = {
  success: 'bg-green-50 text-green-800 border-green-200',
  error: 'bg-red-50 text-red-800 border-red-200',
  info: 'bg-blue-50 text-blue-800 border-blue-200',
  achievement: 'bg-yellow-50 text-yellow-800 border-yellow-200',
};

export default function ToastManager() {
  const { notifications, removeNotification } = useNotifications();

  return (
    <div className="fixed bottom-0 right-0 p-4 space-y-4 z-50 max-w-sm w-full">
      {notifications.map((notification) => {
        const Icon = icons[notification.type];
        const variantClass = variants[notification.type];

        return (
          <div
            key={notification.id}
            className={`flex items-start p-4 rounded-lg border shadow-lg ${variantClass} transform transition-all duration-500 animate-slide-in`}
          >
            <div className="flex-shrink-0">
              <Icon className="w-5 h-5" />
            </div>
            <div className="ml-3 flex-1">
              <p className="font-medium">{notification.title}</p>
              <p className="mt-1 text-sm opacity-90">{notification.message}</p>
            </div>
            <button
              onClick={() => removeNotification(notification.id)}
              className="flex-shrink-0 ml-4 hover:opacity-75"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
