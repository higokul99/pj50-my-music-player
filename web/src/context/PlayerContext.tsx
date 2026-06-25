import React, { createContext, useContext, useState, useRef, useEffect, ReactNode, useCallback } from 'react';
import { X, Check } from 'lucide-react';
import api from '../services/api';
import { DownloadService } from '../services/DownloadService';

interface Song {
  id: number;
  title: string;
  artist: { name: string };
  album?: { title: string };
  file_path: string;
  cover_image: string | null;
  is_favorite?: boolean;
}

interface PlayerContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  progress: number;
  duration: number;
  volume: number;
  playSong: (song: Song, queue?: Song[]) => void;
  togglePlayPause: () => void;
  seek: (percentage: number) => void;
  setVolumeLevel: (level: number) => void;
  toggleFavorite: (songId: number) => Promise<void>;
  playNext: () => void;
  playPrevious: () => void;
  showAddToPlaylist: (songId: number) => void;
  downloadSong: (song: Song) => Promise<void>;
  isDownloaded: (songId: number) => boolean;
  isDownloading: (songId: number) => boolean;
  repeatMode: 'off' | 'all' | 'one';
  isShuffleOn: boolean;
  toggleRepeat: () => void;
  toggleShuffle: () => void;
  addSongToQueue: (song: Song) => void;
  playSongNext: (song: Song) => void;
  playShuffled: (newQueue: Song[]) => void;
  queue: Song[];
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [queue, setQueue] = useState<Song[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playlistModalSongId, setPlaylistModalSongId] = useState<number | null>(null);
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [songPlaylistIds, setSongPlaylistIds] = useState<number[]>([]);
  const [downloadedSongIds, setDownloadedSongIds] = useState<number[]>([]);
  const [downloadingIds, setDownloadingIds] = useState<number[]>([]);
  const [repeatMode, setRepeatMode] = useState<'off' | 'all' | 'one'>('off');
  const [isShuffleOn, setIsShuffleOn] = useState(false);
  const [shuffledQueue, setShuffledQueue] = useState<Song[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Helper to shuffle array
  const shuffleArray = (array: Song[]) => {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
  };

  const toggleRepeat = useCallback(() => {
    setRepeatMode(prev => prev === 'off' ? 'all' : prev === 'all' ? 'one' : 'off');
  }, []);

  const toggleShuffle = useCallback(() => {
    setIsShuffleOn(prev => {
      const newState = !prev;
      if (newState) {
        // If turning on, generate shuffled queue
        let newShuffled = shuffleArray(queue);
        // Ensure current song is first in shuffled queue so it doesn't repeat immediately
        if (currentSong) {
          newShuffled = newShuffled.filter(s => s.id !== currentSong.id);
          newShuffled.unshift(currentSong);
        }
        setShuffledQueue(newShuffled);
      }
      return newState;
    });
  }, [queue, currentSong]);

  const addSongToQueue = useCallback((song: Song) => {
    setQueue(prev => {
      const exists = prev.find(s => s.id === song.id);
      if (exists) return prev;
      const newQueue = [...prev, song];
      if (isShuffleOn) {
        setShuffledQueue(sq => [...sq, song]);
      }
      return newQueue;
    });
  }, [isShuffleOn]);

  const playSongNext = useCallback((song: Song) => {
    setQueue(prev => {
      const activeQueue = prev;
      const currentIndex = currentSong ? activeQueue.findIndex(s => s.id === currentSong.id) : -1;
      const filtered = activeQueue.filter(s => s.id !== song.id);
      if (currentIndex !== -1) {
        filtered.splice(currentIndex + 1, 0, song);
        return filtered;
      }
      return [...filtered, song];
    });
    if (isShuffleOn) {
      setShuffledQueue(prev => {
        const currentIndex = currentSong ? prev.findIndex(s => s.id === currentSong.id) : -1;
        const filtered = prev.filter(s => s.id !== song.id);
        if (currentIndex !== -1) {
          filtered.splice(currentIndex + 1, 0, song);
          return filtered;
        }
        return [...filtered, song];
      });
    }
  }, [currentSong, isShuffleOn]);

  // Initialize downloads list
  useEffect(() => {
    const initDownloads = async () => {
      const cache = await caches.open('musiqsphere-audio-cache');
      const keys = await cache.keys();
      const ids = keys.map(request => {
        const url = new URL(request.url);
        const match = url.pathname.match(/\/api\/songs\/(\d+)\/stream/);
        return match ? parseInt(match[1]) : null;
      }).filter((id): id is number => id !== null);
      
      setDownloadedSongIds(ids);
    };
    initDownloads();
  }, []);

  const downloadSong = async (song: Song) => {
     if (downloadingIds.includes(song.id)) return;
     
     setDownloadingIds(prev => [...prev, song.id]);
     try {
       // 1. Internal cache for offline playback
       const success = await DownloadService.downloadSong(song);
       if (success) {
         setDownloadedSongIds(prev => [...prev, song.id]);
       }

       // 2. Trigger actual browser download
       const baseURL = import.meta.env.MODE === 'production' 
         ? window.location.origin 
         : 'http://localhost:8000';
         
       const downloadUrl = `${baseURL}/api/songs/${song.id}/download`;
       
       const link = document.createElement('a');
       link.href = downloadUrl;
       link.setAttribute('download', `${song.title}.mp3`);
       document.body.appendChild(link);
       link.click();
       document.body.removeChild(link);
       
     } catch (error) {
       console.error('Download failed', error);
       alert('Failed to download song. Please try again.');
     } finally {
       setDownloadingIds(prev => prev.filter(id => id !== song.id));
     }
   };

  const isDownloaded = (songId: number) => {
    return downloadedSongIds.includes(songId);
  };

  const isDownloading = (songId: number) => {
    return downloadingIds.includes(songId);
  };

  const showAddToPlaylist = async (songId: number) => {
    setPlaylistModalSongId(songId);
    try {
      const [playlistsRes, songPlaylistsRes] = await Promise.all([
        api.get('/playlists'),
        api.get(`/songs/${songId}/playlists`)
      ]);
      setPlaylists(playlistsRes.data.data);
      setSongPlaylistIds(songPlaylistsRes.data.data);
    } catch (error) {
      console.error('Failed to fetch playlist info', error);
    }
  };

  const handleTogglePlaylist = async (playlistId: number) => {
    if (!playlistModalSongId) return;
    
    try {
      const isInPlaylist = songPlaylistIds.includes(playlistId);
      
      if (isInPlaylist) {
        await api.delete(`/playlists/${playlistId}/songs`, { data: { song_id: playlistModalSongId } });
        setSongPlaylistIds(prev => prev.filter(id => id !== playlistId));
      } else {
        await api.post(`/playlists/${playlistId}/songs`, { song_id: playlistModalSongId });
        setSongPlaylistIds(prev => [...prev, playlistId]);
      }
    } catch (error) {
      console.error('Failed to update playlist', error);
    }
  };

  const toggleFavorite = async (songId: number) => {
    try {
      await api.post(`/songs/${songId}/favorite`);
      
      if (currentSong && currentSong.id === songId) {
        setCurrentSong({
          ...currentSong,
          is_favorite: !currentSong.is_favorite
        });
      }
    } catch (error) {
      console.error('Failed to toggle favorite', error);
    }
  };

  // Play a specific song and optionally update the queue
  const playSong = useCallback(async (song: Song, newQueue?: Song[]) => {
    if (newQueue) {
      setQueue(newQueue);
      if (isShuffleOn) {
        let newShuffled = shuffleArray(newQueue);
        newShuffled = newShuffled.filter(s => s.id !== song.id);
        newShuffled.unshift(song);
        setShuffledQueue(newShuffled);
      }
    }
    
    if (audioRef.current) {
      const cachedUrl = await DownloadService.getCachedUrl(song.id);
      
      const baseURL = import.meta.env.MODE === 'production' 
        ? window.location.origin 
        : 'http://localhost:8000';
        
      const streamUrl = cachedUrl || `${baseURL}/api/songs/${song.id}/stream`;
      
      if (currentSong?.id !== song.id) {
        setCurrentSong(song);
        audioRef.current.src = streamUrl;
      }
      
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch(error => {
            console.error("Playback failed:", error);
            setIsPlaying(false);
          });
      }
    }
  }, [currentSong, isShuffleOn]);

  const playShuffled = useCallback((newQueue: Song[]) => {
    if (newQueue.length === 0) return;
    setIsShuffleOn(true);
    let newShuffled = shuffleArray(newQueue);
    setQueue(newQueue);
    setShuffledQueue(newShuffled);
    playSong(newShuffled[0]);
  }, [playSong]);

  // Play next song in the queue
  const playNext = useCallback(() => {
    const activeQueue = isShuffleOn ? shuffledQueue : queue;
    if (activeQueue.length === 0 || !currentSong) return;
    
    if (repeatMode === 'one') {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(console.error);
      }
      return;
    }

    const currentIndex = activeQueue.findIndex(s => s.id === currentSong.id);
    if (currentIndex === -1) {
      playSong(activeQueue[0]);
    } else {
      const isLastSong = currentIndex === activeQueue.length - 1;
      if (isLastSong && repeatMode === 'off') {
        if (audioRef.current) {
          audioRef.current.pause();
          setIsPlaying(false);
          audioRef.current.currentTime = 0;
        }
        return;
      }
      const nextIndex = (currentIndex + 1) % activeQueue.length;
      playSong(activeQueue[nextIndex]);
    }
  }, [queue, shuffledQueue, isShuffleOn, repeatMode, currentSong, playSong]);

  // Play previous song in the queue
  const playPrevious = useCallback(() => {
    const activeQueue = isShuffleOn ? shuffledQueue : queue;
    if (activeQueue.length === 0 || !currentSong) return;
    
    // If we've played more than 3 seconds, just restart the song regardless of mode
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      return;
    }

    if (repeatMode === 'one') {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(console.error);
      }
      return;
    }

    const currentIndex = activeQueue.findIndex(s => s.id === currentSong.id);
    if (currentIndex === -1) {
      playSong(activeQueue[0]);
    } else {
      const prevIndex = (currentIndex - 1 + activeQueue.length) % activeQueue.length;
      playSong(activeQueue[prevIndex]);
    }
  }, [queue, shuffledQueue, isShuffleOn, repeatMode, currentSong, playSong]);

  // Audio initialization and event listeners
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = volume;
    }

    const audio = audioRef.current;

    const updateProgress = () => setProgress(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    
    // THE CORE AUTO-PLAY LOGIC:
    // When a song ends, this event listener triggers the playNext function
    const handleEnded = () => {
      console.log('Song ended, moving to next...');
      playNext();
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [playNext, volume]);

  const togglePlayPause = () => {
    if (!audioRef.current || !currentSong) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(console.error);
    }
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
        toggleFavorite,
        playNext,
        playPrevious,
        showAddToPlaylist,
        downloadSong,
        isDownloaded,
        isDownloading,
        repeatMode,
        isShuffleOn,
        toggleRepeat,
        toggleShuffle,
        addSongToQueue,
        playSongNext,
        playShuffled,
        queue,
      }}
    >
      {children}

      {/* Add to Playlist Modal */}
      {playlistModalSongId && (
        <div className="modal-backdrop" onClick={() => setPlaylistModalSongId(null)}>
          <div className="glass-card playlist-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add to Playlist</h3>
              <button className="close-btn-mini" onClick={() => setPlaylistModalSongId(null)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="playlists-selection-list">
              {playlists.length === 0 ? (
                <div className="empty-playlists-notice">
                  <p>No playlists found.</p>
                </div>
              ) : (
                playlists.map(p => {
                  const isAdded = songPlaylistIds.includes(p.id);
                  return (
                    <div 
                      key={p.id} 
                      className={`playlist-select-item ${isAdded ? 'selected' : ''}`}
                      onClick={() => handleTogglePlaylist(p.id)}
                    >
                      <div className="playlist-info-mini">
                        <span className="playlist-name-mini">{p.name}</span>
                        <span className="playlist-count-mini">{p.songs_count || 0} songs</span>
                      </div>
                      <div className={`custom-checkbox ${isAdded ? 'checked' : ''}`}>
                        {isAdded && <Check size={14} strokeWidth={3} />}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.8);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 5000;
          animation: fadeIn 0.3s ease;
        }
        .playlist-modal {
          width: 360px;
          padding: 1.5rem;
          border: 1px solid rgba(255,255,255,0.1);
          box-shadow: 0 20px 50px rgba(0,0,0,0.5);
          animation: slideUpModal 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        @keyframes slideUpModal {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        .close-btn-mini {
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          transition: 0.2s;
        }
        .close-btn-mini:hover { color: white; transform: rotate(90deg); }
        .playlists-selection-list {
          max-height: 300px;
          overflow-y: auto;
          margin: 0 -0.5rem;
          padding: 0 0.5rem;
        }
        .playlist-select-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.8rem 1rem;
          margin-bottom: 0.5rem;
          border-radius: 8px;
          background: rgba(255,255,255,0.03);
          cursor: pointer;
          transition: 0.2s;
          border: 1px solid transparent;
        }
        .playlist-select-item:hover {
          background: rgba(255,255,255,0.08);
          transform: translateX(5px);
        }
        .playlist-select-item.selected {
          background: rgba(0, 243, 255, 0.05);
          border-color: rgba(0, 243, 255, 0.2);
        }
        .playlist-info-mini { display: flex; flex-direction: column; gap: 2px; }
        .playlist-name-mini { font-weight: 500; font-size: 0.95rem; }
        .playlist-count-mini { font-size: 0.75rem; color: var(--text-secondary); }
        
        .custom-checkbox {
          width: 22px;
          height: 22px;
          border: 2px solid rgba(255,255,255,0.2);
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: 0.3s;
          color: white;
        }
        .custom-checkbox.checked {
          background: var(--neon-blue);
          border-color: var(--neon-blue);
          box-shadow: 0 0 10px var(--neon-blue);
        }
        .empty-playlists-notice {
          padding: 2rem;
          text-align: center;
          color: var(--text-secondary);
          font-size: 0.9rem;
        }
      `}</style>
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) throw new Error('usePlayer must be used within PlayerProvider');
  return context;
};
