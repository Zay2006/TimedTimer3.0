"use client";

import React from 'react';
import { useSettings } from '@/app/context/SettingsContext';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Card } from '../ui/card';
import { Clock, RotateCcw, Bell, Play } from 'lucide-react';

export default function TimerAdvancedSettings() {
  const { settings, updateSettings } = useSettings();

  const handleSettingChange = (key: keyof typeof settings, value: any) => {
    updateSettings({ ...settings, [key]: value });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <Clock className="w-5 h-5" />
        Advanced Timer Settings
      </h2>

      <div className="grid gap-4">
        {/* Auto-start settings */}
        <Card className="p-4 space-y-4">
          <h3 className="font-medium flex items-center gap-2">
            <Play className="w-4 h-4" />
            Auto-start Settings
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="autoStartBreaks">Auto-start Breaks</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically start break timer when focus session ends
                </p>
              </div>
              <Switch
                id="autoStartBreaks"
                checked={settings.autoStartBreaks}
                onCheckedChange={(checked) => handleSettingChange('autoStartBreaks', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="autoStartNextSession">Auto-start Next Session</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically start next focus session after break
                </p>
              </div>
              <Switch
                id="autoStartNextSession"
                checked={settings.autoStartNextSession}
                onCheckedChange={(checked) => handleSettingChange('autoStartNextSession', checked)}
              />
            </div>
          </div>
        </Card>

        {/* Long break settings */}
        <Card className="p-4 space-y-4">
          <h3 className="font-medium flex items-center gap-2">
            <RotateCcw className="w-4 h-4" />
            Long Break Settings
          </h3>
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="longBreakInterval">Long Break Interval</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="longBreakInterval"
                  type="number"
                  min={1}
                  value={settings.longBreakInterval}
                  onChange={(e) => handleSettingChange('longBreakInterval', parseInt(e.target.value, 10))}
                  className="w-24"
                />
                <span className="text-sm text-muted-foreground">sessions</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Number of focus sessions before a long break
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="longBreakDuration">Long Break Duration</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="longBreakDuration"
                  type="number"
                  min={1}
                  value={Math.floor(settings.longBreakDuration / 60)}
                  onChange={(e) => handleSettingChange('longBreakDuration', parseInt(e.target.value, 10) * 60)}
                  className="w-24"
                />
                <span className="text-sm text-muted-foreground">minutes</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Display settings */}
        <Card className="p-4 space-y-4">
          <h3 className="font-medium flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Display Settings
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="showProgressBar">Show Progress Bar</Label>
                <p className="text-sm text-muted-foreground">
                  Display a visual progress indicator
                </p>
              </div>
              <Switch
                id="showProgressBar"
                checked={settings.showProgressBar}
                onCheckedChange={(checked) => handleSettingChange('showProgressBar', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="showTimeInTitle">Show Time in Title</Label>
                <p className="text-sm text-muted-foreground">
                  Display remaining time in browser tab
                </p>
              </div>
              <Switch
                id="showTimeInTitle"
                checked={settings.showTimeInTitle}
                onCheckedChange={(checked) => handleSettingChange('showTimeInTitle', checked)}
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
