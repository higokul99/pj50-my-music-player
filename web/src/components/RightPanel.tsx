import React from 'react';
import { Music, Disc, Info, Heart, ListMusic } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

const RightPanel: React.FC = () => {
  const { currentSong, isPlaying, toggleFavorite } = usePlayer();

  const baseURL = import.meta.env.MODE === 'production' 
    ? window.location.origin 
    : 'http://localhost:8000';

  if (!currentSong) {
    return null;
  }

  return (
    <aside className="right-panel">
      <div className="panel-header">
        <h3>Now Playing</h3>
      </div>
      
      <div className="song-detail-container">
        {/* Cover Art Area */}
        <div className="cover-art-wrapper">
          {currentSong.cover_image ? (
            <div className={`album-art-container ${isPlaying ? 'playing' : ''}`}>
              <img 
                src={`${baseURL}${currentSong.cover_image}`} 
                alt={currentSong.title} 
                className="cover-image"
              />
              <div className="vinyl-overlay">
                <Disc size={20} className="vinyl-center-icon animate-spin" />
              </div>
            </div>
          ) : (
            <div className={`album-art-container fallback ${isPlaying ? 'playing' : ''}`}>
              <div className="vinyl-record">
                <div className="vinyl-grooves"></div>
                <div className="vinyl-label">
                  <Music size={24} className={isPlaying ? 'animate-spin' : ''} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Song Info */}
        <div className="song-metadata">
          <div className="title-row">
            <h4 className="song-title">{currentSong.title}</h4>
            <button 
              className={`fav-btn-right ${currentSong.is_favorite ? 'active' : ''}`}
              onClick={() => toggleFavorite(currentSong.id)}
              title={currentSong.is_favorite ? 'Remove from Favorites' : 'Add to Favorites'}
            >
              <Heart size={18} fill={currentSong.is_favorite ? 'var(--neon-pink)' : 'none'} />
            </button>
          </div>
          <p className="artist-name">{currentSong.artist?.name || 'Unknown Artist'}</p>
          {currentSong.album && (
            <div className="album-tag">
              <ListMusic size={14} />
              <span>{currentSong.album.title}</span>
            </div>
          )}
        </div>

        {/* Credits Panel */}
        <div className="credits-panel glass-card">
          <div className="credits-header">
            <Info size={16} />
            <h5>Credits</h5>
          </div>
          <div className="credits-list">
            <div className="credit-item">
              <span className="credit-role">Performed By</span>
              <span className="credit-name">{currentSong.artist?.name || 'Unknown Artist'}</span>
            </div>
            {currentSong.album && (
              <div className="credit-item">
                <span className="credit-role">Album</span>
                <span className="credit-name">{currentSong.album.title}</span>
              </div>
            )}
            <div className="credit-item">
              <span className="credit-role">Released Via</span>
              <span className="credit-name">MusiqSphere</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default RightPanel;
