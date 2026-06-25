import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2, Trash2, ArrowLeft, Search, Music, Save, X } from 'lucide-react';
import api from '../services/api';

const SongManagement: React.FC = () => {
  const navigate = useNavigate();
  const [songs, setSongs] = useState<any[]>([]);
  const [artists, setArtists] = useState<any[]>([]);
  const [albums, setAlbums] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalSongs, setTotalSongs] = useState(0);
  
  // Edit Modal State
  const [editingSong, setEditingSong] = useState<any | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editArtistId, setEditArtistId] = useState('');
  const [editAlbumId, setEditAlbumId] = useState('');
  const [editGenre, setEditGenre] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchStaticData = async () => {
    try {
      const [artistsRes, albumsRes] = await Promise.all([
        api.get('/artists'),
        api.get('/albums')
      ]);
      setArtists(artistsRes.data.data);
      setAlbums(albumsRes.data.data);
    } catch (error) {
      console.error('Failed to fetch static data', error);
    }
  };

  const fetchSongs = async () => {
    setLoading(true);
    try {
      const songsRes = await api.get('/songs', {
        params: {
          page: page,
          q: searchTerm || undefined
        }
      });
      const responseData = songsRes.data.data;
      if (responseData && responseData.data) {
        setSongs(responseData.data);
        setTotalPages(responseData.meta?.last_page || 1);
        setTotalSongs(responseData.meta?.total || responseData.data.length);
      } else {
        setSongs(responseData || []);
        setTotalPages(1);
        setTotalSongs(responseData?.length || 0);
      }
    } catch (error) {
      console.error('Failed to fetch songs', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaticData();
  }, []);

  useEffect(() => {
    fetchSongs();
  }, [page, searchTerm]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1); // Reset to page 1 on new search query
  };

  const handleEditClick = (song: any) => {
    setEditingSong(song);
    setEditTitle(song.title);
    setEditArtistId(song.artist_id?.toString() || '');
    setEditAlbumId(song.album_id?.toString() || '');
    setEditGenre(song.genre || '');
  };

  const handleUpdateSong = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSong) return;

    setIsUpdating(true);
    try {
      await api.put(`/songs/${editingSong.id}`, {
        title: editTitle,
        artist_id: editArtistId,
        album_id: editAlbumId || null,
        genre: editGenre
      });
      alert('Song updated successfully');
      setEditingSong(null);
      fetchSongs(); // Refresh list
    } catch (error) {
      console.error('Update failed', error);
      alert('Failed to update song');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteSong = async (songId: number) => {
    if (!window.confirm('Are you sure you want to delete this song from cloud? This will remove it from the database and storage.')) {
      return;
    }

    try {
      await api.delete(`/songs/${songId}`);
      alert('Song deleted from cloud');
      fetchSongs(); // Refresh list to get updated count and next page if current becomes empty
    } catch (error) {
      console.error('Delete failed', error);
      alert('Failed to delete song');
    }
  };

  const filteredSongs = songs.filter(s => 
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.artist?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.05)',
    border: '1px solid var(--border-subtle)', borderRadius: '4px', color: 'white',
    outline: 'none', marginBottom: '1rem', fontSize: '0.95rem'
  };

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
        <button 
          onClick={() => navigate('/admin/upload')}
          style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <ArrowLeft size={20} />
          Back to Configuration
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '2rem', borderLeft: '4px solid var(--neon-pink)', paddingLeft: '1rem' }}>Manage Songs</h2>
        <div style={{ position: 'relative', width: '300px' }}>
          <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={18} />
          <input 
            type="text" placeholder="Search your tracks..." 
            value={searchTerm} onChange={handleSearchChange}
            style={{ ...inputStyle, marginBottom: 0, paddingLeft: '40px', background: 'rgba(255,255,255,0.03)' }}
          />
        </div>
      </div>

      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)', background: 'rgba(255,255,255,0.02)' }}>
              <th style={{ padding: '1.2rem 1.5rem', color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.85rem', textTransform: 'uppercase' }}>Track</th>
              <th style={{ padding: '1.2rem 1.5rem', color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.85rem', textTransform: 'uppercase' }}>Artist</th>
              <th style={{ padding: '1.2rem 1.5rem', color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.85rem', textTransform: 'uppercase' }}>Album</th>
              <th style={{ padding: '1.2rem 1.5rem', color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.85rem', textTransform: 'uppercase' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} style={{ padding: '4rem', textAlign: 'center' }}>Loading your tracks...</td></tr>
            ) : songs.length === 0 ? (
              <tr><td colSpan={4} style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No songs found.</td></tr>
            ) : (
              songs.map(song => (
                <tr key={song.id} style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background 0.2s' }}>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {song.cover_image ? <img src={`http://localhost:8000${song.cover_image}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }} /> : <Music size={18} opacity={0.3} />}
                      </div>
                      <span style={{ fontWeight: 500 }}>{song.title}</span>
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>{song.artist?.name || <span style={{ opacity: 0.3 }}>Unknown</span>}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>{song.album?.title || <span style={{ opacity: 0.3 }}>Single</span>}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <button 
                        onClick={() => handleEditClick(song)}
                        className="action-icon-btn" title="Edit Metadata"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDeleteSong(song.id)}
                        className="action-icon-btn" title="Delete from Cloud"
                        style={{ color: 'var(--neon-pink)' }}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', padding: '1rem 1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Showing page <strong>{page}</strong> of <strong>{totalPages}</strong> ({totalSongs} total songs)
          </span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              disabled={page === 1}
              onClick={() => setPage(p => Math.max(p - 1, 1))}
              className="pagination-btn"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border-subtle)',
                color: page === 1 ? 'var(--text-secondary)' : 'white',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: page === 1 ? 'default' : 'pointer',
                opacity: page === 1 ? 0.5 : 1,
                fontSize: '0.9rem',
                transition: 'all 0.2s'
              }}
            >
              Previous
            </button>
            <button 
              disabled={page === totalPages}
              onClick={() => setPage(p => Math.min(p + 1, totalPages))}
              className="pagination-btn"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border-subtle)',
                color: page === totalPages ? 'var(--text-secondary)' : 'white',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: page === totalPages ? 'default' : 'pointer',
                opacity: page === totalPages ? 0.5 : 1,
                fontSize: '0.9rem',
                transition: 'all 0.2s'
              }}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingSong && (
        <div className="modal-backdrop" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-card" style={{ width: '500px', padding: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.5rem' }}>Edit Track Details</h3>
              <button onClick={() => setEditingSong(null)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><X size={24} /></button>
            </div>

            <form onSubmit={handleUpdateSong}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Track Title</label>
              <input style={inputStyle} type="text" value={editTitle} onChange={e => setEditTitle(e.target.value)} required />

              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Artist</label>
              <select style={inputStyle} value={editArtistId} onChange={e => setEditArtistId(e.target.value)} required>
                <option value="">Select Artist</option>
                {artists.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>

              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Album</label>
              <select style={inputStyle} value={editAlbumId} onChange={e => setEditAlbumId(e.target.value)}>
                <option value="">No Album (Single)</option>
                {albums.filter(al => String(al.artist_id) === String(editArtistId)).map(al => (
                  <option key={al.id} value={al.id}>{al.title}</option>
                ))}
              </select>

              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Genre</label>
              <input style={inputStyle} type="text" value={editGenre} onChange={e => setEditGenre(e.target.value)} placeholder="e.g. Pop, Jazz, Lo-fi" />

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setEditingSong(null)} className="btn-glass-3d" style={{ flex: 1, borderColor: 'transparent' }}>Cancel</button>
                <button type="submit" disabled={isUpdating} className="btn-glass-3d purple" style={{ flex: 2 }}>
                  {isUpdating ? 'Saving...' : (
                    <><Save size={18} style={{ marginRight: '8px' }} /> Save Changes</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .action-icon-btn {
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--border-subtle);
          color: var(--text-secondary);
          padding: 8px;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .action-icon-btn:hover {
          background: rgba(255,255,255,0.1);
          color: white;
          transform: translateY(-2px);
        }
        .pagination-btn:hover:not(:disabled) {
          background: rgba(255,255,255,0.15) !important;
          border-color: rgba(255,255,255,0.5) !important;
          transform: translateY(-1px);
        }
        th { text-align: left; }
      `}</style>
    </div>
  );
};

export default SongManagement;
