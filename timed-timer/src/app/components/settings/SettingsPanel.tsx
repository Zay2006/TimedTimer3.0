"use client";

import React, { useState } from "react";
import { useSettings } from "../../context/SettingsContext";
import { useTimerData } from "../../context/DataContext";
import { Plus, Trash2, Download, Upload, Volume2, Bell, Keyboard } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Switch } from "../ui/switch";
import { Slider } from "../ui/slider";
import { TimerPreset, TimerSettings } from "../../types/timer";

interface PresetFormData {
  name: string;
  duration: string;
  breakDuration: string;
}

export default function SettingsPanel() {
  const { settings, updateSettings } = useSettings();
  const { data, updateData } = useTimerData();
  const [showPresetDialog, setShowPresetDialog] = useState(false);
  const [presetForm, setPresetForm] = useState<PresetFormData>({
    name: "",
    duration: "",
    breakDuration: "",
  });

  const handlePresetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPreset: TimerPreset = {
      id: crypto.randomUUID(),
      name: presetForm.name,
      duration: parseInt(presetForm.duration) * 60,
      breakDuration: parseInt(presetForm.breakDuration) * 60,
    };
    updateSettings({
      ...settings,
      presets: [...settings.presets, newPreset],
    });
    setShowPresetDialog(false);
    setPresetForm({ name: "", duration: "", breakDuration: "" });
  };

  const handlePresetDelete = (presetId: string) => {
    updateSettings({
      ...settings,
      presets: settings.presets.filter((p) => p.id !== presetId),
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPresetForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleExportData = () => {
    const exportData = {
      settings,
      data,
    };
    const dataStr = JSON.stringify(exportData);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    const exportFileDefaultName = `focus-timer-backup-${new Date().toISOString().split("T")[0]}.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target?.result as string);
        updateSettings(importedData.settings);
        updateData(importedData.data);
      } catch (error) {
        console.error("Error importing data:", error);
      }
    };
    reader.readAsText(file);
  };

  const handleVolumeChange = (value: number[]) => {
    updateSettings({
      ...settings,
      volume: value[0],
    });
  };

  const handleNotificationsToggle = (checked: boolean) => {
    updateSettings({
      ...settings,
      notificationsEnabled: checked,
    });
  };

  const handleSoundToggle = (checked: boolean) => {
    updateSettings({
      ...settings,
      soundEnabled: checked,
    });
  };

  return (
    <div className="space-y-8">
      {/* Timer Presets */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Timer Presets</h2>
          <Dialog open={showPresetDialog} onOpenChange={setShowPresetDialog}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1">
                <Plus className="w-4 h-4" />
                Add Preset
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Timer Preset</DialogTitle>
              </DialogHeader>
              <form onSubmit={handlePresetSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Preset Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={presetForm.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Quick Focus"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    name="duration"
                    type="number"
                    min="1"
                    value={presetForm.duration}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="breakDuration">Break Duration (minutes)</Label>
                  <Input
                    id="breakDuration"
                    name="breakDuration"
                    type="number"
                    min="0"
                    value={presetForm.breakDuration}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Add Preset
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {settings.presets.map((preset) => (
            <Card key={preset.id} className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{preset.name}</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handlePresetDelete(preset.id)}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
              <div className="text-sm text-muted-foreground">
                <p>Focus: {preset.duration / 60} minutes</p>
                <p>Break: {preset.breakDuration / 60} minutes</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Sound & Notifications */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Sound & Notifications</h2>
        <Card className="p-4 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Sound Effects</Label>
              <p className="text-sm text-muted-foreground">
                Enable timer sounds and alerts
              </p>
            </div>
            <Switch
              checked={settings.soundEnabled}
              onCheckedChange={handleSoundToggle}
            />
          </div>

          {settings.soundEnabled && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4" />
                <Label>Volume</Label>
              </div>
              <Slider
                value={[settings.volume]}
                onValueChange={handleVolumeChange}
                max={100}
                step={1}
              />
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                <Label>Notifications</Label>
              </div>
              <p className="text-sm text-muted-foreground">
                Show desktop notifications
              </p>
            </div>
            <Switch
              checked={settings.notificationsEnabled}
              onCheckedChange={handleNotificationsToggle}
            />
          </div>
        </Card>
      </section>

      {/* Keyboard Shortcuts */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Keyboard className="w-5 h-5" />
          <h2 className="text-lg font-semibold">Keyboard Shortcuts</h2>
        </div>
        <Card className="p-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="font-medium">Start/Pause Timer</p>
              <p className="text-sm text-muted-foreground">Space</p>
            </div>
            <div>
              <p className="font-medium">Reset Timer</p>
              <p className="text-sm text-muted-foreground">Esc</p>
            </div>
            <div>
              <p className="font-medium">Skip Break</p>
              <p className="text-sm text-muted-foreground">Ctrl + →</p>
            </div>
            <div>
              <p className="font-medium">Toggle Settings</p>
              <p className="text-sm text-muted-foreground">Ctrl + ,</p>
            </div>
          </div>
        </Card>
      </section>

      {/* Data Management */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Data Management</h2>
        <Card className="p-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={handleExportData}
            >
              <Download className="w-4 h-4" />
              Export Data
            </Button>
            <div className="relative">
              <Button variant="outline" className="w-full gap-2">
                <Upload className="w-4 h-4" />
                Import Data
              </Button>
              <Input
                type="file"
                accept=".json"
                onChange={handleImportData}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
