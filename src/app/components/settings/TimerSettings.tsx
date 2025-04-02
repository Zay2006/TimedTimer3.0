"use client";

import React, { useState } from 'react';
import { useSettings } from '@/app/context/SettingsContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card } from '../ui/card';
import { Clock, Plus, Trash2, Save } from 'lucide-react';
import { TimerPreset } from '@/app/types/timer';
import { v4 as uuidv4 } from 'uuid';

export default function TimerSettings() {
  const { settings, updateSettings } = useSettings();
  const [newPreset, setNewPreset] = useState({
    name: '',
    duration: '',
    breakDuration: '',
  });

  const handlePresetChange = (presetId: string, field: keyof TimerPreset, value: string) => {
    const updatedPresets = settings.presets.map(preset => {
      if (preset.id === presetId) {
        if (field === 'duration' || field === 'breakDuration') {
          // Convert minutes to seconds
          const seconds = Math.max(0, parseInt(value, 10) * 60);
          return { ...preset, [field]: seconds };
        }
        return { ...preset, [field]: value };
      }
      return preset;
    });

    updateSettings({ ...settings, presets: updatedPresets });
  };

  const handleAddPreset = () => {
    if (!newPreset.name || !newPreset.duration) return;

    const duration = Math.max(0, parseInt(newPreset.duration, 10) * 60);
    const breakDuration = newPreset.breakDuration 
      ? Math.max(0, parseInt(newPreset.breakDuration, 10) * 60)
      : 0;

    const preset: TimerPreset = {
      id: uuidv4(),
      name: newPreset.name,
      duration,
      breakDuration,
    };

    updateSettings({
      ...settings,
      presets: [...settings.presets, preset],
    });

    setNewPreset({ name: '', duration: '', breakDuration: '' });
  };

  const handleDeletePreset = (presetId: string) => {
    const updatedPresets = settings.presets.filter(preset => preset.id !== presetId);
    updateSettings({ ...settings, presets: updatedPresets });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Timer Presets
        </h2>
        
        <div className="grid gap-4">
          {settings.presets.map((preset) => (
            <Card key={preset.id} className="p-4 space-y-4">
              <div className="grid gap-4 sm:grid-cols-[1fr,auto,auto,auto]">
                <div className="space-y-2">
                  <Label htmlFor={`preset-name-${preset.id}`}>Name</Label>
                  <Input
                    id={`preset-name-${preset.id}`}
                    value={preset.name}
                    onChange={(e) => handlePresetChange(preset.id, 'name', e.target.value)}
                    placeholder="Preset name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`preset-duration-${preset.id}`}>Duration (min)</Label>
                  <Input
                    id={`preset-duration-${preset.id}`}
                    type="number"
                    value={preset.duration / 60}
                    onChange={(e) => handlePresetChange(preset.id, 'duration', e.target.value)}
                    min="1"
                    className="w-24"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`preset-break-${preset.id}`}>Break (min)</Label>
                  <Input
                    id={`preset-break-${preset.id}`}
                    type="number"
                    value={preset.breakDuration / 60}
                    onChange={(e) => handlePresetChange(preset.id, 'breakDuration', e.target.value)}
                    min="0"
                    className="w-24"
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDeletePreset(preset.id)}
                    className="h-10 w-10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Add new preset form */}
        <Card className="p-4">
          <div className="grid gap-4 sm:grid-cols-[1fr,auto,auto,auto]">
            <div className="space-y-2">
              <Label htmlFor="new-preset-name">Name</Label>
              <Input
                id="new-preset-name"
                value={newPreset.name}
                onChange={(e) => setNewPreset({ ...newPreset, name: e.target.value })}
                placeholder="New preset name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-preset-duration">Duration (min)</Label>
              <Input
                id="new-preset-duration"
                type="number"
                value={newPreset.duration}
                onChange={(e) => setNewPreset({ ...newPreset, duration: e.target.value })}
                min="1"
                className="w-24"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-preset-break">Break (min)</Label>
              <Input
                id="new-preset-break"
                type="number"
                value={newPreset.breakDuration}
                onChange={(e) => setNewPreset({ ...newPreset, breakDuration: e.target.value })}
                min="0"
                className="w-24"
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={handleAddPreset}
                className="h-10 w-10"
                size="icon"
                disabled={!newPreset.name || !newPreset.duration}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
