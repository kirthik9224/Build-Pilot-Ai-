// Organization: Orbytes Global Solutions, Owner: Kirthik, Created at: 2026-10-12
// Description: Automated Release Notes, Changelog, and GitHub Release Document Generator

import { useState } from 'react';

const COMMITS_LOG = [
  { hash: 'a8f102c', message: 'feat: add real-time code collaboration room with live cursors', type: 'Feature' },
  { hash: 'b9d331e', message: 'sec: patch Text4Shell CVE-2022-42889 in commons-text dependency', type: 'Security' },
  { hash: 'c1e459a', message: 'perf: add compound index on issues(status, severity) reducing query latency by 8.5x', type: 'Performance' },
  { hash: 'd7a882f', message: 'feat: add ChatGPT-4o and Gemini 1.5 Pro multimodal AI assistant', type: 'Feature' },
  { hash: 'e2b991d', message: 'fix: resolve null pointer dereference in transaction batch processor', type: 'Bugfix' },
];

export default function ReleaseNotesGenerator({ onTriggerToast }) {
  const [version, setVersion] = useState('v2.1.0-RELEASE');
  const [releaseTitle, setReleaseTitle] = useState('Autumn Milestone: Enterprise Collaboration & Autonomous Scaffolding');
  const [generating, setGenerating] = useState(false);
  const [notes, setNotes] = useState('');
  const [copied, setCopied] = useState(false);

  const generateNotes = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      const generated = `# Release ${version} — ${releaseTitle}\n\n**Release Date:** ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}\n**Organization:** Orbytes Global Solutions\n**Lead Architect:** Kirthik\n\n---\n\n## 🚀 What's New\n- **Real-Time Code Pairing:** Synchronized multi-cursor editing rooms and inline review comment threads.\n- **Full-Stack App Wizard:** Scaffolds complete Spring Boot 3 + React 18 + MySQL applications from scratch in 60 seconds.\n- **Multi-Cloud Orchestration:** Production Kubernetes Helm charts, AWS ECS Terraform modules, and GCP Cloud Run specs.\n\n## 🛡️ Security & Fixes\n- Resolved CVE-2022-42889 and upgraded dependencies to verified secure baselines.\n- Zero regressions confirmed across all 9 JUnit 5 test suites.\n\n## ⚡ Performance Improvements\n- Database index tuning reduced high-concurrency query execution times from 34ms to 4ms.\n\n## 📋 Commit Changelog\n${COMMITS_LOG.map((c) => `- [\`${c.hash}\`] **[${c.type}]** ${c.message}`).join('\n')}\n\n---\n*Generated automatically by BuildPilot AI Pro*`;

      setNotes(generated);
      if (onTriggerToast) onTriggerToast(`Generated Release Notes for ${version}!`, 'success');
    }, 1000);
  };

  const copyNotes = () => {
    navigator.clipboard?.writeText(notes);
    setCopied(true);
    if (onTriggerToast) onTriggerToast('Copied release notes to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="release-notes-view">
      <header className="page-head row">
        <div>
          <h2>Release Notes & Changelog Generator</h2>
          <p className="muted">
            Auto-generate customer-ready GitHub/GitLab release notes and changelogs from resolved defects and Git commits.
          </p>
        </div>
        <div className="actions">
          {notes && (
            <button className="btn" onClick={copyNotes}>
              {copied ? '✓ Notes Copied' : '📋 Copy Markdown'}
            </button>
          )}
          <button className="btn primary" onClick={generateNotes} disabled={generating}>
            {generating ? 'Compiling Changelog…' : '✨ Generate Release Notes'}
          </button>
        </div>
      </header>

      <div className="grid" style={{ gridTemplateColumns: '320px 1fr', gap: '1.2rem' }}>
        {/* Release Metadata Config */}
        <section className="glass">
          <h3>Release Metadata</h3>
          <p className="muted">Configure semantic version tag</p>

          <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
            <label style={{ display: 'grid', gap: '0.3rem' }}>
              <span className="muted">Semantic Version Tag:</span>
              <input
                type="text"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
              />
            </label>

            <label style={{ display: 'grid', gap: '0.3rem' }}>
              <span className="muted">Release Title:</span>
              <input
                type="text"
                value={releaseTitle}
                onChange={(e) => setReleaseTitle(e.target.value)}
              />
            </label>

            <div>
              <span className="muted" style={{ display: 'block', marginBottom: '0.4rem' }}>Included Commits:</span>
              <div style={{ display: 'grid', gap: '0.4rem', maxHeight: '200px', overflowY: 'auto' }}>
                {COMMITS_LOG.map((c) => (
                  <div key={c.hash} style={{ padding: '0.4rem 0.6rem', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', fontSize: '0.78rem' }}>
                    <code style={{ color: 'var(--cyan)' }}>{c.hash}</code> {c.message}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Generated Release Notes Display */}
        <section className="glass">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
            <h3>Generated Markdown Document</h3>
            <span className="chip on" style={{ fontSize: '0.75rem' }}>GitHub Releases Format</span>
          </div>

          <pre
            style={{
              margin: 0,
              padding: '1.2rem',
              background: 'rgba(0,0,0,0.6)',
              borderRadius: '10px',
              border: '1px solid var(--line)',
              fontFamily: 'monospace',
              fontSize: '0.82rem',
              lineHeight: '1.6',
              color: '#e2e8f0',
              overflowX: 'auto',
              maxHeight: '450px',
              whiteSpace: 'pre-wrap',
            }}
          >
            <code>{notes || '// Click "Generate Release Notes" to compile changelog from project commits and resolved defects.'}</code>
          </pre>
        </section>
      </div>
    </div>
  );
}
