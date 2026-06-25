import React, { useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Mic2, Maximize2, Music, Shuffle, Repeat, Repeat1 } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import FullscreenPlayer from './FullscreenPlayer';

const Player: React.FC = () => {
  const { currentSong, isPlaying, progress, duration, volume, togglePlayPause, setVolumeLevel, seek, playNext, playPrevious, repeatMode, isShuffleOn, toggleRepeat, toggleShuffle } = usePlayer();
  const [showFullscreen, setShowFullscreen] = useState(false);

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return '0:00';
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration ? (progress / duration) * 100 : 0;

  const handleOpenFullscreen = (e: React.MouseEvent) => {
    // Prevent opening if clicking controls
    if ((e.target as HTMLElement).closest('.player-controls') || (e.target as HTMLElement).closest('.player-volume')) {
      return;
    }
    if (currentSong) {
      setShowFullscreen(true);
    }
  };

  return (
    <>
      <div className="player-bar" onClick={handleOpenFullscreen} style={{ cursor: currentSong ? 'pointer' : 'default' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ 
            width: 56, 
            height: 56, 
            background: '#141416', 
            borderRadius: '50%', 
            overflow: 'hidden', 
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1.5px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 4px 10px rgba(0,0,0,0.4)',
            transition: 'transform 0.5s ease'
          }}
          className={isPlaying && !currentSong?.cover_image ? 'animate-spin' : ''}
          >
            {currentSong?.cover_image ? (
              <img 
                src={`http://localhost:8000${currentSong.cover_image}`} 
                alt={currentSong.title} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            ) : (
              <Music 
                size={22} 
                color="var(--neon-blue)" 
              />
            )}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {currentSong ? currentSong.title : 'No track selected'}
            </h4>
            <p style={{ fontSize: '0.9rem', marginTop: '4px', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {currentSong ? currentSong.artist.name : '-'}
            </p>
          </div>
        </div>
        
        <div className="player-controls" onClick={(e) => e.stopPropagation()} style={{ flex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <button className="nav-btn-small" title="Shuffle" onClick={toggleShuffle} style={{ color: isShuffleOn ? 'var(--neon-blue)' : 'var(--text-secondary)' }}>
              <Shuffle size={18} />
            </button>
            <button className="nav-btn-small" title="Previous" onClick={playPrevious}><SkipBack size={20} /></button>
            <button className="btn-play" onClick={togglePlayPause} style={{ width: 44, height: 44 }}>
              {isPlaying ? <Pause fill="currentColor" size={18} /> : <Play fill="currentColor" size={18} style={{ marginLeft: 3 }} />}
            </button>
            <button className="nav-btn-small" title="Next" onClick={playNext}><SkipForward size={20} /></button>
            <button className="nav-btn-small" title="Repeat" onClick={toggleRepeat} style={{ color: repeatMode !== 'off' ? 'var(--neon-pink)' : 'var(--text-secondary)' }}>
              {repeatMode === 'one' ? <Repeat1 size={18} /> : <Repeat size={18} />}
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%', maxWidth: '500px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', minWidth: '35px' }}>{formatTime(progress)}</span>
            <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input 
                type="range"
                min="0"
                max={duration || 100}
                value={progress}
                onChange={(e) => seek((parseFloat(e.target.value) / (duration || 100)) * 100)}
                className="player-slider progress-slider"
              />
              <div 
                style={{ 
                  position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
                  height: '4px', width: `${progressPercent}%`, 
                  background: 'var(--neon-purple)', boxShadow: '0 0 10px var(--neon-purple)',
                  pointerEvents: 'none', borderRadius: '2px'
                }} 
              />
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', minWidth: '35px' }}>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="player-volume" onClick={(e) => e.stopPropagation()} style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1.2rem' }}>
          <button 
            className="icon-btn-secondary"
            onClick={() => setShowFullscreen(true)}
            title="Expand"
          >
            <Maximize2 size={18} />
          </button>
          <button className="icon-btn-secondary"><Mic2 size={18} /></button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', width: '100px' }}>
            <Volume2 size={18} color="var(--text-secondary)" />
            <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input 
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => setVolumeLevel(parseFloat(e.target.value))}
                className="player-slider volume-slider"
              />
              <div 
                style={{ 
                  position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
                  height: '4px', width: `${volume * 100}%`, 
                  background: 'var(--text-primary)',
                  pointerEvents: 'none', borderRadius: '2px'
                }} 
              />
            </div>
          </div>
        </div>
      </div>

      {showFullscreen && currentSong && (
        <FullscreenPlayer onClose={() => setShowFullscreen(false)} />
      )}

      <style>{`
        .nav-btn-small {
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          transition: 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .nav-btn-small:hover { color: var(--text-primary); transform: scale(1.1); }

        .icon-btn-secondary {
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          transition: 0.2s;
          padding: 4px;
        }
        .icon-btn-secondary:hover { color: var(--neon-blue); transform: scale(1.1); }

        .player-slider {
          -webkit-appearance: none;
          width: 100%;
          background: rgba(255,255,255,0.1);
          height: 4px;
          border-radius: 2px;
          outline: none;
          cursor: pointer;
        }
        .player-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 12px;
          height: 12px;
          background: #fff;
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid #121212;
          box-shadow: 0 0 5px rgba(0,0,0,0.5);
          position: relative;
          z-index: 5;
        }
        .progress-slider::-webkit-slider-thumb {
          background: var(--neon-purple);
          box-shadow: 0 0 8px var(--neon-purple);
        }
        .player-slider:hover::-webkit-slider-thumb {
          transform: scale(1.2);
        }
      `}</style>
    </>
  );
};

export default Player;
