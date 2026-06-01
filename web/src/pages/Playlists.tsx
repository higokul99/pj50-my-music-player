import React, { useState, useEffect } from 'react';
import { Plus, Library, Music, Play, Trash2, X } from 'lucide-react';
import api from '../services/api';
import { Link } from 'react-router-dom';

const Playlists: React.FC = () => {
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDesc, setNewPlaylistDesc] = useState('');

  const fetchPlaylists = async () => {
    try {
      const response = await api.get('/playlists');
      setPlaylists(response.data.data);
    } catch (error) {
      console.error('Failed to fetch playlists', error);
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const handleCreatePlaylist = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/playlists', {
        name: newPlaylistName,
        description: newPlaylistDesc
      });
      setNewPlaylistName('');
      setNewPlaylistDesc('');
      setShowCreateModal(false);
      fetchPlaylists();
    } catch (error) {
      console.error('Failed to create playlist', error);
    }
  };

  const handleDeletePlaylist = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this playlist?')) return;
    try {
      await api.delete(`/playlists/${id}`);
      fetchPlaylists();
    } catch (error) {
      console.error('Failed to delete playlist', error);
    }
  };

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <div style={{ marginBottom: '3rem' }}>
        <p style={{ textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
          Your Library
        </p>
        <h2 style={{ fontSize: '2.5rem', display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <Library size={32} color="var(--neon-blue)" />
          Playlists
        </h2>
        
        <button 
          className="btn-glass-3d blue"
          onClick={() => setShowCreateModal(true)}
          style={{ padding: '10px 24px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}
        >
          <Plus size={20} />
          Create New Playlist
        </button>
      </div>

      {playlists.length === 0 ? (
        <div style={{ 
          height: '40vh', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          background: 'rgba(255,255,255,0.02)',
          borderRadius: '12px',
          border: '1px dashed rgba(255,255,255,0.1)'
        }}>
          <Library size={48} opacity={0.2} style={{ marginBottom: '1rem' }} />
          <p style={{ color: 'var(--text-secondary)' }}>You haven't created any playlists yet.</p>
          <button 
            className="btn-glass-3d blue" 
            onClick={() => setShowCreateModal(true)}
            style={{ marginTop: '1.5rem', padding: '10px 24px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}
          >
            <Plus size={20} />
            Create your first playlist
          </button>
        </div>
      ) : (
        <div className="playlists-list-container">
          {playlists.map((playlist, index) => (
            <div key={playlist.id} className="playlist-list-item glass-card">
              <div className="playlist-prefix">
                <span className="index-number">{index + 1}</span>
              </div>

              <div className="playlist-artwork-mini">
                <Music size={20} color="var(--neon-blue)" opacity={0.4} />
              </div>

              <div className="playlist-details-mini">
                <Link to={`/playlists/${playlist.id}`} className="playlist-link">
                  <h3 className="playlist-title-mini">{playlist.name}</h3>
                </Link>
                <p className="playlist-info-mini">
                  {playlist.songs_count || 0} songs • {playlist.description || 'No description'}
                </p>
              </div>

              <div className="playlist-actions-mini">
                <Link to={`/playlists/${playlist.id}`} className="action-icon-btn">
                  <Play size={20} fill="currentColor" />
                </Link>
                <button 
                  onClick={() => handleDeletePlaylist(playlist.id)}
                  className="action-icon-btn remove-btn"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="modal-backdrop">
          <div className="glass-card modal-content" style={{ width: '400px', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3>New Playlist</h3>
              <button onClick={() => setShowCreateModal(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleCreatePlaylist}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.5rem', opacity: 0.7 }}>Name</label>
                <input 
                  type="text" 
                  value={newPlaylistName} 
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  style={{ 
                    width: '100%', padding: '12px', background: 'rgba(0,0,0,0.3)', 
                    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', color: 'white'
                  }}
                  placeholder="My Awesome Playlist"
                  required
                />
              </div>
              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.5rem', opacity: 0.7 }}>Description (Optional)</label>
                <textarea 
                  value={newPlaylistDesc} 
                  onChange={(e) => setNewPlaylistDesc(e.target.value)}
                  style={{ 
                    width: '100%', padding: '12px', background: 'rgba(0,0,0,0.3)', 
                    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', color: 'white',
                    height: '100px', resize: 'none'
                  }}
                  placeholder="A collection of my favorite tracks"
                />
              </div>
              <button type="submit" className="btn-glass-3d blue" style={{ width: '100%' }}>
                Create
              </button>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .playlists-list-container {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
          padding-bottom: 2rem;
        }

        .playlist-list-item {
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

        .playlist-list-item:hover {
          background: rgba(255, 255, 255, 0.05);
          transform: translateX(5px);
          border-color: rgba(255, 255, 255, 0.1);
        }

        .playlist-prefix {
          width: 24px;
          display: flex;
          justify-content: center;
          color: var(--text-secondary);
          font-size: 0.85rem;
          font-weight: 500;
        }

        .playlist-artwork-mini {
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
          border: 1px solid rgba(0, 243, 255, 0.1);
        }

        .playlist-details-mini {
          flex: 1;
          min-width: 0;
        }

        .playlist-link {
          text-decoration: none;
          color: inherit;
        }

        .playlist-title-mini {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 0.1rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .playlist-info-mini {
          font-size: 0.8rem;
          color: var(--text-secondary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .playlist-actions-mini {
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
          text-decoration: none;
        }

        .action-icon-btn:hover {
          color: white;
          background: rgba(255,255,255,0.1);
          transform: scale(1.1);
        }

        .remove-btn:hover {
          color: #ff4444;
        }

        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.8);
          backdrop-filter: blur(5px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
        }

        @media (max-width: 480px) {
          .playlist-list-item {
            gap: 1rem;
            padding: 0.6rem 0.8rem !important;
          }
          .playlist-prefix { display: none; }
          .playlist-artwork-mini { width: 44px; height: 44px; }
          .playlist-title-mini { font-size: 0.95rem; }
        }
      `}</style>
    </div>
  );
};

export default Playlists;
