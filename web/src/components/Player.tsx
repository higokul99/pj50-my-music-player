import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Mic2 } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

const Player: React.FC = () => {
  const { currentSong, isPlaying, progress, duration, volume, togglePlayPause, setVolumeLevel, seek } = usePlayer();

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return '0:00';
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration ? (progress / duration) * 100 : 0;

  return (
    <div className="player-bar">
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ width: 56, height: 56, background: '#1a1a1a', borderRadius: 2 }} />
        <div>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 500 }}>{currentSong ? currentSong.title : 'No track selected'}</h4>
          <p style={{ fontSize: '0.9rem', marginTop: '4px' }}>{currentSong ? currentSong.artist.name : '-'}</p>
        </div>
      </div>
      
      <div className="player-controls" style={{ flex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <SkipBack size={24} color="var(--text-secondary)" style={{ cursor: 'pointer' }} />
          <button className="btn-play" onClick={togglePlayPause} style={{ width: 48, height: 48 }}>
            {isPlaying ? <Pause fill="currentColor" size={20} /> : <Play fill="currentColor" size={20} style={{ marginLeft: 4 }} />}
          </button>
          <SkipForward size={24} color="var(--text-secondary)" style={{ cursor: 'pointer' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%', maxWidth: '400px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{formatTime(progress)}</span>
          <div 
            style={{ flex: 1, height: '4px', background: 'var(--border-subtle)', position: 'relative', cursor: 'pointer' }}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const percent = ((e.clientX - rect.left) / rect.width) * 100;
              seek(percent);
            }}
          >
            <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${progressPercent}%`, background: 'var(--neon-purple)', boxShadow: '0 0 10px var(--neon-purple)' }} />
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Mobile Play Button (Hidden on Desktop) */}
      <div className="mobile-play-btn" style={{ display: 'none' }}>
        <button className="btn-play" onClick={togglePlayPause} style={{ width: 40, height: 40 }}>
           {isPlaying ? <Pause fill="currentColor" size={16} /> : <Play fill="currentColor" size={16} style={{ marginLeft: 3 }} />}
        </button>
      </div>

      <div className="player-volume" style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1.5rem' }}>
        <Mic2 size={20} color="var(--text-secondary)" />
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '120px' }}>
          <Volume2 size={20} color="var(--text-secondary)" />
          <div 
            style={{ flex: 1, height: '4px', background: 'var(--border-subtle)', cursor: 'pointer' }}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const vol = (e.clientX - rect.left) / rect.width;
              setVolumeLevel(Math.max(0, Math.min(1, vol)));
            }}
          >
            <div style={{ width: `${volume * 100}%`, height: '100%', background: 'var(--text-primary)' }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Player;
