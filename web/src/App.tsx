import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Player from './components/Player';
import BottomNav from './components/BottomNav';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Search from './pages/Search';
import AdminUpload from './pages/AdminUpload';
import Favorites from './pages/Favorites';
import Playlists from './pages/Playlists';
import PlaylistDetail from './pages/PlaylistDetail';
import Downloads from './pages/Downloads';
import Profile from './pages/Profile';
import SongManagement from './pages/SongManagement';
import { PlayerProvider } from './context/PlayerContext';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <PlayerProvider>
        <div className="app-container">
        {/* Texture Layer */}
        <div className="texture-lines"></div>

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/*" element={
            <>
              <Sidebar />
              <main className="main-content">
                <Header />
                <div className="content-wrapper">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/favorites" element={<Favorites />} />
                    <Route path="/playlists" element={<Playlists />} />
                    <Route path="/playlists/:id" element={<PlaylistDetail />} />
                    <Route path="/downloads" element={<Downloads />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/admin/upload" element={<AdminUpload />} />
                    <Route path="/admin/songs" element={<SongManagement />} />
                  </Routes>
                </div>
              </main>
              <Player />
              <BottomNav />
            </>
          } />
        </Routes>
      </div>
      </PlayerProvider>
    </AuthProvider>
  );
}

export default App;
