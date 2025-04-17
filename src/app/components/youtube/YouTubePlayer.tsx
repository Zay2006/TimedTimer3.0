"use client";

import React, { useState, useEffect } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

export default function YouTubePlayer() {
  const { settings, updateSettings } = useSettings();
  const [videoUrl, setVideoUrl] = useState(settings.youtubeUrl || '');
  const [videoId, setVideoId] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);

  const extractVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  useEffect(() => {
    const id = extractVideoId(videoUrl);
    if (id) {
      setVideoId(id);
    }
  }, [videoUrl]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      ...settings,
      youtubeUrl: videoUrl,
      youtubeEnabled: true
    });
  };

  const handleClear = () => {
    setVideoUrl('');
    setVideoId('');
    updateSettings({
      ...settings,
      youtubeUrl: '',
      youtubeEnabled: false
    });
  };

  return (
    <Card className={`p-4 w-full max-w-md mx-auto transition-all duration-300 ${isMinimized ? 'h-16' : ''}`}>
      <div className="flex justify-between items-center mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMinimized(!isMinimized)}
        >
          {isMinimized ? 'Expand' : 'Minimize'}
        </Button>
        {videoId && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="text-destructive"
          >
            Clear
          </Button>
        )}
      </div>

      {!isMinimized && (
        <>
          <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
            <Input
              type="text"
              placeholder="Enter YouTube URL"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="flex-1"
            />
            <Button type="submit">Play</Button>
          </form>

          {videoId && (
            <div className="relative pt-[56.25%] w-full">
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={`https://www.youtube.com/embed/${videoId}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
        </>
      )}
    </Card>
  );
}
