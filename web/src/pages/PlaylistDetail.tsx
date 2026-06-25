import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Music, Trash2, ArrowLeft, Download, CheckCircle, Loader2, Shuffle, ArrowRightCircle, PlusSquare } from 'lucide-react';
import api from '../services/api';
import { usePlayer } from '../context/PlayerContext';

const PlaylistDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [playlist, setPlaylist] = useState<any>(null);
  const [songs, setSongs] = useState<any[]>([]);
  const { playSong, playShuffled, currentSong, isPlaying, downloadSong, isDownloaded, isDownloading, playSongNext, addSongToQueue } = usePlayer();

  const handleShufflePlay = () => {
    if (songs.length === 0) return;
    playShuffled(songs);
  };

  const fetchPlaylistDetail = async () => {
    try {
      const response = await api.get(`/playlists/${id}`);
      setPlaylist(response.data.data.playlist);
      setSongs(response.data.data.songs);
    } catch (error) {
      console.error('Failed to fetch playlist detail', error);
      navigate('/playlists');
    }
  };

  useEffect(() => {
    fetchPlaylistDetail();
  }, [id]);

  const handleRemoveSong = async (songId: number) => {
    try {
      await api.delete(`/playlists/${id}/songs`, { data: { song_id: songId } });
      fetchPlaylistDetail();
    } catch (error) {
      console.error('Failed to remove song from playlist', error);
    }
  };

  if (!playlist) return null;

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <button 
        onClick={() => navigate('/playlists')}
        style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}
      >
        <ArrowLeft size={20} />
        Back to Playlists
      </button>

      <div className="playlist-header-container">
        <div className="playlist-cover-large">
          <Music size={100} color="var(--neon-blue)" opacity={0.4} />
        </div>
        
        <div className="playlist-info-large">
          <p className="playlist-label">Playlist</p>
          <h1 className="playlist-name-large">{playlist.name}</h1>
          <p className="playlist-desc-large">{playlist.description || 'No description'}</p>
          
          <div className="playlist-actions-large">
            <button 
              className="btn-glass-3d blue play-all-btn"
              onClick={() => songs.length > 0 && playSong(songs[0], songs)}
              disabled={songs.length === 0}
              style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}
            >
              <Play fill="white" size={20} />
              Play All
            </button>
            <button 
              className="btn-glass-3d purple play-all-btn"
              onClick={handleShufflePlay}
              disabled={songs.length === 0}
              style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}
            >
              <Shuffle size={20} />
              Shuffle
            </button>
            <p className="song-count-label">{songs.length} songs</p>
          </div>
        </div>
      </div>

      {/* Song List */}
      <div className="songs-list-container">
        {songs.length === 0 ? (
          <div style={{ padding: '4rem', textAlign: 'center', opacity: 0.5 }}>
            <p>This playlist is empty. Add some songs to get started!</p>
          </div>
        ) : (
          songs.map((song, index) => (
            <div 
              key={song.id}
              className={`song-list-item glass-card ${currentSong?.id === song.id ? 'active' : ''}`}
              onClick={() => playSong(song, songs)}
            >
              <div className="song-prefix">
                {currentSong?.id === song.id && isPlaying ? (
                  <div className="mini-visualizer-bars">
                    <span></span><span></span><span></span>
                  </div>
                ) : (
                  <span className="index-number">{index + 1}</span>
                )}
              </div>
              
              <div className="song-artwork-mini">
                {song.cover_image ? (
                  <img src={`http://localhost:8000${song.cover_image}`} alt="" />
                ) : (
                  <Music size={20} opacity={0.3} />
                )}
              </div>

              <div className="song-details-mini">
                <h3 className="song-title-mini">{song.title}</h3>
                <p className="song-artist-mini">{song.artist?.name || 'Unknown Artist'} • {song.album?.title || 'Single'}</p>
              </div>

              <div className="song-actions-mini">
                <button
                  onClick={(e) => { e.stopPropagation(); downloadSong(song); }}
                  className={`action-icon-btn ${isDownloaded(song.id) ? 'downloaded' : ''} ${isDownloading(song.id) ? 'downloading' : ''}`}
                  title={isDownloaded(song.id) ? "Downloaded" : isDownloading(song.id) ? "Downloading..." : "Download"}
                  disabled={isDownloaded(song.id) || isDownloading(song.id)}
                >
                  {isDownloaded(song.id) ? (
                    <CheckCircle size={20} color="var(--neon-blue)" />
                  ) : isDownloading(song.id) ? (
                    <Loader2 className="animate-spin" size={20} color="var(--neon-purple)" />
                  ) : (
                    <Download size={20} />
                  )}
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); addSongToQueue(song); }}
                  className="action-icon-btn"
                  title="Add to Queue"
                >
                  <PlusSquare size={20} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); playSongNext(song); }}
                  className="action-icon-btn"
                  title="Play Next"
                >
                  <ArrowRightCircle size={20} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleRemoveSong(song.id); }}
                  className="action-icon-btn remove-btn"
                  title="Remove from Playlist"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <style>{`
        .playlist-header-container {
          display: flex;
          gap: 2.5rem;
          margin-bottom: 3rem;
          align-items: flex-end;
        }
        .playlist-cover-large {
          width: 200px;
          height: 200px;
          background: linear-gradient(135deg, #1a1a1a, #0a0a0a);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 15px 35px rgba(0,0,0,0.5);
          overflow: hidden;
          flex-shrink: 0;
        }
        .playlist-info-large {
          flex: 1;
          min-width: 0;
        }
        .playlist-label {
          text-transform: uppercase;
          letter-spacing: 0.2em;
          font-size: 0.8rem;
          color: var(--neon-blue);
          margin-bottom: 0.5rem;
        }
        .playlist-name-large {
          font-size: clamp(2rem, 8vw, 3.5rem);
          line-height: 1.1;
          font-weight: 800;
          margin-bottom: 1rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .playlist-desc-large {
          color: var(--text-secondary);
          margin-bottom: 1.5rem;
          font-size: 1.1rem;
        }
        .playlist-actions-large {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }
        .play-all-btn {
          padding: 10px 24px;
          font-size: 1rem;
        }
        .song-count-label {
          font-weight: 500;
        }

        .songs-list-container {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
          padding-bottom: 2rem;
        }

        .song-list-item {
          display: flex;
          align-items: center;
          padding: 0.6rem 1rem !important;
          gap: 1.2rem;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid rgba(255,255,255,0.05);
          position: relative;
          overflow: hidden;
        }

        .song-list-item:hover {
          background: rgba(255, 255, 255, 0.05);
          transform: translateX(5px);
          border-color: rgba(255, 255, 255, 0.1);
        }

        .song-list-item.active {
          background: rgba(0, 243, 255, 0.05);
          border-color: var(--neon-blue);
          box-shadow: 0 0 15px rgba(0, 243, 255, 0.1);
        }

        .song-prefix {
          width: 24px;
          display: flex;
          justify-content: center;
          color: var(--text-secondary);
          font-size: 0.85rem;
          font-weight: 500;
        }

        .song-artwork-mini {
          width: 44px;
          height: 44px;
          border-radius: 6px;
          background: rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          flex-shrink: 0;
          box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        }

        .song-artwork-mini img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .song-details-mini {
          flex: 1;
          min-width: 0;
        }

        .song-title-mini {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 0.1rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .song-artist-mini {
          font-size: 0.8rem;
          color: var(--text-secondary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .song-actions-mini {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .action-icon-btn {
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          padding: 8px;
          border-radius: 50%;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .action-icon-btn:hover {
          color: white;
          background: rgba(255,255,255,0.1);
          transform: scale(1.1);
        }

        .remove-btn:hover {
          color: #ff4444;
        }

        .mini-visualizer-bars {
          display: flex;
          align-items: flex-end;
          gap: 2px;
          height: 16px;
        }

        .mini-visualizer-bars span {
          width: 3px;
          background: var(--neon-blue);
          animation: bounce 0.6s ease infinite alternate;
          box-shadow: 0 0 5px var(--neon-blue);
        }

        .mini-visualizer-bars span:nth-child(2) { animation-delay: 0.15s; }
        .mini-visualizer-bars span:nth-child(3) { animation-delay: 0.3s; }

        @keyframes bounce {
          from { height: 4px; }
          to { height: 100%; }
        }

        @media (max-width: 768px) {
          .playlist-header-container {
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: 1.5rem;
          }
          .playlist-cover-large {
            width: 180px;
            height: 180px;
          }
          .playlist-name-large {
            white-space: normal;
            font-size: 2.5rem;
          }
          .playlist-actions-large {
            justify-content: center;
            flex-direction: column;
            gap: 1rem;
          }
        }

        @media (max-width: 480px) {
          .song-list-item {
            gap: 1rem;
            padding: 0.6rem 0.8rem !important;
          }
          .song-prefix { display: none; }
          .song-artwork-mini { width: 44px; height: 44px; }
          .song-title-mini { font-size: 0.95rem; }
        }
      `}</style>
    </div>
  );
};

export default PlaylistDetail;
