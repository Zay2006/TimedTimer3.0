"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSettings } from '../context/SettingsContext';

export default function SpotifyCallback() {
  const router = useRouter();
  const { settings, updateSettings } = useSettings();

  useEffect(() => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const accessToken = params.get('access_token');

    if (accessToken) {
      updateSettings({
        ...settings,
        spotifyEnabled: true,
        spotifyToken: accessToken,
      });
      router.push('/settings');
    }
  }, [router, settings, updateSettings]);

  return (
    <div className="container flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Connecting to Spotify...</h1>
        <p className="text-muted-foreground">Please wait while we complete the authentication.</p>
      </div>
    </div>
  );
}
