import React, { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react';

interface Song {
  id: number;
  title: string;
  artist: { name: string };
  album?: { title: string };
  file_path: string;
  cover_image: string | null;
}

interface PlayerContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  progress: number;
  duration: number;
  volume: number;
  playSong: (song: Song) => void;
  togglePlayPause: () => void;
  seek: (percentage: number) => void;
  setVolumeLevel: (level: number) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = volume;
    }

    const audio = audioRef.current;

    const updateProgress = () => setProgress(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const playSong = (song: Song) => {
    if (audioRef.current) {
      const streamUrl = `http://localhost:8000/api/songs/${song.id}/stream`;
      if (currentSong?.id !== song.id) {
        setCurrentSong(song);
        audioRef.current.src = streamUrl;
      }
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const togglePlayPause = () => {
    if (!audioRef.current || !currentSong) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const seek = (percentage: number) => {
    if (audioRef.current && duration) {
      audioRef.current.currentTime = (percentage / 100) * duration;
    }
  };

  const setVolumeLevel = (level: number) => {
    if (audioRef.current) {
      audioRef.current.volume = level;
      setVolume(level);
    }
  };

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        isPlaying,
        progress,
        duration,
        volume,
        playSong,
        togglePlayPause,
        seek,
        setVolumeLevel,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) throw new Error('usePlayer must be used within PlayerProvider');
  return context;
};
