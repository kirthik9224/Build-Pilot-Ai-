// Organization: Orbytes Global Solutions, Owner: Logaraj S, Created at: 2026-10-11
// Description: Interactive Swagger & OpenAPI 3.0 API explorer sandbox

import { useState } from 'react';

const ENDPOINTS = [
  { method: 'GET', path: '/api/dashboard', desc: 'Aggregated project metrics & health score', defaultBody: null },
  { method: 'GET', path: '/api/issues', desc: 'Defect inventory sorted by severity', defaultBody: null },
  { method: 'POST', path: '/api/auth/login', desc: 'Issue JWT authentication token', defaultBody: '{\n  "email": "demo@buildpilot.dev",\n  "password": "demo123"\n}' },
  { method: 'POST', path: '/api/monitoring/services/1/ping', desc: 'Real-time HTTP health check ping', defaultBody: null },
  { method: 'GET', path: '/api/planner/tasks', desc: 'Project tasks and risk estimates', defaultBody: null },
];

export default function ApiExplorer({ onTriggerToast }) {
  const [selectedEndpoint, setSelectedEndpoint] = useState(ENDPOINTS[0]);
  const [requestBody, setRequestBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const sendRequest = async () => {
    setLoading(true);
    setResponse(null);
    const startTime = performance.now();
    try {
      const options = {
        method: selectedEndpoint.method,
        headers: {
          'Content-Type': 'application/json',
          ...(sessionStorage.getItem('bp_session')
            ? { Authorization: `Bearer ${JSON.parse(sessionStorage.getItem('bp_session')).token}` }
            : {}),
        },
        ...(requestBody && selectedEndpoint.method === 'POST' ? { body: requestBody } : {}),
      };

      const res = await fetch(selectedEndpoint.path, options);
      const data = await res.json().catch(() => ({}));
      const duration = Math.round(performance.now() - startTime);

      setResponse({
        status: res.status,
        statusText: res.statusText,
        timeMs: duration,
        data,
      });

      if (onTriggerToast) onTriggerToast(`${selectedEndpoint.method} ${selectedEndpoint.path} -> ${res.status}`);
    } catch (err) {
      setResponse({
        status: 500,
        statusText: 'Network Error',
        timeMs: Math.round(performance.now() - startTime),
        data: { error: err.message },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="api-explorer-view">
      <header className="page-head row">
        <div>
          <h2>OpenAPI & Swagger Sandbox</h2>
          <p className="muted">
            Live Spring Boot REST API explorer. Inspect endpoints, execute requests, and view live JSON payloads.
          </p>
        </div>
        <div className="actions">
          <button className="btn primary" onClick={sendRequest} disabled={loading}>
            {loading ? 'Sending Request…' : '▶ Send API Request'}
          </button>
        </div>
      </header>

      <div className="grid" style={{ gridTemplateColumns: '280px 1fr', gap: '1.2rem' }}>
        {/* Endpoint Selector */}
        <section className="glass">
          <h3>REST Endpoints</h3>
          <p className="muted">Select endpoint to inspect</p>

          <div style={{ display: 'grid', gap: '0.6rem', marginTop: '0.8rem' }}>
            {ENDPOINTS.map((ep, i) => (
              <div
                key={i}
                onClick={() => {
                  setSelectedEndpoint(ep);
                  setRequestBody(ep.defaultBody || '');
                  setResponse(null);
                }}
                style={{
                  padding: '0.6rem 0.8rem',
                  borderRadius: '8px',
                  background: selectedEndpoint.path === ep.path ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--line)',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span
                    className={`sev ${ep.method === 'GET' ? 'low' : 'high'}`}
                    style={{ fontSize: '0.72rem', padding: '1px 6px' }}
                  >
                    {ep.method}
                  </span>
                  <code style={{ fontSize: '0.8rem' }}>{ep.path}</code>
                </div>
                <small className="muted" style={{ display: 'block', marginTop: '4px' }}>
                  {ep.desc}
                </small>
              </div>
            ))}
          </div>
        </section>

        {/* Request & Response */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          {selectedEndpoint.method === 'POST' && (
            <section className="glass">
              <h3>Request Body (JSON)</h3>
              <textarea
                rows={4}
                value={requestBody}
                onChange={(e) => setRequestBody(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(0,0,0,0.5)',
                  color: '#e2e8f0',
                  border: '1px solid var(--line)',
                  borderRadius: '8px',
                  padding: '0.8rem',
                  fontFamily: 'monospace',
                  fontSize: '0.85rem',
                  marginTop: '0.4rem',
                }}
              />
            </section>
          )}

          <section className="glass">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
              <h3>Live Response Payload</h3>
              {response && (
                <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                  <span className={`sev ${response.status < 300 ? 'low' : 'high'}`} style={{ fontSize: '0.75rem' }}>
                    Status: {response.status} {response.statusText}
                  </span>
                  <span className="ok" style={{ fontSize: '0.75rem' }}>
                    ⚡ {response.timeMs}ms
                  </span>
                </div>
              )}
            </div>

            <pre
              style={{
                margin: 0,
                padding: '1rem',
                background: 'rgba(0,0,0,0.6)',
                borderRadius: '8px',
                border: '1px solid var(--line)',
                fontFamily: 'monospace',
                fontSize: '0.82rem',
                lineHeight: '1.5',
                color: '#38bdf8',
                maxHeight: '380px',
                overflowY: 'auto',
              }}
            >
              <code>{response ? JSON.stringify(response.data, null, 2) : '// Click "Send API Request" to view live response'}</code>
            </pre>
          </section>
        </div>
      </div>
    </div>
  );
}
