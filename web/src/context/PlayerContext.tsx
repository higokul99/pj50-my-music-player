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
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize downloads list
  useEffect(() => {
    const initDownloads = async () => {
      await import('../services/DownloadService');
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
     try {
       const { DownloadService } = await import('../services/DownloadService');
       const success = await DownloadService.downloadSong(song);
       if (success) {
         setDownloadedSongIds(prev => [...prev, song.id]);
       }
     } catch (error) {
       console.error('Download failed', error);
     }
   };

  const isDownloaded = (songId: number) => {
    return downloadedSongIds.includes(songId);
  };

  const showAddToPlaylist = async (songId: number) => {
    setPlaylistModalSongId(songId);
    try {
      const { default: api } = await import('../services/api');
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
      const { default: api } = await import('../services/api');
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
      const { default: api } = await import('../services/api');
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
    }
    
    if (audioRef.current) {
      const { DownloadService } = await import('../services/DownloadService');
      const cachedUrl = await DownloadService.getCachedUrl(song.id);
      const streamUrl = cachedUrl || `http://localhost:8000/api/songs/${song.id}/stream`;
      
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
  }, [currentSong]);

  // Play next song in the queue
  const playNext = useCallback(() => {
    if (queue.length === 0 || !currentSong) return;
    
    const currentIndex = queue.findIndex(s => s.id === currentSong.id);
    if (currentIndex === -1) {
      // If current song isn't in queue, just play the first song
      playSong(queue[0]);
    } else {
      const nextIndex = (currentIndex + 1) % queue.length;
      playSong(queue[nextIndex]);
    }
  }, [queue, currentSong, playSong]);

  // Play previous song in the queue
  const playPrevious = useCallback(() => {
    if (queue.length === 0 || !currentSong) return;
    
    const currentIndex = queue.findIndex(s => s.id === currentSong.id);
    if (currentIndex === -1) {
      playSong(queue[0]);
    } else {
      const prevIndex = (currentIndex - 1 + queue.length) % queue.length;
      playSong(queue[prevIndex]);
    }
  }, [queue, currentSong, playSong]);

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
  }, [playNext, volume]); // Added playNext as dependency for the auto-play listener

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
