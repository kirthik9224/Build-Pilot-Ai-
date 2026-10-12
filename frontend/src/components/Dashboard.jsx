// Organization: Orbytes Global Solutions, Owner: Logaraj S, Created at: 2026-10-11
// Description: Modern SaaS Dashboard displaying aggregated database metrics across all modules

export default function Dashboard({ stats, user, go }) {
  if (!stats) return <section className="glass"><p className="muted">Loading project data…</p></section>;
  const tone = stats.healthScore >= 80 ? 'good' : stats.healthScore >= 50 ? 'warn' : 'bad';

  return (
    <>
      <header className="page-head row">
        <div>
          <h2>Welcome back, {user.name}</h2>
          <p className="muted">
            {stats.project}: {stats.open === 0
              ? 'All defects resolved. Clean and ready to deploy.'
              : `${stats.open} issues need attention.`}
          </p>
        </div>
        <div className="actions">
          <button className="btn primary" onClick={() => go('review')}>New Code Review</button>
          <button className="btn" onClick={() => go('errors')}>Debug Errors</button>
          <button className="btn" onClick={() => go('design')}>Design AI Studio</button>
          <button className="btn" onClick={() => go('deadline')}>Project Planner</button>
          <button className="btn" onClick={() => go('production')}>Live Health</button>
        </div>
      </header>

      {/* ChatGPT / Gemini Conversational AI Briefing & Quick Starters */}
      <section
        className="glass"
        style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.18), rgba(168,85,247,0.14))',
          borderColor: 'rgba(168,85,247,0.35)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          marginBottom: '1.2rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <span style={{ fontSize: '1.8rem' }}>✨</span>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>
              BuildPilot AI Intelligence Hub
            </h3>
            <p className="muted" style={{ margin: 0, fontSize: '0.9rem' }}>
              Autonomous conversational agent active. Ask anything, execute instant fixes, or launch smart workflows below.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          <button
            className="starter-chip"
            style={{ fontSize: '0.85rem', padding: '6px 14px' }}
            onClick={() => go('review')}
          >
            🛡️ AI Code Review & Security Audit
          </button>
          <button
            className="starter-chip"
            style={{ fontSize: '0.85rem', padding: '6px 14px' }}
            onClick={() => go('errors')}
          >
            ⚡ Diagnose Errors & Auto-Verify Fixes
          </button>
          <button
            className="starter-chip"
            style={{ fontSize: '0.85rem', padding: '6px 14px' }}
            onClick={() => go('design')}
          >
            🎨 Prompt-to-React UI Studio
          </button>
          <button
            className="starter-chip"
            style={{ fontSize: '0.85rem', padding: '6px 14px' }}
            onClick={() => go('mentor')}
          >
            💬 Full AI Developer Chat (ChatGPT/Gemini)
          </button>
          <button
            className="starter-chip"
            style={{ fontSize: '0.85rem', padding: '6px 14px' }}
            onClick={() => go('production')}
          >
            📡 Real-Time Microservice Ping
          </button>
        </div>
      </section>

      {/* Primary KPI Grid */}
      <div className="grid" style={{ marginBottom: '1.2rem' }}>
        <div className="glass">
          <small className="muted">Code Reviews</small>
          <h2 style={{ margin: '0.3rem 0' }}>{stats.codeReviewsCompleted ?? 0}</h2>
          <span className="ok" style={{ cursor: 'pointer' }} onClick={() => go('review')}>
            View reviews →
          </span>
        </div>
        <div className="glass">
          <small className="muted">Verified Fixes</small>
          <h2 style={{ margin: '0.3rem 0' }}>{stats.verifiedFixes ?? 0}</h2>
          <span className="ok">Tests confirmed passed</span>
        </div>
        <div className="glass">
          <small className="muted">Open Debug Sessions</small>
          <h2 style={{ margin: '0.3rem 0' }}>{stats.openDebuggingSessions ?? 0}</h2>
          <span className="muted" style={{ cursor: 'pointer' }} onClick={() => go('errors')}>
            Troubleshoot stack traces →
          </span>
        </div>
        <div className="glass">
          <small className="muted">Task Progress</small>
          <h2 style={{ margin: '0.3rem 0' }}>{stats.taskProgress ?? 0}%</h2>
          <span className="muted">{stats.completedTasks ?? 0} of {stats.totalTasks ?? 0} tasks</span>
        </div>
        <div className="glass">
          <small className="muted">Service Health</small>
          <h2 style={{ margin: '0.3rem 0' }}>
            {stats.healthyServicesCount ?? 0}/{stats.totalServicesCount ?? 0}
          </h2>
          <span className={stats.activeAlertsCount > 0 ? 'sev high' : 'ok'}>
            {stats.activeAlertsCount > 0 ? `${stats.activeAlertsCount} alerts active` : '100% Operational'}
          </span>
        </div>
      </div>

      <div className="grid">
        <section className="glass score">
          <div className={`ring ${tone}`} style={{ '--pct': stats.healthScore }}>
            <strong>{stats.healthScore}</strong>
          </div>
          <div>
            <h3>Project health</h3>
            <p className="muted">{stats.open} open, {stats.resolved} resolved of {stats.total} issues.</p>
            <p className="muted">
              {stats.healthScore >= 80
                ? 'Good shape. Passing security and quality checks.'
                : stats.healthScore >= 50
                ? 'Needs work before launch.'
                : 'Not ready to ship.'}
            </p>
          </div>
        </section>

        <section className="glass">
          <h3>Open by severity</h3>
          <p className="muted">Prioritize critical and high issues.</p>
          {Object.entries(stats.openBySeverity || {}).map(([k, v]) => (
            <div className="bar-row" key={k}>
              <span>{k.toLowerCase()}</span>
              <div className="bar">
                <i className={k.toLowerCase()} style={{ width: `${(v / Math.max(1, stats.total)) * 100}%` }} />
              </div>
              <b>{v}</b>
            </div>
          ))}
        </section>

        <section className="glass">
          <h3>Open by category</h3>
          {(!stats.openByCategory || Object.keys(stats.openByCategory).length === 0) && (
            <p className="ok">All categories resolved.</p>
          )}
          {Object.entries(stats.openByCategory || {}).map(([k, v]) => (
            <div className="bar-row" key={k}>
              <span>{k}</span>
              <div className="bar">
                <i className="cat" style={{ width: `${(v / Math.max(1, stats.total)) * 100}%` }} />
              </div>
              <b>{v}</b>
            </div>
          ))}
        </section>
      </div>
    </>
  );
}
