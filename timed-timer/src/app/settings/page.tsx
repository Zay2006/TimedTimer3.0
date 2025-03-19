"use client";

import React from 'react';
import { useSettings } from '../context/SettingsContext';
import { Card } from '../components/ui/card';
import { Switch } from '../components/ui/switch';
import { Label } from '../components/ui/label';
import { Slider } from '../components/ui/slider';
import { Separator } from '../components/ui/separator';
import { Moon, Sun, Volume2, Bell, Music } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function SettingsPage() {
  const { settings, updateSettings } = useSettings();

  const toggleTheme = () => {
    updateSettings({
      ...settings,
      theme: settings.theme === 'dark' ? 'light' : 'dark'
    });
  };

  return (
    <div className="container max-w-2xl py-8 space-y-8">
      <h1 className="text-3xl font-bold">Settings</h1>
      
      <Card className="p-6 space-y-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Appearance</h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {settings.theme === 'dark' ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4" />
              )}
              <Label htmlFor="theme">Dark Mode</Label>
            </div>
            <Switch
              id="theme"
              checked={settings.theme === 'dark'}
              onCheckedChange={toggleTheme}
            />
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Sound</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4" />
                <Label htmlFor="sound">Sound Effects</Label>
              </div>
              <Switch
                id="sound"
                checked={settings.soundEnabled}
                onCheckedChange={(checked) =>
                  updateSettings({ ...settings, soundEnabled: checked })
                }
              />
            </div>
            {settings.soundEnabled && (
              <div className="space-y-2">
                <Label htmlFor="volume">Volume</Label>
                <Slider
                  id="volume"
                  min={0}
                  max={100}
                  step={1}
                  value={[settings.volume]}
                  onValueChange={([value]) =>
                    updateSettings({ ...settings, volume: value })
                  }
                />
              </div>
            )}
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Notifications</h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              <Label htmlFor="notifications">Desktop Notifications</Label>
            </div>
            <Switch
              id="notifications"
              checked={settings.notificationsEnabled}
              onCheckedChange={(checked) =>
                updateSettings({ ...settings, notificationsEnabled: checked })
              }
            />
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Spotify Integration</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Music className="w-4 h-4" />
              <Label>Connect Spotify Account</Label>
            </div>
            <Button variant="outline" className="w-full">
              Connect with Spotify
            </Button>
            <p className="text-sm text-muted-foreground">
              Connect your Spotify account to control playback during focus sessions.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
