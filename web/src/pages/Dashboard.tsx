import React from 'react';
import { Play } from 'lucide-react';

const Dashboard: React.FC = () => {
  return (
    <div style={{ animation: 'fadeIn 1s ease' }}>
      <p style={{ textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: '0.9rem', marginBottom: '1rem' }}>
        Good Evening
      </p>

      {/* Hero Card - The Single Dominant Object */}
      <div className="hero-card">
        <div className="hero-content">
          <p style={{ color: 'var(--neon-purple)', fontWeight: 500, letterSpacing: '0.1em', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
            Continue Listening
          </p>
          <h1 style={{ marginBottom: '1.5rem', maxWidth: '80%' }}>Midnight Echoes</h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <button className="btn-play glow-accent">
              <Play fill="currentColor" size={24} style={{ marginLeft: 4 }} />
            </button>
            <div>
              <p style={{ color: 'var(--text-primary)', fontWeight: 500 }}>The Weeknd</p>
              <p style={{ fontSize: '0.9rem' }}>Dawn FM • 2022</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
