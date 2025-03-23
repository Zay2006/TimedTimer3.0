"use client";

import React from 'react';
import { useSettings } from '../context/SettingsContext';
import { Card } from '../components/ui/card';
import { Switch } from '../components/ui/switch';
import { Label } from '../components/ui/label';
import { Slider } from '../components/ui/slider';
import { Separator } from '../components/ui/separator';
import { Moon, Sun, Volume2, Bell, Music, Settings2, Timer, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import TimerSettings from '../components/settings/TimerSettings';
import TimerAdvancedSettings from '../components/settings/TimerAdvancedSettings';
import Link from 'next/link';

export default function SettingsPage() {
  const { settings, updateSettings } = useSettings();

  const toggleTheme = () => {
    updateSettings({
      ...settings,
      theme: settings.theme === 'dark' ? 'light' : 'dark'
    });
  };

  const handleVolumeChange = (value: number[]) => {
    updateSettings({
      ...settings,
      volume: value[0]
    });
  };

  return (
    <div className="container max-w-4xl py-8 space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="mr-2">
          <Link href="/">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <Settings2 className="w-6 h-6" />
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>
      
      <div className="grid gap-8 md:grid-cols-[300px,1fr]">
        {/* General Settings */}
        <div className="space-y-6">
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
              <h2 className="text-xl font-semibold">Notifications</h2>
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
                    <div className="flex items-center justify-between">
                      <Label>Volume</Label>
                      <span className="text-sm text-muted-foreground">
                        {settings.volume}%
                      </span>
                    </div>
                    <Slider
                      value={[settings.volume]}
                      onValueChange={handleVolumeChange}
                      max={100}
                      step={1}
                    />
                  </div>
                )}

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
            </div>

            <Separator />

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Integrations</h2>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Music className="w-4 h-4" />
                  <Label htmlFor="spotify">Spotify Integration</Label>
                </div>
                <Switch
                  id="spotify"
                  checked={settings.spotifyEnabled}
                  onCheckedChange={(checked) =>
                    updateSettings({ ...settings, spotifyEnabled: checked })
                  }
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Timer Settings */}
        <Card className="p-6">
          <Tabs defaultValue="presets">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Timer className="w-5 h-5" />
                <h2 className="text-xl font-semibold">Timer Configuration</h2>
              </div>
              <TabsList>
                <TabsTrigger value="presets">Presets</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="presets" className="mt-0">
              <TimerSettings />
            </TabsContent>

            <TabsContent value="advanced" className="mt-0">
              <TimerAdvancedSettings />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
