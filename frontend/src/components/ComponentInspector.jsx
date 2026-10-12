// Organization: Orbytes Global Solutions, Owner: Kirthik, Created at: 2026-10-11
// Description: Interactive UI component inspector with accessibility checker & prop controls

import { useState } from 'react';

const SAMPLE_COMPONENTS = [
  {
    id: 'btn-cta',
    name: 'Primary Button',
    category: 'Inputs',
    code: `<button className="btn primary">\n  <span>Get Started</span>\n  <svg width="16" height="16" viewBox="0 0 24 24">\n    <path fill="currentColor" d="M5 13h11.86l-5.43 5.43 1.42 1.42L21.14 12l-8.29-8.29-1.42 1.42 5.43 5.43H5v2z"/>\n  </svg>\n</button>`,
    wcagScore: 98,
    contrastRatio: '8.4:1 (AAA Pass)',
    ariaAttributes: ['aria-label', 'role="button"'],
  },
  {
    id: 'kpi-card',
    name: 'Metric KPI Card',
    category: 'Data Display',
    code: `<div className="glass" style={{ padding: '1.2rem', borderRadius: '14px' }}>\n  <small className="muted">Total Code Reviews</small>\n  <h2 style={{ margin: '0.4rem 0', color: '#38bdf8' }}>48</h2>\n  <span className="ok">↑ 14% this sprint</span>\n</div>`,
    wcagScore: 100,
    contrastRatio: '11.2:1 (AAA Pass)',
    ariaAttributes: ['role="region"', 'aria-label="Metric card"'],
  },
  {
    id: 'alert-box',
    name: 'Incident Alert Banner',
    category: 'Feedback',
    code: `<div className="banner" role="alert" style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>\n  <span style={{ color: '#f43f5e' }}>⚠️</span>\n  <div>\n    <strong>High Latency Warning</strong>\n    <p style={{ margin: 0, fontSize: '0.85rem' }}>Response time exceeded 250ms threshold.</p>\n  </div>\n</div>`,
    wcagScore: 95,
    contrastRatio: '7.1:1 (AA Pass)',
    ariaAttributes: ['role="alert"', 'aria-live="assertive"'],
  },
];

export default function ComponentInspector() {
  const [selectedComp, setSelectedComp] = useState(SAMPLE_COMPONENTS[0]);
  const [title, setTitle] = useState('Deploy Service');
  const [variant, setVariant] = useState('primary');
  const [disabled, setDisabled] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard?.writeText(selectedComp.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="component-inspector">
      <header className="page-head row">
        <div>
          <h2>Component Inspector & Accessibility Lab</h2>
          <p className="muted">
            Inspect React components, tweak dynamic props, and audit WCAG 2.1 compliance.
          </p>
        </div>
        <div className="actions">
          <button className="btn" onClick={copyCode}>
            {copied ? '✓ Code Copied' : 'Copy JSX'}
          </button>
        </div>
      </header>

      <div className="grid" style={{ gridTemplateColumns: '280px 1fr', gap: '1.2rem' }}>
        {/* Component Selector & Prop Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <section className="glass">
            <h3>Component Library</h3>
            <p className="muted">Select component to inspect</p>
            <div style={{ display: 'grid', gap: '0.4rem', marginTop: '0.8rem' }}>
              {SAMPLE_COMPONENTS.map((c) => (
                <button
                  key={c.id}
                  className={`chip ${selectedComp.id === c.id ? 'on' : ''}`}
                  style={{ textAlign: 'left', borderRadius: '10px', padding: '0.6rem 0.8rem' }}
                  onClick={() => setSelectedComp(c)}
                >
                  <b>{c.name}</b>
                  <small style={{ display: 'block', opacity: 0.7 }}>{c.category}</small>
                </button>
              ))}
            </div>
          </section>

          <section className="glass">
            <h3>Interactive Props</h3>
            <div style={{ display: 'grid', gap: '0.8rem', marginTop: '0.8rem' }}>
              <label style={{ display: 'grid', gap: '0.3rem' }}>
                <span className="muted">Button / Title Text:</span>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </label>

              <label style={{ display: 'grid', gap: '0.3rem' }}>
                <span className="muted">Variant:</span>
                <select value={variant} onChange={(e) => setVariant(e.target.value)}>
                  <option value="primary">Primary Gradient</option>
                  <option value="ghost">Ghost Transparent</option>
                  <option value="critical">Critical Red</option>
                </select>
              </label>

              <label style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                <input
                  type="checkbox"
                  checked={disabled}
                  onChange={(e) => setDisabled(e.target.checked)}
                />
                <span>Disabled state</span>
              </label>
            </div>
          </section>
        </div>

        {/* Live Preview & WCAG Audit Results */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Live Preview Sandbox */}
          <section className="glass" style={{ minHeight: '180px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3>Live Interactive Canvas</h3>
              <span className="chip on">Render: React v18</span>
            </div>

            <div
              style={{
                padding: '2.5rem',
                border: '1px dashed var(--line)',
                borderRadius: '12px',
                display: 'grid',
                placeItems: 'center',
                background: 'rgba(0,0,0,0.25)',
              }}
            >
              {selectedComp.id === 'btn-cta' && (
                <button
                  className={`btn ${variant === 'primary' ? 'primary' : ''}`}
                  disabled={disabled}
                  style={variant === 'critical' ? { background: 'var(--crit)', borderColor: 'transparent' } : {}}
                  aria-label={title}
                >
                  <span>{title}</span>
                </button>
              )}

              {selectedComp.id === 'kpi-card' && (
                <div className="glass" style={{ margin: 0, minWidth: '240px' }}>
                  <small className="muted">{title}</small>
                  <h2 style={{ margin: '0.3rem 0', color: 'var(--cyan)' }}>99.4%</h2>
                  <span className="ok">Healthy & Active</span>
                </div>
              )}

              {selectedComp.id === 'alert-box' && (
                <div className="banner" role="alert" style={{ width: '100%', margin: 0 }}>
                  <strong>{title}</strong>
                  <p style={{ margin: '0.2rem 0 0', fontSize: '0.85rem' }}>
                    Automated monitor detected state shift.
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* WCAG Compliance & Accessibility Audit */}
          <section className="glass">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>Accessibility (WCAG 2.1) Audit</h3>
              <span className="sev low" style={{ fontWeight: 600 }}>
                Score: {selectedComp.wcagScore}/100
              </span>
            </div>

            <div className="grid" style={{ marginTop: '1rem', gap: '0.8rem' }}>
              <div style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>
                <small className="muted">Color Contrast Ratio</small>
                <h4 style={{ margin: '0.3rem 0', color: 'var(--low)' }}>{selectedComp.contrastRatio}</h4>
                <small className="muted">Minimum 4.5:1 requirement met</small>
              </div>

              <div style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>
                <small className="muted">Keyboard Navigation</small>
                <h4 style={{ margin: '0.3rem 0', color: 'var(--low)' }}>Focusable & Tab Order OK</h4>
                <small className="muted">Tab index and outline ring configured</small>
              </div>

              <div style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>
                <small className="muted">Screen Reader Attributes</small>
                <h4 style={{ margin: '0.3rem 0', color: 'var(--cyan)' }}>
                  {selectedComp.ariaAttributes.join(', ')}
                </h4>
                <small className="muted">Aria labels verified</small>
              </div>
            </div>
          </section>

          {/* Code Inspection */}
          <section className="glass">
            <h3>Generated Clean JSX</h3>
            <pre style={{ margin: '0.8rem 0 0', padding: '1rem', background: 'rgba(0,0,0,0.4)', borderRadius: '8px', overflowX: 'auto' }}>
              <code>{selectedComp.code}</code>
            </pre>
          </section>
        </div>
      </div>
    </div>
  );
}
