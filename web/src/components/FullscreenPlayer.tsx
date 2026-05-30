import React from 'react';
import { X, Play, Pause, SkipBack, SkipForward, Heart, ListPlus, Volume2 } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

interface FullscreenPlayerProps {
  onClose: () => void;
}

const FullscreenPlayer: React.FC<FullscreenPlayerProps> = ({ onClose }) => {
  const { currentSong, isPlaying, progress, duration, togglePlayPause, seek, volume, setVolumeLevel, toggleFavorite, playNext, playPrevious, showAddToPlaylist } = usePlayer();

  if (!currentSong) return null;

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return '0:00';
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration ? (progress / duration) * 100 : 0;

  return (
    <div className="fullscreen-player">
      {/* Background with Blur */}
      <div 
        className="player-bg" 
        style={{ 
          backgroundImage: currentSong.cover_image ? `url(http://localhost:8000${currentSong.cover_image})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(100px) brightness(0.3)',
          position: 'absolute',
          inset: 0,
          zIndex: -1
        }} 
      />

      {/* Header */}
      <div className="player-header">
        <button onClick={onClose} className="close-btn">
          <X size={28} />
        </button>
        <div className="header-info">
          <p>NOW PLAYING</p>
          <h3>{currentSong.album?.title || 'Single'}</h3>
        </div>
        <div style={{ width: 28 }} /> {/* Spacer */}
      </div>

      {/* Content */}
      <div className="player-main-content">
        {/* Rotating Disk */}
        <div className="disk-container">
          <div className={`music-disk ${isPlaying ? 'rotating' : ''}`}>
            {/* Vinyl Texture */}
            <div className="vinyl-grooves"></div>
            
            {/* Song Cover in Middle */}
            <div className="disk-center">
              {currentSong.cover_image ? (
                <img src={`http://localhost:8000${currentSong.cover_image}`} alt={currentSong.title} />
              ) : (
                <div className="disk-placeholder">
                  <Play fill="rgba(255,255,255,0.2)" size={40} />
                </div>
              )}
            </div>
            
            {/* Center Hole */}
            <div className="disk-hole"></div>
          </div>
          
          {/* Tone Arm (Stylus) */}
          <div className={`tone-arm ${isPlaying ? 'active' : ''}`}></div>
        </div>

        {/* Info & Controls */}
        <div className="player-controls-view">
          <div className="song-metadata">
            <div>
              <h2 className="song-title-large">{currentSong.title}</h2>
              <p className="artist-name-large">{currentSong.artist.name}</p>
            </div>
            <div className="action-buttons">
              <button 
                className={`action-btn ${currentSong.is_favorite ? 'favorited' : ''}`}
                onClick={() => toggleFavorite(currentSong.id)}
              >
                <Heart size={24} fill={currentSong.is_favorite ? 'var(--neon-pink)' : 'none'} />
              </button>
              <button 
                className="action-btn"
                onClick={() => showAddToPlaylist(currentSong.id)}
              >
                <ListPlus size={24} />
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="progress-container-large">
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', marginBottom: '0.6rem' }}>
              <input 
                type="range"
                min="0"
                max={duration || 100}
                value={progress}
                onChange={(e) => seek((parseFloat(e.target.value) / (duration || 100)) * 100)}
                className="fullscreen-slider progress-slider-large"
              />
              <div 
                style={{ 
                  position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
                  height: '5px', width: `${progressPercent}%`, 
                  background: 'linear-gradient(to right, var(--neon-purple), var(--neon-pink))',
                  boxShadow: '0 0 15px var(--neon-purple)',
                  pointerEvents: 'none', borderRadius: '3px'
                }} 
              />
            </div>
            <div className="time-info">
              <span>{formatTime(progress)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="main-playback-controls">
            <button className="nav-btn" onClick={playPrevious}><SkipBack size={40} fill="currentColor" /></button>
            <button className="play-pause-btn-large" onClick={togglePlayPause}>
              {isPlaying ? <Pause size={48} fill="currentColor" /> : <Play size={48} fill="currentColor" style={{ marginLeft: 6 }} />}
            </button>
            <button className="nav-btn" onClick={playNext}><SkipForward size={40} fill="currentColor" /></button>
          </div>

          {/* Volume */}
          <div className="volume-control-large">
            <Volume2 size={20} color="var(--text-secondary)" />
            <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.01" 
                value={volume} 
                onChange={(e) => setVolumeLevel(parseFloat(e.target.value))}
                className="fullscreen-slider volume-slider-large"
              />
              <div 
                style={{ 
                  position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
                  height: '4px', width: `${volume * 100}%`, 
                  background: 'rgba(255,255,255,0.8)',
                  pointerEvents: 'none', borderRadius: '2px'
                }} 
              />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .fullscreen-player {
          position: fixed;
          inset: 0;
          background: #000;
          z-index: 1000;
          display: flex;
          flex-direction: column;
          padding: 1.5rem 2rem;
          color: white;
          animation: slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          overflow-y: auto;
          overflow-x: hidden;
        }

        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }

        .player-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          flex-shrink: 0;
        }

        .close-btn {
          background: rgba(255,255,255,0.1);
          border: none;
          color: white;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: 0.3s;
        }

        .close-btn:hover { background: rgba(255,255,255,0.2); }

        .header-info { text-align: center; }
        .header-info p { font-size: 0.65rem; letter-spacing: 0.3em; opacity: 0.6; margin-bottom: 0.1rem; }
        .header-info h3 { font-size: 0.9rem; font-weight: 500; }

        .player-main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          max-width: 600px;
          margin: 0 auto;
          width: 100%;
          padding-bottom: 1rem;
        }

        /* Disk Animation */
        .disk-container {
          position: relative;
          width: min(320px, 60vh);
          height: min(320px, 60vh);
          margin-bottom: 1.5rem;
          flex-shrink: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .music-disk {
          width: 100%;
          height: 100%;
          background: #111;
          border-radius: 50%;
          position: relative;
          box-shadow: 0 0 50px rgba(0,0,0,0.8), inset 0 0 20px rgba(255,255,255,0.05);
          border: 4px solid #1a1a1a;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.8s ease;
        }

        .vinyl-grooves {
          position: absolute;
          inset: 5px;
          border-radius: 50%;
          background: repeating-radial-gradient(
            circle at center,
            #111,
            #111 2px,
            #181818 3px,
            #111 4px
          );
          opacity: 0.4;
        }

        .disk-center {
          width: 38%;
          height: 38%;
          border-radius: 50%;
          overflow: hidden;
          z-index: 2;
          background: #222;
          box-shadow: 0 0 20px rgba(0,0,0,0.5);
        }

        .disk-center img { width: 100%; height: 100%; objectFit: cover; }
        .disk-placeholder { width: 100%; height: 100%; display: flex; alignItems: center; justifyContent: center; }

        .disk-hole {
          position: absolute;
          width: 4%;
          height: 4%;
          background: #000;
          border-radius: 50%;
          z-index: 3;
          border: 1px solid rgba(255,255,255,0.1);
        }

        .rotating {
          animation: rotateDisk 10s linear infinite;
        }

        @keyframes rotateDisk {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Tone Arm */
        .tone-arm {
          position: absolute;
          top: -10%;
          right: 5%;
          width: 6%;
          height: 45%;
          background: #444;
          border-radius: 10px;
          transform-origin: top center;
          transform: rotate(-30deg);
          transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 10;
        }

        .tone-arm::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: -20%;
          width: 140%;
          height: 25%;
          background: #333;
          border-radius: 4px;
        }

        .tone-arm.active { transform: rotate(5deg); }

        /* Controls UI */
        .player-controls-view { width: 100%; flex-shrink: 0; }

        .song-metadata {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .song-title-large { font-size: 1.8rem; font-weight: 700; margin-bottom: 0.3rem; }
        .artist-name-large { font-size: 1.1rem; color: var(--neon-purple); font-weight: 500; }

        .action-buttons { display: flex; gap: 0.8rem; }
        .action-btn { background: none; border: none; color: white; opacity: 0.6; cursor: pointer; transition: 0.3s; }
        .action-btn:hover { opacity: 1; transform: scale(1.1); }
        .action-btn.favorited { opacity: 1; color: var(--neon-pink); filter: drop-shadow(0 0 8px var(--neon-pink)); }

        /* Progress Bar */
        .progress-container-large { margin-bottom: 1.5rem; }
        
        .fullscreen-slider {
          -webkit-appearance: none;
          width: 100%;
          background: rgba(255,255,255,0.1);
          height: 5px;
          border-radius: 3px;
          outline: none;
          cursor: pointer;
        }

        .fullscreen-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 14px;
          height: 14px;
          background: white;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(0,0,0,0.5);
          position: relative;
          z-index: 2;
        }

        .progress-slider-large::-webkit-slider-thumb {
          background: white;
          border: 2px solid var(--neon-purple);
        }

        .time-info { display: flex; justify-content: space-between; font-size: 0.75rem; opacity: 0.5; }

        /* Playback Buttons */
        .main-playback-controls {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 2.5rem;
          margin-bottom: 1.5rem;
        }

        .nav-btn { background: none; border: none; color: white; cursor: pointer; transition: 0.3s; padding: 0.5rem; }
        .nav-btn:hover { color: var(--neon-blue); transform: scale(1.1); }

        .play-pause-btn-large {
          width: 76px;
          height: 76px;
          background: white;
          color: black;
          border: none;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: 0.3s;
          box-shadow: 0 0 30px rgba(255,255,255,0.2);
          flex-shrink: 0;
        }

        .play-pause-btn-large:hover { transform: scale(1.05); box-shadow: 0 0 40px rgba(255,255,255,0.4); }

        /* Volume Slider */
        .volume-control-large {
          display: flex;
          align-items: center;
          gap: 1.2rem;
          opacity: 0.6;
        }

        .volume-slider-large {
          flex: 1;
        }

        @media (max-height: 700px) {
          .fullscreen-player { padding: 1rem 1.5rem; }
          .player-header { margin-bottom: 1rem; }
          .disk-container { width: min(240px, 45vh); height: min(240px, 45vh); margin-bottom: 1rem; }
          .song-title-large { font-size: 1.5rem; }
          .main-playback-controls { margin-bottom: 1rem; }
          .play-pause-btn-large { width: 64px; height: 64px; }
        }

        @media (max-width: 480px) {
          .fullscreen-player { padding: 1.5rem 1rem; }
          .disk-container { width: min(280px, 50vh); height: min(280px, 50vh); }
          .song-title-large { font-size: 1.6rem; }
          .main-playback-controls { gap: 1.5rem; }
        }
      `}</style>
    </div>
  );
};

export default FullscreenPlayer;
