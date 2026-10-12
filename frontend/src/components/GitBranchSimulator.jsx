// Organization: Orbytes Global Solutions, Owner: Kirthik, Created at: 2026-10-11
// Description: Interactive Git Branch & Pull Request Review Simulator

import { useState } from 'react';

const BRANCHES = [
  { name: 'main', ahead: 0, behind: 0, lastCommit: 'Merge pull request #14 from feat/auth-tokens', author: 'Kirthik' },
  { name: 'feature/auth-tokens', ahead: 3, behind: 0, lastCommit: 'feat: add BCrypt filter & JWT Bearer verification', author: 'Kirthik' },
  { name: 'fix/sql-injection', ahead: 1, behind: 2, lastCommit: 'fix: parameterized query in OrderRepository', author: 'Alex Rivera' },
  { name: 'perf/db-index-tuning', ahead: 2, behind: 1, lastCommit: 'perf: add compound index on issues(status, severity)', author: 'Marcus Brody' },
];

export default function GitBranchSimulator({ onTriggerToast }) {
  const [selectedBranch, setSelectedBranch] = useState(BRANCHES[1]);
  const [reviewing, setReviewing] = useState(false);
  const [reviewResult, setReviewResult] = useState(null);

  const runPrReview = () => {
    setReviewing(true);
    setReviewResult(null);
    setTimeout(() => {
      setReviewing(false);
      setReviewResult({
        mergeable: true,
        conflicts: 0,
        securityChecks: 'PASSED (0 Vulnerabilities)',
        testSuite: 'PASSED (9/9 Unit Tests)',
        summary: `PR for "${selectedBranch.name}" is clean and ready to merge into main. Zero regressions detected.`,
      });
      if (onTriggerToast) onTriggerToast(`AI PR Review passed for ${selectedBranch.name}!`, 'success');
    }, 1200);
  };

  return (
    <div className="git-simulator-view">
      <header className="page-head row">
        <div>
          <h2>Git Branches & Pull Request Review Simulator</h2>
          <p className="muted">
            Inspect active branches, compare commits, and run automated AI Pull Request readiness reviews.
          </p>
        </div>
        <div className="actions">
          <button className="btn primary" onClick={runPrReview} disabled={reviewing}>
            {reviewing ? 'Analyzing Pull Request…' : '🔍 Run AI PR Review'}
          </button>
        </div>
      </header>

      <div className="grid" style={{ gridTemplateColumns: '1fr 340px', gap: '1.2rem' }}>
        {/* Branches Table */}
        <section className="glass">
          <h3>Active Git Branches</h3>
          <p className="muted">Repository: Orbytes / BuildPilot-AI-Pro</p>

          <div style={{ display: 'grid', gap: '0.8rem', marginTop: '1rem' }}>
            {BRANCHES.map((b) => (
              <div
                key={b.name}
                onClick={() => {
                  setSelectedBranch(b);
                  setReviewResult(null);
                }}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.8rem 1rem',
                  borderRadius: '10px',
                  background: selectedBranch.name === b.name ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--line)',
                  cursor: 'pointer',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span style={{ fontSize: '0.9rem' }}>🌿</span>
                    <b style={{ color: 'var(--cyan)' }}>{b.name}</b>
                    {b.name === 'main' && <span className="chip on" style={{ fontSize: '0.7rem', padding: '1px 6px' }}>Default</span>}
                  </div>
                  <small className="muted" style={{ display: 'block', marginTop: '4px' }}>
                    {b.lastCommit} ({b.author})
                  </small>
                </div>

                <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                  <span className="chip" style={{ fontSize: '0.75rem', padding: '2px 8px' }}>
                    ↑ {b.ahead} ↓ {b.behind}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PR Review Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <section className="glass">
            <h3>Pull Request Review</h3>
            <p className="muted">Target: <code>{selectedBranch.name} → main</code></p>

            {reviewResult ? (
              <div style={{ marginTop: '0.8rem', display: 'grid', gap: '0.8rem' }}>
                <div style={{ padding: '0.8rem', background: 'rgba(74,222,128,0.1)', border: '1px solid var(--low)', borderRadius: '10px' }}>
                  <b className="ok">✓ Ready to Merge</b>
                  <p style={{ margin: '0.3rem 0 0', fontSize: '0.82rem', color: '#e2e8f0' }}>
                    {reviewResult.summary}
                  </p>
                </div>

                <div style={{ fontSize: '0.82rem', display: 'grid', gap: '0.4rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Merge Conflicts:</span>
                    <b className="ok">{reviewResult.conflicts}</b>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Security Audit:</span>
                    <b className="ok">{reviewResult.securityChecks}</b>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Automated Tests:</span>
                    <b className="ok">{reviewResult.testSuite}</b>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--muted)', fontSize: '0.85rem' }}>
                Click "Run AI PR Review" to simulate automated PR checks.
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
