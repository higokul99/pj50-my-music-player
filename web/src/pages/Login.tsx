import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const { refreshUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await api.post('/login', { email, password });
      if (response.data.success) {
        localStorage.setItem('auth_token', response.data.data.token);
        await refreshUser();
        navigate('/');
      } else {
        setError(response.data.message || 'Login failed.');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      const message = err.response?.data?.message || err.message || 'Invalid credentials. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 16px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid var(--border-subtle)',
    borderRadius: '4px', color: 'white', outline: 'none',
    fontSize: '1rem', letterSpacing: '0.01em',
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', width: '100vw' }}>
      <div style={{ width: '420px', padding: '3rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', borderRadius: '4px' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem', textAlign: 'center' }}>
          Musiq<span style={{ color: 'var(--neon-purple)' }}>Sphere</span>
        </h2>
        <p style={{ textAlign: 'center', marginBottom: '2.5rem', fontSize: '0.9rem' }}>Sign in to your account</p>

        {error && (
          <div style={{ background: 'rgba(255,0,80,0.1)', border: '1px solid rgba(255,0,80,0.3)', borderRadius: '4px', padding: '12px 16px', marginBottom: '1.5rem', color: '#ff5080', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} required />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} required />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{ marginTop: '0.5rem', padding: '14px', background: 'var(--neon-purple)', border: 'none', borderRadius: '50px', color: 'white', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', fontSize: '0.95rem', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Signing In...' : 'Enter'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--neon-purple)', textDecoration: 'none', fontWeight: 500 }}>Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
