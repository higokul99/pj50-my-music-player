import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import * as mm from 'music-metadata-browser';
import { Settings, List } from 'lucide-react';

const AdminUpload: React.FC = () => {
  const navigate = useNavigate();
  const [artists, setArtists] = useState<any[]>([]);
  const [albums, setAlbums] = useState<any[]>([]);
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(false);

  // Forms state
  const [artistName, setArtistName] = useState('');
  
  const [albumTitle, setAlbumTitle] = useState('');
  const [albumArtistId, setAlbumArtistId] = useState('');

  const [songTitle, setSongTitle] = useState('');
  const [songArtistId, setSongArtistId] = useState('');
  const [songAlbumId, setSongAlbumId] = useState('');
  const [songFile, setSongFile] = useState<File | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (!file) return;

    setSongFile(file);
    setIsLoadingMetadata(true);

    try {
      const metadata = await mm.parseBlob(file);
      const { title, artist, album } = metadata.common;

      if (title) setSongTitle(title);
      
      if (artist) {
        // Try to find existing artist
        const foundArtist = artists.find(a => a.name.toLowerCase() === artist.toLowerCase());
        if (foundArtist) {
          setSongArtistId(foundArtist.id.toString());
          
          if (album) {
            // Try to find existing album for this artist
            const foundAlbum = albums.find(al => 
              al.artist_id === foundArtist.id && 
              al.title.toLowerCase() === album.toLowerCase()
            );
            if (foundAlbum) setSongAlbumId(foundAlbum.id.toString());
          }
        }
      }
    } catch (err) {
      console.error('Error parsing metadata:', err);
      // Fallback: use filename as title
      const fileName = file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");
      if (!songTitle) setSongTitle(fileName);
    } finally {
      setIsLoadingMetadata(false);
    }
  };

  const fetchArtists = async () => {
    try {
      const res = await api.get('/artists');
      setArtists(res.data.data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchAlbums = async () => {
    try {
      const res = await api.get('/albums');
      setAlbums(res.data.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchArtists();
    fetchAlbums();
  }, []);

  const handleCreateArtist = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/artists', { name: artistName });
      setArtistName('');
      fetchArtists();
      alert('Artist Created!');
    } catch (e) {
      console.error(e);
      alert('Error creating artist');
    }
  };

  const handleCreateAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/albums', { title: albumTitle, artist_id: albumArtistId });
      setAlbumTitle('');
      setAlbumArtistId('');
      fetchAlbums();
      alert('Album Created!');
    } catch (e) {
      console.error(e);
      alert('Error creating album');
    }
  };

  const handleUploadSong = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!songFile) return;

    const formData = new FormData();
    formData.append('title', songTitle);
    if (songArtistId) formData.append('artist_id', songArtistId);
    if (songAlbumId) formData.append('album_id', songAlbumId);
    formData.append('song_file', songFile);

    try {
      await api.post('/songs', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSongTitle('');
      setSongArtistId('');
      setSongAlbumId('');
      setSongFile(null);
      alert('Song Uploaded Successfully!');
    } catch (err: any) {
      console.error('Upload Error:', err.response?.data || err.message);
      const errorMessage = err.response?.data?.message || 'Error uploading song';
      const errors = err.response?.data?.errors;
      
      if (errors) {
        const detail = Object.values(errors).flat().join('\n');
        alert(`${errorMessage}:\n${detail}`);
      } else {
        alert(errorMessage);
      }
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', 
    padding: '12px 16px', 
    background: 'rgba(0,0,0,0.8)', 
    border: '1px solid rgba(255,255,255,0.2)', 
    borderRadius: '4px', 
    color: 'white', 
    outline: 'none',
    marginBottom: '1rem',
    fontSize: '1rem',
    position: 'relative',
    zIndex: 20
  };

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <p style={{ textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: '0.9rem', marginBottom: '1rem' }}>
        System Configuration
      </p>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', margin: 0 }}>Library Management</h2>
        <button 
          onClick={() => navigate('/admin/songs')}
          className="btn-glass-3d" 
          style={{ padding: '10px 20px', fontSize: '0.9rem', borderColor: 'var(--neon-pink)' }}
        >
          <List size={18} style={{ marginRight: '8px' }} /> Manage Uploaded Songs
        </button>
      </div>

      <div className="admin-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        
        {/* Create Artist */}
        <div className="glass-card">
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--neon-purple)' }}>Add Artist</h3>
          <form onSubmit={handleCreateArtist}>
            <input 
              style={inputStyle} type="text" placeholder="Artist Name" 
              value={artistName} onChange={(e) => setArtistName(e.target.value)} required 
            />
            <button type="submit" className="btn-glass-3d purple" style={{ width: '100%' }}>Create Artist</button>
          </form>
        </div>

        {/* Create Album */}
        <div className="glass-card">
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--neon-blue)' }}>Add Album</h3>
          <form onSubmit={handleCreateAlbum}>
            <input 
              style={inputStyle} type="text" placeholder="Album Title" 
              value={albumTitle} onChange={(e) => setAlbumTitle(e.target.value)} required 
            />
            <select style={inputStyle} value={albumArtistId} onChange={(e) => setAlbumArtistId(e.target.value)} required>
              <option value="" disabled>Select Artist</option>
              {artists.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
            <button type="submit" className="btn-glass-3d blue" style={{ width: '100%' }}>Create Album</button>
          </form>
        </div>

        {/* Upload Song */}
        <div className="glass-card">
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--neon-pink)' }}>Upload Audio</h3>
          <form onSubmit={handleUploadSong}>
            <input 
              style={inputStyle} type="text" placeholder="Track Title" 
              value={songTitle} onChange={(e) => setSongTitle(e.target.value)} required 
            />
            
            <select style={inputStyle} value={songArtistId} onChange={(e) => setSongArtistId(e.target.value)}>
              <option value="">No Artist (Optional)</option>
              {artists.length === 0 && <option disabled>No artists found - Create one first!</option>}
              {artists.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>

            <select style={inputStyle} value={songAlbumId} onChange={(e) => setSongAlbumId(e.target.value)}>
              <option value="">No Album (Single)</option>
              {albums.filter(al => String(al.artist_id) === String(songArtistId)).map(al => (
                <option key={al.id} value={al.id}>{al.title}</option>
              ))}
            </select>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                {isLoadingMetadata ? 'Parsing Metadata...' : 'Select Audio File (MP3, WAV, M4A)'}
              </label>
              <input 
                type="file" accept="audio/*"
                onChange={handleFileChange}
                style={{ ...inputStyle, marginBottom: 0, opacity: isLoadingMetadata ? 0.5 : 1 }} required
                disabled={isLoadingMetadata}
              />
            </div>
            
            <button type="submit" className="btn-glass-3d pink" style={{ width: '100%' }}>
              Upload Track
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminUpload;
