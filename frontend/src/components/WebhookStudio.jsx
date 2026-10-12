// Organization: Orbytes Global Solutions, Owner: Logaraj S, Created at: 2026-10-11
// Description: Interactive Webhook & Incident Dispatcher (Slack, Discord, PagerDuty)

import { useState } from 'react';

const CHANNELS = [
  { id: 'slack', name: 'Slack (#dev-alerts)', icon: '💬', webhookUrl: 'https://hooks.slack.com/services/T00/B00/XXXXX' },
  { id: 'discord', name: 'Discord (#engineering)', icon: '🎮', webhookUrl: 'https://discord.com/api/webhooks/123/XYZ' },
  { id: 'pagerduty', name: 'PagerDuty (Critical On-Call)', icon: '🚨', webhookUrl: 'https://events.pagerduty.com/v2/enqueue' },
];

export default function WebhookStudio({ onTriggerToast }) {
  const [selectedChannel, setSelectedChannel] = useState(CHANNELS[0]);
  const [alertTitle, setAlertTitle] = useState('Critical Latency Spike on Health Gateway');
  const [severity, setSeverity] = useState('CRITICAL');
  const [dispatching, setDispatching] = useState(false);
  const [history, setHistory] = useState([
    { id: 1, channel: 'Slack', title: 'OWASP vulnerability resolved by AI patch', time: '18m ago', status: 'Delivered (200 OK)' },
    { id: 2, channel: 'PagerDuty', title: 'Database connection pool exhausted', time: '1h ago', status: 'Delivered (202 Accepted)' },
  ]);

  const dispatchWebhook = (e) => {
    e.preventDefault();
    setDispatching(true);
    setTimeout(() => {
      setDispatching(false);
      const newEntry = {
        id: Date.now(),
        channel: selectedChannel.name.split(' ')[0],
        title: alertTitle,
        time: 'Just now',
        status: 'Delivered (200 OK)',
      };
      setHistory((prev) => [newEntry, ...prev]);
      if (onTriggerToast) onTriggerToast(`Dispatched webhook to ${selectedChannel.name}!`, 'success');
    }, 1200);
  };

  return (
    <div className="webhook-studio-view">
      <header className="page-head row">
        <div>
          <h2>Incident Webhook & Alert Dispatcher</h2>
          <p className="muted">
            Broadcast automated incident notifications to Slack, Discord, and PagerDuty webhooks.
          </p>
        </div>
      </header>

      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
        {/* Webhook Configuration Form */}
        <section className="glass">
          <h3>Trigger Test Incident Alert</h3>
          <p className="muted">Send payload to configured external webhook</p>

          <form onSubmit={dispatchWebhook} style={{ display: 'grid', gap: '0.9rem', marginTop: '1rem' }}>
            <label style={{ display: 'grid', gap: '0.3rem' }}>
              <span className="muted">Target Channel:</span>
              <select
                value={selectedChannel.id}
                onChange={(e) => setSelectedChannel(CHANNELS.find((c) => c.id === e.target.value))}
              >
                {CHANNELS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.icon} {c.name}
                  </option>
                ))}
              </select>
            </label>

            <label style={{ display: 'grid', gap: '0.3rem' }}>
              <span className="muted">Webhook Endpoint URL:</span>
              <input type="text" value={selectedChannel.webhookUrl} readOnly style={{ opacity: 0.8 }} />
            </label>

            <label style={{ display: 'grid', gap: '0.3rem' }}>
              <span className="muted">Incident Alert Title:</span>
              <input
                type="text"
                value={alertTitle}
                onChange={(e) => setAlertTitle(e.target.value)}
                required
              />
            </label>

            <label style={{ display: 'grid', gap: '0.3rem' }}>
              <span className="muted">Severity:</span>
              <select value={severity} onChange={(e) => setSeverity(e.target.value)}>
                <option value="CRITICAL">CRITICAL (Immediate Pager Alert)</option>
                <option value="HIGH">HIGH (Urgent Channel Broadcast)</option>
                <option value="MEDIUM">MEDIUM (Standard Notification)</option>
              </select>
            </label>

            <button className="btn primary" type="submit" disabled={dispatching} style={{ marginTop: '0.4rem' }}>
              {dispatching ? 'Broadcasting Payload…' : '📡 Dispatch Webhook Alert'}
            </button>
          </form>
        </section>

        {/* Live Delivery History */}
        <section className="glass">
          <h3>Webhook Delivery Stream</h3>
          <p className="muted">Outgoing payload events and HTTP delivery status</p>

          <div style={{ display: 'grid', gap: '0.8rem', marginTop: '1rem' }}>
            {history.map((h) => (
              <div
                key={h.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.8rem 1rem',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--line)',
                  borderRadius: '10px',
                }}
              >
                <div>
                  <b style={{ display: 'block' }}>{h.title}</b>
                  <small className="muted">{h.channel} · {h.time}</small>
                </div>
                <span className="ok" style={{ fontSize: '0.78rem' }}>● {h.status}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
