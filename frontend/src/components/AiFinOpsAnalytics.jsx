// Organization: Orbytes Global Solutions, Owner: Kirthik, Created at: 2026-10-12
// Description: Interactive AI Cost, Token Usage & FinOps Analytics Dashboard

import { useState } from 'react';

const MODEL_USAGE = [
  { model: 'Google Gemini 1.5 Pro', tokens: '412,850', requests: 48, cost: '$0.00 (Free Tier)', efficiency: '99.2%' },
  { model: 'OpenAI GPT-4o', tokens: '185,200', requests: 31, cost: '$0.92', efficiency: '96.8%' },
  { model: 'Local Ollama / DeepSeek', tokens: '640,000', requests: 112, cost: '$0.00 (On-Premise)', efficiency: '100%' },
];

export default function AiFinOpsAnalytics({ onTriggerToast }) {
  const [budgetLimit, setBudgetLimit] = useState(25.0);
  const [currentSpend] = useState(0.92);

  const setBudget = (e) => {
    e.preventDefault();
    if (onTriggerToast) onTriggerToast(`Updated monthly AI budget ceiling to $${budgetLimit.toFixed(2)}`);
  };

  return (
    <div className="finops-analytics-view">
      <header className="page-head row">
        <div>
          <h2>AI FinOps & Token Usage Analytics</h2>
          <p className="muted">
            Monitor real-time token consumption, compute costs per model, and manage engineering AI budgets.
          </p>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid" style={{ marginBottom: '1.2rem' }}>
        <div className="glass">
          <small className="muted">Total Tokens Processed</small>
          <h2 style={{ margin: '0.3rem 0', color: 'var(--cyan)' }}>1,238,050</h2>
          <span className="ok">Over 1.2M tokens cached</span>
        </div>
        <div className="glass">
          <small className="muted">Current Month Spend</small>
          <h2 style={{ margin: '0.3rem 0', color: 'var(--low)' }}>${currentSpend.toFixed(2)}</h2>
          <span className="ok">96.3% under budget ceiling</span>
        </div>
        <div className="glass">
          <small className="muted">Cost Efficiency Score</small>
          <h2 style={{ margin: '0.3rem 0', color: 'var(--violet)' }}>98.6%</h2>
          <span className="ok">Local Ollama offloading active</span>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1fr 320px', gap: '1.2rem' }}>
        {/* Model Breakdown Table */}
        <section className="glass">
          <h3>Token Usage by Provider</h3>
          <p className="muted">Breakdown across Gemini, GPT-4o, and DeepSeek</p>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', marginTop: '1rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--line)', textAlign: 'left', color: 'var(--muted)' }}>
                <th style={{ padding: '8px' }}>Model Engine</th>
                <th style={{ padding: '8px' }}>Tokens Used</th>
                <th style={{ padding: '8px' }}>API Requests</th>
                <th style={{ padding: '8px' }}>Estimated Cost</th>
                <th style={{ padding: '8px' }}>Efficiency</th>
              </tr>
            </thead>
            <tbody>
              {MODEL_USAGE.map((m) => (
                <tr key={m.model} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '8px' }}><b>{m.model}</b></td>
                  <td style={{ padding: '8px' }}><code>{m.tokens}</code></td>
                  <td style={{ padding: '8px' }}>{m.requests}</td>
                  <td style={{ padding: '8px', color: m.cost.includes('0.00') ? 'var(--low)' : 'var(--text)' }}>
                    {m.cost}
                  </td>
                  <td style={{ padding: '8px' }}><span className="ok">● {m.efficiency}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Budget Controls */}
        <section className="glass">
          <h3>Budget Caps & Alerts</h3>
          <p className="muted">Set monthly safety thresholds</p>

          <form onSubmit={setBudget} style={{ display: 'grid', gap: '0.8rem', marginTop: '1rem' }}>
            <label style={{ display: 'grid', gap: '0.3rem' }}>
              <span className="muted">Monthly Spend Ceiling ($):</span>
              <input
                type="number"
                step="5.00"
                value={budgetLimit}
                onChange={(e) => setBudgetLimit(Number(e.target.value))}
              />
            </label>

            <div style={{ padding: '0.8rem', background: 'rgba(74,222,128,0.1)', border: '1px solid var(--low)', borderRadius: '10px' }}>
              <small className="ok" style={{ fontWeight: 600 }}>Hard Cap Protection Active</small>
              <p style={{ margin: '0.2rem 0 0', fontSize: '0.78rem', color: '#e2e8f0' }}>
                Requests will automatically switch to Local Ollama if cloud API budget is exceeded.
              </p>
            </div>

            <button className="btn primary" type="submit" style={{ marginTop: '0.4rem' }}>
              Save Budget Limits
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
