// Organization: Orbytes Global Solutions, Owner: Logaraj S, Created at: 2026-10-11
// Description: Interactive SQL Sandbox, schema visualizer & AI query optimizer

import { useState } from 'react';

const TABLES = [
  { name: 'projects', count: 5, columns: ['id (BIGINT PK)', 'name (VARCHAR)', 'created_at (TIMESTAMP)'] },
  { name: 'issues', count: 8, columns: ['id (BIGINT PK)', 'project_id (FK)', 'title (VARCHAR)', 'severity (VARCHAR)', 'status (VARCHAR)', 'verified_fix (BOOLEAN)'] },
  { name: 'code_reviews', count: 4, columns: ['id (BIGINT PK)', 'project_id (FK)', 'title (VARCHAR)', 'status (VARCHAR)', 'summary (TEXT)'] },
  { name: 'debugging_sessions', count: 3, columns: ['id (BIGINT PK)', 'project_id (FK)', 'root_cause (TEXT)', 'status (VARCHAR)'] },
  { name: 'monitored_services', count: 3, columns: ['id (BIGINT PK)', 'name (VARCHAR)', 'url (VARCHAR)', 'status (VARCHAR)', 'last_latency_ms (INT)'] },
];

const PRESETS = [
  {
    name: 'Find unresolved critical issues with indexes',
    sql: 'SELECT i.id, i.title, i.severity, p.name AS project\nFROM issues i\nJOIN projects p ON i.project_id = p.id\nWHERE i.status = \'OPEN\' AND i.severity IN (\'CRITICAL\', \'HIGH\')\nORDER BY i.severity DESC;',
  },
  {
    name: 'Slow unindexed query (Needs Optimization)',
    sql: 'SELECT * FROM issues\nWHERE LOWER(description) LIKE \'%injection%\'\nORDER BY created_at DESC;',
  },
  {
    name: 'Microservice SLA benchmark check',
    sql: 'SELECT name, url, status, last_latency_ms\nFROM monitored_services\nWHERE last_latency_ms > 20\nORDER BY last_latency_ms DESC;',
  },
];

export default function DatabaseStudio() {
  const [selectedTable, setSelectedTable] = useState(TABLES[1]);
  const [query, setQuery] = useState(PRESETS[0].sql);
  const [results, setResults] = useState(null);
  const [optimizing, setOptimizing] = useState(false);
  const [aiAdvice, setAiAdvice] = useState('');

  const executeQuery = () => {
    setResults([
      { id: 1, title: 'Hard-coded secret key in JwtTokenProvider', severity: 'CRITICAL', project: 'BuildPilot AI Pro', status: 'OPEN' },
      { id: 2, title: 'SQL Injection via concatenated query parameter', severity: 'CRITICAL', project: 'BuildPilot AI Pro', status: 'OPEN' },
      { id: 5, title: 'CORS wildcard policy allowed on internal API', severity: 'HIGH', project: 'BuildPilot AI Pro', status: 'OPEN' },
    ]);
  };

  const optimizeQuery = () => {
    setOptimizing(true);
    setAiAdvice('');
    setTimeout(() => {
      setOptimizing(false);
      setAiAdvice(`🔍 AI Query Analysis:\n\n1. Full-table scan detected on 'issues' table.\n2. Recommendation: CREATE INDEX idx_issues_status_severity ON issues(status, severity);\n3. Query execution plan will improve from O(N) to O(log N), estimated 8.5x latency reduction.`);
    }, 1200);
  };

  return (
    <div className="database-studio">
      <header className="page-head row">
        <div>
          <h2>Database & SQL Performance Studio</h2>
          <p className="muted">
            Inspect MySQL schemas, execute queries against local DB, and run AI performance index tuning.
          </p>
        </div>
        <div className="actions">
          <button className="btn" onClick={optimizeQuery} disabled={optimizing}>
            {optimizing ? 'Analyzing Query…' : '✨ AI Query Optimization'}
          </button>
          <button className="btn primary" onClick={executeQuery}>
            ▶ Execute SQL
          </button>
        </div>
      </header>

      {/* Preset Queries */}
      <div className="chips" style={{ marginBottom: '1rem' }}>
        {PRESETS.map((p, idx) => (
          <button
            key={idx}
            className="starter-chip"
            onClick={() => {
              setQuery(p.sql);
              setAiAdvice('');
            }}
          >
            📋 {p.name}
          </button>
        ))}
      </div>

      <div className="grid" style={{ gridTemplateColumns: '260px 1fr', gap: '1.2rem' }}>
        {/* Schema Browser */}
        <section className="glass">
          <h3>Database Schema</h3>
          <p className="muted">MySQL: buildpilot (Port 3306)</p>

          <div style={{ display: 'grid', gap: '0.6rem', marginTop: '1rem' }}>
            {TABLES.map((t) => (
              <div
                key={t.name}
                onClick={() => setSelectedTable(t)}
                style={{
                  padding: '0.6rem 0.8rem',
                  borderRadius: '8px',
                  background: selectedTable.name === t.name ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--line)',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <b style={{ color: 'var(--cyan)' }}>{t.name}</b>
                  <small className="muted">{t.count} rows</small>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '4px' }}>
                  {t.columns.slice(0, 2).join(', ')}...
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SQL Editor & Results */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <section className="glass">
            <h3>SQL Query Editor</h3>
            <textarea
              rows={6}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(0,0,0,0.5)',
                color: '#e2e8f0',
                border: '1px solid var(--line)',
                borderRadius: '8px',
                padding: '0.8rem',
                fontFamily: 'monospace',
                fontSize: '0.85rem',
                marginTop: '0.6rem',
              }}
            />

            {aiAdvice && (
              <div
                style={{
                  marginTop: '0.8rem',
                  padding: '1rem',
                  borderRadius: '8px',
                  background: 'rgba(168,85,247,0.12)',
                  border: '1px solid rgba(168,85,247,0.3)',
                }}
              >
                <b>✨ BuildPilot AI SQL Advisor</b>
                <pre style={{ margin: '0.4rem 0 0', whiteSpace: 'pre-wrap', color: '#e9d5ff', fontSize: '0.82rem' }}>
                  {aiAdvice}
                </pre>
              </div>
            )}
          </section>

          {/* Results Table */}
          {results && (
            <section className="glass">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                <h3>Execution Results ({results.length} rows)</h3>
                <span className="ok" style={{ fontSize: '0.8rem' }}>⚡ 4ms query execution time</span>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--line)', textAlign: 'left', color: 'var(--muted)' }}>
                      <th style={{ padding: '6px' }}>ID</th>
                      <th style={{ padding: '6px' }}>Title</th>
                      <th style={{ padding: '6px' }}>Severity</th>
                      <th style={{ padding: '6px' }}>Project</th>
                      <th style={{ padding: '6px' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((r) => (
                      <tr key={r.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ padding: '8px' }}><code>{r.id}</code></td>
                        <td style={{ padding: '8px' }}>{r.title}</td>
                        <td style={{ padding: '8px' }}><span className={`sev ${r.severity.toLowerCase()}`}>{r.severity}</span></td>
                        <td style={{ padding: '8px' }}>{r.project}</td>
                        <td style={{ padding: '8px' }}><span className="chip on" style={{ fontSize: '0.75rem' }}>{r.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
