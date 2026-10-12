// Organization: Orbytes Global Solutions, Owner: Logaraj S, Created at: 2026-10-11
// Description: Automated CI/CD and GitHub pipeline webhook simulator

import { useState } from 'react';

const PIPELINE_RUNS = [
  {
    id: 'run-882',
    commit: 'feat: add BCrypt security filter & JWT verification',
    author: 'Kirthik',
    branch: 'main',
    status: 'PASSED',
    duration: '42s',
    stages: ['Lint (Passed)', 'JUnit 5 (9/9 Passed)', 'Security Scan (0 CVE)', 'Docker Build (Passed)'],
  },
  {
    id: 'run-881',
    commit: 'fix: resolve null pointer dereference in transaction batch',
    author: 'Alex Rivera',
    branch: 'feat/fix-tx',
    status: 'PASSED',
    duration: '38s',
    stages: ['Lint (Passed)', 'JUnit 5 (9/9 Passed)', 'Static Analysis (Passed)'],
  },
  {
    id: 'run-880',
    commit: 'refactor: upgrade MySQL database connection pooling',
    author: 'Marcus Brody',
    branch: 'infra/db-pool',
    status: 'WARNING',
    duration: '55s',
    stages: ['Lint (Passed)', 'Integration Tests (Passed)', 'Benchmark (High latency noticed)'],
  },
];

export default function PipelineStudio({ projectId }) {
  const [runs, setRuns] = useState(PIPELINE_RUNS);
  const [triggering, setTriggering] = useState(false);

  const triggerPipeline = () => {
    setTriggering(true);
    const newRun = {
      id: `run-${Math.floor(Math.random() * 800) + 100}`,
      commit: 'manual: AI Copilot triggered build & vulnerability audit',
      author: 'AI Copilot',
      branch: 'main',
      status: 'RUNNING',
      duration: 'In progress…',
      stages: ['Compiling Maven…', 'Running Surefire…'],
    };

    setRuns((prev) => [newRun, ...prev]);

    setTimeout(() => {
      setRuns((prev) =>
        prev.map((r) =>
          r.id === newRun.id
            ? {
                ...r,
                status: 'PASSED',
                duration: '31s',
                stages: [
                  'Lint (Passed)',
                  'JUnit 5 (9/9 Passed)',
                  'Vulnerability Audit (Clean)',
                  'Docker Ready',
                ],
              }
            : r
        )
      );
      setTriggering(false);
    }, 2500);
  };

  return (
    <div className="pipeline-studio">
      <header className="page-head row">
        <div>
          <h2>CI/CD Pipeline & GitHub Automation Studio</h2>
          <p className="muted">
            Automated test runners, pull request webhook listeners, and Docker build pipelines.
          </p>
        </div>
        <div className="actions">
          <button className="btn primary" onClick={triggerPipeline} disabled={triggering}>
            {triggering ? '⚡ Executing Pipeline…' : '🚀 Trigger Manual CI Run'}
          </button>
        </div>
      </header>

      {/* CI Status Summary Grid */}
      <div className="grid" style={{ marginBottom: '1.2rem' }}>
        <div className="glass">
          <small className="muted">Default Branch</small>
          <h3 style={{ margin: '0.3rem 0', color: 'var(--cyan)' }}>main</h3>
          <span className="ok">● All status checks passing</span>
        </div>
        <div className="glass">
          <small className="muted">Automated Test Coverage</small>
          <h3 style={{ margin: '0.3rem 0', color: 'var(--low)' }}>94.8%</h3>
          <span className="ok">JUnit 5 + Mockito + Vite</span>
        </div>
        <div className="glass">
          <small className="muted">Average CI Build Duration</small>
          <h3 style={{ margin: '0.3rem 0' }}>37s</h3>
          <span className="muted">Docker containerized cache active</span>
        </div>
      </div>

      {/* Pipeline Runs Table */}
      <section className="glass">
        <h3>Recent Pipeline Executions</h3>
        <p className="muted">Continuous integration events from Git pushes and pull requests</p>

        <div style={{ display: 'grid', gap: '0.8rem', marginTop: '1rem' }}>
          {runs.map((r) => (
            <div
              key={r.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.6rem',
                padding: '1rem',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid var(--line)',
                borderRadius: '12px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.6rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  <span
                    className={`sev ${r.status === 'PASSED' ? 'low' : r.status === 'RUNNING' ? 'medium' : 'high'}`}
                    style={{ fontSize: '0.75rem', fontWeight: 600 }}
                  >
                    {r.status}
                  </span>
                  <b>{r.commit}</b>
                </div>
                <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                  <span className="chip" style={{ fontSize: '0.75rem', padding: '2px 8px' }}>
                    {r.branch}
                  </span>
                  <small className="muted">{r.author}</small>
                  <small className="ok">{r.duration}</small>
                </div>
              </div>

              {/* Stage Pills */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {r.stages.map((stage, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: '0.75rem',
                      background: 'rgba(0,0,0,0.3)',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      color: stage.includes('Passed') ? 'var(--low)' : 'var(--muted)',
                    }}
                  >
                    ✓ {stage}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
