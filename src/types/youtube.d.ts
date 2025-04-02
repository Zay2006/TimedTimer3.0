declare namespace YT {
  interface Player {
    destroy(): void;
    setVolume(volume: number): void;
  }

  interface PlayerEvent {
    target: Player;
  }

  interface PlayerOptions {
    height: string | number;
    width: string | number;
    videoId: string;
    playerVars?: {
      autoplay?: number;
      controls?: number;
      modestbranding?: number;
      playsinline?: number;
    };
    events?: {
      onReady?: (event: PlayerEvent) => void;
    };
  }

  interface PlayerConstructor {
    new (elementId: string, options: PlayerOptions): Player;
  }
}

interface Window {
  YT: {
    Player: YT.PlayerConstructor;
  };
  onYouTubeIframeAPIReady: () => void;
}
