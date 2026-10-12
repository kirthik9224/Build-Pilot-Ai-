// Organization: Orbytes Global Solutions, Owner: Kirthik, Created at: 2026-10-11
// Description: Live Application Health Monitoring with real HTTP pings & alert timeline

import { useState, useEffect } from 'react';
import { api } from '../api.js';

export default function ProductionMonitor({ projectId }) {
  const [services, setServices] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [pingingId, setPingingId] = useState(null);
  const [newName, setNewName] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [isSimulated, setIsSimulated] = useState(false);

  const loadData = async () => {
    try {
      const [s, a] = await Promise.all([
        api.monitoredServices(projectId),
        api.alerts(projectId),
      ]);
      setServices(s);
      setAlerts(a);
    } catch (e) {}
  };

  useEffect(() => { loadData(); }, [projectId]);

  const ping = async (id) => {
    setPingingId(id);
    try {
      await api.pingService(id);
      loadData();
    } catch (err) {
      alert('Ping failed: ' + err.message);
    } finally {
      setPingingId(null);
    }
  };

  const addService = async (e) => {
    e.preventDefault();
    if (!newName.trim() || !newUrl.trim()) return;
    try {
      await api.addService({
        projectId: projectId || 1,
        name: newName.trim(),
        endpointUrl: newUrl.trim(),
        simulated: isSimulated,
      });
      setNewName('');
      setNewUrl('');
      loadData();
    } catch (err) {
      alert('Could not add service: ' + err.message);
    }
  };

  const resolveAlert = async (id) => {
    try {
      await api.resolveAlert(id);
      loadData();
    } catch (err) {
      alert('Could not resolve alert: ' + err.message);
    }
  };

  return (
    <div className="monitor-workspace">
      <header className="page-head row">
        <div>
          <h2>Application Health & Production Monitoring</h2>
          <p className="muted">
            Live telemetry, HTTP latency checks, availability thresholds, and incident resolution.
          </p>
        </div>
      </header>

      <section className="glass">
        <h3>Add Target Service to Monitor</h3>
        <form className="form" onSubmit={addService}>
          <label style={{ flex: 2 }}>
            Service Name
            <input
              style={{ width: '100%' }}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Auth Gateway"
            />
          </label>
          <label style={{ flex: 3 }}>
            Health Endpoint URL
            <input
              style={{ width: '100%' }}
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="http://localhost:8080/api/help"
            />
          </label>
          <label className="toggle" style={{ alignSelf: 'center', margin: 0 }}>
            <input
              type="checkbox"
              checked={isSimulated}
              onChange={(e) => setIsSimulated(e.target.checked)}
            />
            <small>Simulated Mode</small>
          </label>
          <button className="btn primary">Add Endpoint</button>
        </form>
      </section>

      <div className="grid">
        {services.map((s) => (
          <section key={s.id} className="glass">
            <div className="issue-top" style={{ justifyContent: 'space-between' }}>
              <h4>{s.name}</h4>
              <span className={`sev ${s.status === 'UP' ? 'low' : s.status === 'DOWN' ? 'critical' : 'medium'}`}>
                {s.status}
              </span>
            </div>
            <code style={{ display: 'block', wordBreak: 'break-all', marginBottom: '0.6rem' }}>
              {s.endpointUrl}
            </code>
            <div className="chips">
              <span className="chip on">Latency: {s.lastResponseTimeMs || 0}ms</span>
              <span className="chip">Uptime: {s.uptimePercentage}%</span>
              <span className="chip" style={{ color: s.simulated ? 'var(--med)' : 'var(--cyan)' }}>
                {s.simulated ? 'SIMULATED DEMO DATA' : 'LIVE REAL TELEMETRY'}
              </span>
            </div>
            <div style={{ marginTop: '0.8rem' }}>
              <button
                className="btn primary"
                disabled={pingingId === s.id}
                onClick={() => ping(s.id)}
              >
                {pingingId === s.id ? 'Pinging Endpoint…' : 'Ping Endpoint Now'}
              </button>
            </div>
          </section>
        ))}
      </div>

      <section className="glass" style={{ marginTop: '1rem' }}>
        <h3>Incident Timeline & Active Alerts</h3>
        {alerts.length === 0 ? (
          <p className="ok">All monitored endpoints operating normally. No active incidents.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {alerts.map((a) => (
              <li
                key={a.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.6rem 0',
                  borderBottom: '1px solid var(--line)',
                }}
              >
                <div>
                  <span className={`sev ${a.severity.toLowerCase()}`}>{a.severity}</span>
                  <b style={{ marginLeft: '0.6rem' }}>{a.message}</b>
                  <small className="muted" style={{ display: 'block', marginLeft: '0.6rem' }}>
                    {a.createdAt ? new Date(a.createdAt).toLocaleString() : ''}
                  </small>
                </div>
                {!a.resolved ? (
                  <button className="btn" onClick={() => resolveAlert(a.id)}>
                    Mark Resolved
                  </button>
                ) : (
                  <span className="ok">Resolved</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
