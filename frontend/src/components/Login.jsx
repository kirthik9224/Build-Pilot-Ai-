// Organization: Orbytes Global Solutions, Owner: Logaraj S, Created at: 2026-10-11
// Description: Secure authentication component supporting Login and Registration

import { useState } from 'react';
import { api, session } from '../api.js';

export default function Login({ onLogin }) {
  const [mode, setMode] = useState('login'); // login | register
  const [name, setName] = useState('');
  const [email, setEmail] = useState('demo@buildpilot.dev');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('DEVELOPER');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      let user;
      if (mode === 'login') {
        user = await api.login(email, password);
      } else {
        user = await api.register({ name, email, password, role });
      }
      session.set(user);
      onLogin(user);
    } catch (err) {
      setError(
        err.message === 'Failed to fetch'
          ? 'Cannot reach the server. Start the Spring Boot backend on port 8080.'
          : err.message
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="login-wrap">
      <section className="glass login">
        <h1 className="brand">BuildPilot <span>AI Pro</span></h1>
        <p className="muted">
          {mode === 'login'
            ? 'Sign in to access AI Code Review, Debugging, and Project Planning.'
            : 'Create a new developer account with role-based access.'}
        </p>

        <div className="chips" style={{ marginBottom: '1.2rem' }}>
          <button
            type="button"
            className={`chip ${mode === 'login' ? 'on' : ''}`}
            onClick={() => { setMode('login'); setError(''); }}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`chip ${mode === 'register' ? 'on' : ''}`}
            onClick={() => { setMode('register'); setError(''); }}
          >
            Create Account
          </button>
        </div>

        <form onSubmit={submit}>
          {mode === 'register' && (
            <>
              <label>
                Full Name
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Logaraj S"
                />
              </label>
              <label>
                Role
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="DEVELOPER">Developer</option>
                  <option value="LEAD">Technical Lead</option>
                  <option value="ADMIN">System Administrator</option>
                </select>
              </label>
            </>
          )}

          <label>
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
            />
          </label>
          <label>
            Password
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              autoFocus
            />
          </label>

          {error && <div className="banner" role="alert">{error}</div>}

          <button className="btn primary" disabled={busy}>
            {busy ? 'Processing…' : mode === 'login' ? 'Sign In' : 'Register Account'}
          </button>
        </form>

        {mode === 'login' && (
          <p className="muted hint" style={{ marginTop: '1rem' }}>
            Demo account: <code>demo@buildpilot.dev</code> / <code>demo123</code>
          </p>
        )}
      </section>
    </div>
  );
}
