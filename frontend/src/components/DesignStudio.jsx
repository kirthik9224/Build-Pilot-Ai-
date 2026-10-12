// Organization: Orbytes Global Solutions, Owner: Logaraj S, Created at: 2026-10-11
// Description: Design-to-Code Assistant generating responsive React UI components

import { useState, useEffect } from 'react';
import { api } from '../api.js';

const PRESETS = ['Dashboard Card', 'Navigation Bar', 'Checkout Form', 'Data Table', 'Hero Banner'];

export default function DesignStudio({ projectId }) {
  const [prompt, setPrompt] = useState('Create an analytics metric card with interactive actions');
  const [preset, setPreset] = useState('Dashboard Card');
  const [viewport, setViewport] = useState('desktop'); // desktop, tablet, mobile
  const [activeTab, setActiveTab] = useState('preview'); // preview, jsx, css
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [copied, setCopied] = useState('');

  const loadHistory = async () => {
    try {
      const res = await api.designHistory(projectId);
      setHistory(res);
    } catch (e) {}
  };

  useEffect(() => { loadHistory(); }, [projectId]);

  const generate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const res = await api.generateUi({
        projectId: projectId || 1,
        prompt,
        layoutPreset: preset,
      });
      setResult(res);
      loadHistory();
    } catch (err) {
      alert('Design generation failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyCode = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(''), 2000);
  };

  const viewportWidth = viewport === 'mobile' ? '375px' : viewport === 'tablet' ? '768px' : '100%';

  return (
    <div className="design-studio">
      <header className="page-head row">
        <div>
          <h2>Design AI Studio</h2>
          <p className="muted">
            Transform natural-language UI descriptions into responsive, accessible React components.
          </p>
        </div>
      </header>

      <section className="glass">
        <div className="chips">
          {PRESETS.map((p) => (
            <button
              key={p}
              className={`chip ${preset === p ? 'on' : ''}`}
              onClick={() => {
                setPreset(p);
                setPrompt(`Create a responsive ${p} with modern accessible styles`);
              }}
            >
              {p}
            </button>
          ))}
        </div>

        <div className="field">
          <label>UI Description / Requirements</label>
          <input
            style={{ width: '100%' }}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. Modern checkout form with card inputs, validation, and badges"
          />
        </div>

        <button className="btn primary" disabled={loading} onClick={generate}>
          {loading ? 'Synthesizing React Component…' : 'Generate UI Component'}
        </button>
      </section>

      {result && (
        <section className="glass">
          <div className="issue-top" style={{ justifyContent: 'space-between' }}>
            <h3>{result.componentName}</h3>
            <div className="chips" style={{ margin: 0 }}>
              <button
                className={`chip ${viewport === 'desktop' ? 'on' : ''}`}
                onClick={() => setViewport('desktop')}
              >
                Desktop
              </button>
              <button
                className={`chip ${viewport === 'tablet' ? 'on' : ''}`}
                onClick={() => setViewport('tablet')}
              >
                Tablet (768px)
              </button>
              <button
                className={`chip ${viewport === 'mobile' ? 'on' : ''}`}
                onClick={() => setViewport('mobile')}
              >
                Mobile (375px)
              </button>
            </div>
          </div>

          <div className="chips" style={{ marginTop: '0.8rem' }}>
            <button
              className={`chip ${activeTab === 'preview' ? 'on' : ''}`}
              onClick={() => setActiveTab('preview')}
            >
              Live Sandbox Preview
            </button>
            <button
              className={`chip ${activeTab === 'jsx' ? 'on' : ''}`}
              onClick={() => setActiveTab('jsx')}
            >
              React JSX Code
            </button>
            <button
              className={`chip ${activeTab === 'css' ? 'on' : ''}`}
              onClick={() => setActiveTab('css')}
            >
              Scoped CSS Code
            </button>
          </div>

          {activeTab === 'preview' && (
            <div
              style={{
                width: viewportWidth,
                margin: '1rem auto',
                transition: 'width 0.3s ease',
                border: '1px solid var(--line)',
                borderRadius: '12px',
                padding: '1.5rem',
                background: 'rgba(0,0,0,0.5)',
              }}
            >
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                background: 'rgba(255,255,255,0.06)',
                padding: '1.5rem',
                borderRadius: '10px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ margin: 0 }}>{result.componentName} Preview</h4>
                  <span className="chip on">{result.layoutPreset}</span>
                </div>
                <p className="muted">{result.prompt}</p>
                <div style={{ display: 'flex', gap: '0.6rem' }}>
                  <button className="btn primary">Primary Action</button>
                  <button className="btn">Secondary Action</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'jsx' && (
            <div>
              <button
                className="btn"
                style={{ marginBottom: '0.5rem' }}
                onClick={() => copyCode(result.generatedJsx, 'jsx')}
              >
                {copied === 'jsx' ? 'Copied JSX!' : 'Copy JSX Code'}
              </button>
              <pre style={{
                background: 'rgba(0,0,0,0.6)',
                padding: '1rem',
                borderRadius: '8px',
                color: 'var(--cyan)',
                overflowX: 'auto',
              }}>
                {result.generatedJsx}
              </pre>
            </div>
          )}

          {activeTab === 'css' && (
            <div>
              <button
                className="btn"
                style={{ marginBottom: '0.5rem' }}
                onClick={() => copyCode(result.generatedCss, 'css')}
              >
                {copied === 'css' ? 'Copied CSS!' : 'Copy CSS Code'}
              </button>
              <pre style={{
                background: 'rgba(0,0,0,0.6)',
                padding: '1rem',
                borderRadius: '8px',
                color: 'var(--cyan)',
                overflowX: 'auto',
              }}>
                {result.generatedCss}
              </pre>
            </div>
          )}
        </section>
      )}

      {history.length > 0 && (
        <section className="glass">
          <h3>Generated Component Library ({history.length})</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {history.map((h) => (
              <li
                key={h.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '0.5rem 0',
                  borderBottom: '1px solid var(--line)',
                  cursor: 'pointer',
                }}
                onClick={() => setResult(h)}
              >
                <span><b>{h.componentName}</b> — {h.prompt.substring(0, 50)}…</span>
                <span className="muted">{h.layoutPreset}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
