import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Player from './components/Player';
import BottomNav from './components/BottomNav';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Search from './pages/Search';
import AdminUpload from './pages/AdminUpload';
import { PlayerProvider } from './context/PlayerContext';

function App() {
  return (
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
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/search" element={<Search />} />
                  <Route path="/admin/upload" element={<AdminUpload />} />
                </Routes>
              </main>
              <Player />
              <BottomNav />
            </>
          } />
        </Routes>
      </div>
    </PlayerProvider>
  );
}

export default App;
