"use client";

import React, { useEffect, useState } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { getCurrentTrack, pausePlayback, resumePlayback } from '../../lib/spotify';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Play, Pause, Music2 } from 'lucide-react';
import Image from 'next/image';

interface Track {
  item: {
    name: string;
    artists: { name: string }[];
    album: {
      name: string;
      images: { url: string }[];
    };
  };
  is_playing: boolean;
}

export default function SpotifyPlayer() {
  const { settings } = useSettings();
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (settings.spotifyEnabled && settings.spotifyToken) {
      const fetchTrack = async () => {
        try {
          const track = await getCurrentTrack(settings.spotifyToken!);
          setCurrentTrack(track);
          setError(null);
        } catch (err) {
          setError('Failed to fetch current track');
          console.error(err);
        }
      };

      fetchTrack();
      const interval = setInterval(fetchTrack, 5000);
      return () => clearInterval(interval);
    }
  }, [settings.spotifyEnabled, settings.spotifyToken]);

  const handlePlayPause = async () => {
    if (!settings.spotifyToken) return;

    try {
      if (currentTrack?.is_playing) {
        await pausePlayback(settings.spotifyToken);
      } else {
        await resumePlayback(settings.spotifyToken);
      }
      
      // Refetch current track state
      const track = await getCurrentTrack(settings.spotifyToken);
      setCurrentTrack(track);
    } catch (err) {
      setError('Failed to control playback');
      console.error(err);
    }
  };

  if (!settings.spotifyEnabled || !settings.spotifyToken) {
    return null;
  }

  if (error) {
    return (
      <Card className="p-4 bg-destructive/10 text-destructive">
        <p className="text-sm">{error}</p>
      </Card>
    );
  }

  if (!currentTrack) {
    return (
      <Card className="p-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Music2 className="w-4 h-4" />
          <p className="text-sm">No track playing</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="flex items-center gap-4">
        {currentTrack.item.album.images[0] && (
          <div className="relative w-12 h-12">
            <Image
              src={currentTrack.item.album.images[0].url}
              alt={currentTrack.item.album.name}
              fill
              className="rounded-md object-cover"
              sizes="48px"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{currentTrack.item.name}</p>
          <p className="text-sm text-muted-foreground truncate">
            {currentTrack.item.artists.map(a => a.name).join(', ')}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handlePlayPause}
          className="shrink-0"
        >
          {currentTrack.is_playing ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4" />
          )}
        </Button>
      </div>
    </Card>
  );
}
