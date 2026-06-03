import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import * as mm from 'music-metadata-browser';
import { List, Trash2, CheckCircle2, AlertCircle, RefreshCw, FolderOpen, Files, Plus } from 'lucide-react';

interface BulkFile {
  id: string;
  file: File;
  title: string;
  artistId: string;
  albumId: string;
  status: 'pending' | 'parsing' | 'uploading' | 'success' | 'error';
  error?: string;
}

const AdminUpload: React.FC = () => {
  const navigate = useNavigate();
  const [artists, setArtists] = useState<any[]>([]);
  const [albums, setAlbums] = useState<any[]>([]);
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(false);
  const [activeTab, setActiveTab] = useState<'single' | 'bulk'>('single');

  // Single Form state
  const [artistName, setArtistName] = useState('');
  const [albumTitle, setAlbumTitle] = useState('');
  const [albumArtistId, setAlbumArtistId] = useState('');
  const [songTitle, setSongTitle] = useState('');
  const [songArtistId, setSongArtistId] = useState('');
  const [songAlbumId, setSongAlbumId] = useState('');
  const [songFile, setSongFile] = useState<File | null>(null);

  // Bulk state
  const [bulkFiles, setBulkFiles] = useState<BulkFile[]>([]);
  const [isBulkUploading, setIsBulkUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

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
        const foundArtist = artists.find(a => a.name.toLowerCase() === artist.toLowerCase());
        if (foundArtist) {
          setSongArtistId(foundArtist.id.toString());
          
          if (album) {
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
      const fileName = file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");
      if (!songTitle) setSongTitle(fileName);
    } finally {
      setIsLoadingMetadata(false);
    }
  };

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

  // Bulk Handlers
  const handleBulkFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const filesList = e.target.files;
    if (!filesList || filesList.length === 0) return;

    const filesArray = Array.from(filesList).filter(f => 
      f.name.endsWith('.mp3') || f.name.endsWith('.m4a') || f.name.endsWith('.wav') || f.type.startsWith('audio/')
    );

    const tempFiles = filesArray.map((file, idx) => {
      const id = `${Date.now()}-${idx}-${file.name}`;
      const fileNameTitle = file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");
      return {
        id,
        file,
        title: fileNameTitle,
        artistId: '',
        albumId: '',
        status: 'parsing' as const
      };
    });

    setBulkFiles(prev => [...prev, ...tempFiles]);

    // Parse files one by one to avoid UI freeze
    for (const tempFile of tempFiles) {
      try {
        const metadata = await mm.parseBlob(tempFile.file);
        const { title, artist, album } = metadata.common;
        
        let artistId = '';
        let albumId = '';

        if (artist) {
          const foundArtist = artists.find(a => a.name.toLowerCase() === artist.toLowerCase());
          if (foundArtist) {
            artistId = foundArtist.id.toString();
            if (album) {
              const foundAlbum = albums.find(al => 
                al.artist_id === foundArtist.id && 
                al.title.toLowerCase() === album.toLowerCase()
              );
              if (foundAlbum) albumId = foundAlbum.id.toString();
            }
          }
        }

        setBulkFiles(prev => prev.map(f => f.id === tempFile.id ? {
          ...f,
          title: title || f.title,
          artistId,
          albumId,
          status: 'pending'
        } : f));
      } catch (err) {
        console.error('Metadata parsing failed for file:', tempFile.file.name, err);
        setBulkFiles(prev => prev.map(f => f.id === tempFile.id ? { ...f, status: 'pending' } : f));
      }
    }
    
    // Reset file input value so same files can be selected again if needed
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (folderInputRef.current) folderInputRef.current.value = '';
  };

  const handleRemoveBulkFile = (id: string) => {
    setBulkFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleUpdateBulkFileField = (id: string, field: 'title' | 'artistId' | 'albumId', value: string) => {
    setBulkFiles(prev => prev.map(f => {
      if (f.id === id) {
        if (field === 'artistId') {
          return { ...f, artistId: value, albumId: '' }; // reset album on artist change
        }
        return { ...f, [field]: value };
      }
      return f;
    }));
  };

  const handleBulkUpload = async () => {
    if (bulkFiles.length === 0 || isBulkUploading) return;
    setIsBulkUploading(true);

    const pendingFiles = bulkFiles.filter(f => f.status === 'pending' || f.status === 'error');

    for (const bulkFile of pendingFiles) {
      setBulkFiles(prev => prev.map(f => f.id === bulkFile.id ? { ...f, status: 'uploading' } : f));

      const formData = new FormData();
      formData.append('title', bulkFile.title);
      if (bulkFile.artistId) formData.append('artist_id', bulkFile.artistId);
      if (bulkFile.albumId) formData.append('album_id', bulkFile.albumId);
      formData.append('song_file', bulkFile.file);

      try {
        await api.post('/songs', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setBulkFiles(prev => prev.map(f => f.id === bulkFile.id ? { ...f, status: 'success' } : f));
      } catch (err: any) {
        console.error('Bulk Upload Error for:', bulkFile.file.name, err);
        const errorData = err.response?.data;
        let errorMessage = errorData?.message || 'Upload failed';
        if (errorData?.errors) {
          const detail = Object.values(errorData.errors).flat().join(', ');
          errorMessage = `${errorMessage}: ${detail}`;
        }
        setBulkFiles(prev => prev.map(f => f.id === bulkFile.id ? { ...f, status: 'error', error: errorMessage } : f));
      }
    }

    setIsBulkUploading(false);
  };

  const handleClearFinished = () => {
    setBulkFiles(prev => prev.filter(f => f.status !== 'success'));
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

  const tableHeaderStyle: React.CSSProperties = {
    padding: '12px 16px',
    textAlign: 'left',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    color: 'var(--text-secondary)',
    fontSize: '0.85rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  };

  const tableCellStyle: React.CSSProperties = {
    padding: '12px 16px',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    verticalAlign: 'middle',
    fontSize: '0.95rem'
  };

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <p style={{ textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: '0.9rem', marginBottom: '1rem' }}>
        System Configuration
      </p>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '2rem', margin: 0 }}>Library Management</h2>
        
        <button 
          onClick={() => navigate('/admin/songs')}
          className="btn-glass-3d" 
          style={{ 
            padding: '10px 20px', 
            fontSize: '0.9rem', 
            borderColor: 'var(--neon-pink)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <List size={18} /> Manage Songs
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
        <button 
          onClick={() => setActiveTab('single')}
          style={{ 
            background: 'none', border: 'none', color: activeTab === 'single' ? 'var(--neon-blue)' : 'var(--text-secondary)', 
            fontSize: '1rem', fontWeight: 600, padding: '0.5rem 1rem', cursor: 'pointer',
            borderBottom: activeTab === 'single' ? '2px solid var(--neon-blue)' : '2px solid transparent',
            transition: 'all 0.3s'
          }}
        >
          Single Song Upload
        </button>
        <button 
          onClick={() => setActiveTab('bulk')}
          style={{ 
            background: 'none', border: 'none', color: activeTab === 'bulk' ? 'var(--neon-blue)' : 'var(--text-secondary)', 
            fontSize: '1rem', fontWeight: 600, padding: '0.5rem 1rem', cursor: 'pointer',
            borderBottom: activeTab === 'bulk' ? '2px solid var(--neon-blue)' : '2px solid transparent',
            transition: 'all 0.3s'
          }}
        >
          Bulk Upload Folder/Files
        </button>
      </div>

      {activeTab === 'single' ? (
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
      ) : (
        /* Bulk Uploader tab */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="glass-card" style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <input 
                type="file" 
                multiple 
                accept="audio/*" 
                onChange={handleBulkFileChange} 
                style={{ display: 'none' }} 
                ref={fileInputRef}
              />
              <button 
                onClick={() => fileInputRef.current?.click()} 
                className="btn-glass-3d blue"
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px' }}
              >
                <Files size={18} /> Select Multiple Files
              </button>

              <input 
                type="file" 
                /* @ts-ignore */
                webkitdirectory="true" 
                directory="true" 
                multiple 
                onChange={handleBulkFileChange} 
                style={{ display: 'none' }} 
                ref={folderInputRef}
              />
              <button 
                onClick={() => folderInputRef.current?.click()} 
                className="btn-glass-3d purple"
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px' }}
              >
                <FolderOpen size={18} /> Select Playlist Folder
              </button>
            </div>

            {bulkFiles.length > 0 && (
              <div style={{ display: 'flex', gap: '1rem', marginLeft: 'auto' }}>
                <button 
                  onClick={handleClearFinished} 
                  className="btn-glass-3d" 
                  style={{ fontSize: '0.9rem', padding: '10px 16px', color: 'var(--text-secondary)' }}
                >
                  Clear Completed
                </button>
                <button 
                  onClick={handleBulkUpload} 
                  disabled={isBulkUploading || bulkFiles.filter(f => f.status === 'pending' || f.status === 'error').length === 0}
                  className="btn-glass-3d pink"
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 24px', fontSize: '0.95rem' }}
                >
                  {isBulkUploading ? (
                    <>
                      <RefreshCw size={18} className="animate-spin" />
                      Uploading Queue...
                    </>
                  ) : (
                    <>
                      <Plus size={18} />
                      Upload All ({bulkFiles.filter(f => f.status === 'pending' || f.status === 'error').length} pending)
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {bulkFiles.length === 0 ? (
            <div className="glass-card" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <Files size={48} style={{ marginBottom: '1.5rem', opacity: 0.2 }} />
              <p>No files selected. Click the buttons above to load multiple audio files or select an entire music folder.</p>
            </div>
          ) : (
            <div className="glass-card" style={{ padding: '0', overflowX: 'auto', border: '1px solid rgba(255,255,255,0.05)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ ...tableHeaderStyle, width: '35%' }}>Filename</th>
                    <th style={{ ...tableHeaderStyle, width: '25%' }}>Track Title</th>
                    <th style={{ ...tableHeaderStyle, width: '15%' }}>Artist</th>
                    <th style={{ ...tableHeaderStyle, width: '15%' }}>Album</th>
                    <th style={{ ...tableHeaderStyle, width: '10%' }}>Status</th>
                    <th style={{ ...tableHeaderStyle, width: '5%', textAlign: 'center' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {bulkFiles.map((item) => (
                    <tr key={item.id} style={{ background: item.status === 'success' ? 'rgba(0, 243, 255, 0.02)' : 'none' }}>
                      <td style={tableCellStyle}>
                        <p style={{ margin: 0, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '240px' }} title={item.file.name}>
                          {item.file.name}
                        </p>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                          {(item.file.size / (1024 * 1024)).toFixed(2)} MB
                        </span>
                      </td>
                      <td style={tableCellStyle}>
                        <input 
                          type="text" 
                          value={item.title} 
                          onChange={(e) => handleUpdateBulkFileField(item.id, 'title', e.target.value)}
                          disabled={item.status === 'success' || item.status === 'uploading'}
                          style={{ 
                            width: '100%', padding: '8px 12px', background: 'rgba(0,0,0,0.5)',
                            border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', color: 'white',
                            fontSize: '0.9rem'
                          }}
                        />
                      </td>
                      <td style={tableCellStyle}>
                        <select 
                          value={item.artistId} 
                          onChange={(e) => handleUpdateBulkFileField(item.id, 'artistId', e.target.value)}
                          disabled={item.status === 'success' || item.status === 'uploading'}
                          style={{ 
                            width: '100%', padding: '8px 12px', background: 'rgba(0,0,0,0.5)',
                            border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', color: 'white',
                            fontSize: '0.9rem'
                          }}
                        >
                          <option value="">No Artist</option>
                          {artists.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                        </select>
                      </td>
                      <td style={tableCellStyle}>
                        <select 
                          value={item.albumId} 
                          onChange={(e) => handleUpdateBulkFileField(item.id, 'albumId', e.target.value)}
                          disabled={item.status === 'success' || item.status === 'uploading'}
                          style={{ 
                            width: '100%', padding: '8px 12px', background: 'rgba(0,0,0,0.5)',
                            border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', color: 'white',
                            fontSize: '0.9rem'
                          }}
                        >
                          <option value="">No Album</option>
                          {albums.filter(al => String(al.artist_id) === String(item.artistId)).map(al => (
                            <option key={al.id} value={al.id}>{al.title}</option>
                          ))}
                        </select>
                      </td>
                      <td style={tableCellStyle}>
                        {item.status === 'parsing' && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
                            <RefreshCw size={14} className="animate-spin" /> Parsing...
                          </span>
                        )}
                        {item.status === 'pending' && (
                          <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Ready</span>
                        )}
                        {item.status === 'uploading' && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--neon-blue)' }}>
                            <RefreshCw size={14} className="animate-spin" /> Uploading...
                          </span>
                        )}
                        {item.status === 'success' && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#4caf50', fontWeight: 600 }}>
                            <CheckCircle2 size={16} /> Success
                          </span>
                        )}
                        {item.status === 'error' && (
                          <span 
                            style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ff4444', fontWeight: 600, cursor: 'help' }}
                            title={item.error}
                          >
                            <AlertCircle size={16} /> Error
                          </span>
                        )}
                      </td>
                      <td style={{ ...tableCellStyle, textAlign: 'center' }}>
                        <button 
                          onClick={() => handleRemoveBulkFile(item.id)}
                          disabled={item.status === 'uploading'}
                          style={{ 
                            background: 'none', border: 'none', color: 'var(--text-secondary)', 
                            cursor: item.status === 'uploading' ? 'default' : 'pointer',
                            opacity: item.status === 'uploading' ? 0.3 : 1
                          }}
                          className="remove-btn"
                          title="Remove from queue"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminUpload;
