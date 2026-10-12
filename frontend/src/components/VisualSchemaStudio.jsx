// Organization: Orbytes Global Solutions, Owner: Logaraj S, Created at: 2026-10-12
// Description: Interactive Visual Entity-Relationship (ER) Schema Diagram & Migration Generator

import { useState } from 'react';

const ER_ENTITIES = [
  {
    name: 'projects',
    desc: 'Core workspace tenant',
    columns: [
      { name: 'id', type: 'BIGINT', key: 'PK' },
      { name: 'name', type: 'VARCHAR(255)', key: '' },
      { name: 'description', type: 'TEXT', key: '' },
      { name: 'owner_id', type: 'BIGINT', key: 'FK -> users.id' },
      { name: 'created_at', type: 'TIMESTAMP', key: '' },
    ],
  },
  {
    name: 'issues',
    desc: 'Project defect inventory',
    columns: [
      { name: 'id', type: 'BIGINT', key: 'PK' },
      { name: 'project_id', type: 'BIGINT', key: 'FK -> projects.id' },
      { name: 'title', type: 'VARCHAR(255)', key: '' },
      { name: 'severity', type: 'ENUM', key: 'INDEX' },
      { name: 'status', type: 'ENUM', key: 'INDEX' },
      { name: 'verified_fix', type: 'BOOLEAN', key: '' },
    ],
  },
  {
    name: 'code_reviews',
    desc: 'Static & AI review submissions',
    columns: [
      { name: 'id', type: 'BIGINT', key: 'PK' },
      { name: 'project_id', type: 'BIGINT', key: 'FK -> projects.id' },
      { name: 'title', type: 'VARCHAR(255)', key: '' },
      { name: 'summary', type: 'TEXT', key: '' },
      { name: 'status', type: 'VARCHAR(50)', key: '' },
    ],
  },
  {
    name: 'review_findings',
    desc: 'Line-by-line diff findings',
    columns: [
      { name: 'id', type: 'BIGINT', key: 'PK' },
      { name: 'review_id', type: 'BIGINT', key: 'FK -> code_reviews.id' },
      { name: 'severity', type: 'VARCHAR(50)', key: '' },
      { name: 'line_start', type: 'INT', key: '' },
      { name: 'proposed_diff', type: 'TEXT', key: '' },
      { name: 'status', type: 'VARCHAR(50)', key: '' },
    ],
  },
  {
    name: 'monitored_services',
    desc: 'Microservice telemetry targets',
    columns: [
      { name: 'id', type: 'BIGINT', key: 'PK' },
      { name: 'project_id', type: 'BIGINT', key: 'FK -> projects.id' },
      { name: 'name', type: 'VARCHAR(150)', key: '' },
      { name: 'endpoint_url', type: 'VARCHAR(255)', key: '' },
      { name: 'status', type: 'ENUM', key: '' },
      { name: 'last_latency_ms', type: 'BIGINT', key: '' },
    ],
  },
];

export default function VisualSchemaStudio({ onTriggerToast }) {
  const [selectedEntity, setSelectedEntity] = useState(ER_ENTITIES[0]);
  const [migrationFormat, setMigrationFormat] = useState('mysql');
  const [copied, setCopied] = useState(false);

  const generateDdl = () => {
    return ER_ENTITIES.map((e) => {
      const cols = e.columns.map((c) => `  \`${c.name}\` ${c.type}${c.key.includes('PK') ? ' PRIMARY KEY AUTO_INCREMENT' : ''}`).join(',\n');
      return `CREATE TABLE IF NOT EXISTS \`${e.name}\` (\n${cols}\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`;
    }).join('\n\n');
  };

  const copyDdl = () => {
    navigator.clipboard?.writeText(generateDdl());
    setCopied(true);
    if (onTriggerToast) onTriggerToast('Copied full MySQL schema DDL!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="schema-studio-view">
      <header className="page-head row">
        <div>
          <h2>Visual Database ER-Diagram & Schema Studio</h2>
          <p className="muted">
            Interactive Entity-Relationship visualizer, foreign key relationship mapping, and SQL DDL migration exporter.
          </p>
        </div>
        <div className="actions">
          <button className="btn" onClick={copyDdl}>
            {copied ? '✓ DDL Copied' : '📋 Export DDL Migration'}
          </button>
        </div>
      </header>

      {/* Visual ER Diagram Node Canvas */}
      <section className="glass" style={{ marginBottom: '1.2rem', overflowX: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
          <h3>Interactive Entity Nodes</h3>
          <span className="chip on" style={{ fontSize: '0.75rem' }}>Engine: MySQL 8.0 InnoDB</span>
        </div>

        <div style={{ display: 'flex', gap: '1.2rem', minWidth: '900px', paddingBottom: '0.6rem' }}>
          {ER_ENTITIES.map((entity) => (
            <div
              key={entity.name}
              onClick={() => setSelectedEntity(entity)}
              style={{
                flex: 1,
                minWidth: '220px',
                background: selectedEntity.name === entity.name ? 'rgba(99,102,241,0.2)' : 'rgba(15,18,40,0.85)',
                border: selectedEntity.name === entity.name ? '2px solid var(--indigo)' : '1px solid var(--line)',
                borderRadius: '12px',
                overflow: 'hidden',
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
              }}
            >
              <div style={{ padding: '0.6rem 0.8rem', background: 'rgba(255,255,255,0.06)', borderBottom: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between' }}>
                <b style={{ color: 'var(--cyan)' }}>{entity.name}</b>
                <span className="chip" style={{ fontSize: '0.68rem', padding: '1px 6px' }}>Table</span>
              </div>
              <div style={{ padding: '0.6rem 0.8rem', fontSize: '0.75rem', display: 'grid', gap: '0.4rem' }}>
                {entity.columns.map((c) => (
                  <div key={c.name} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: c.key.includes('PK') ? 'var(--med)' : c.key.includes('FK') ? 'var(--violet)' : 'var(--text)' }}>
                      {c.key.includes('PK') ? '🔑 ' : c.key.includes('FK') ? '🔗 ' : ''}{c.name}
                    </span>
                    <small className="muted">{c.type}</small>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Selected Entity Details & Relationships */}
      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
        <section className="glass">
          <h3>Table Definition: <code>{selectedEntity.name}</code></h3>
          <p className="muted">{selectedEntity.desc}</p>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', marginTop: '0.8rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--line)', textAlign: 'left', color: 'var(--muted)' }}>
                <th style={{ padding: '6px' }}>Column</th>
                <th style={{ padding: '6px' }}>Data Type</th>
                <th style={{ padding: '6px' }}>Constraints & Keys</th>
              </tr>
            </thead>
            <tbody>
              {selectedEntity.columns.map((col) => (
                <tr key={col.name} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '8px' }}><code>{col.name}</code></td>
                  <td style={{ padding: '8px', color: 'var(--cyan)' }}>{col.type}</td>
                  <td style={{ padding: '8px' }}>
                    {col.key ? (
                      <span className={`chip ${col.key.includes('PK') ? 'on' : ''}`} style={{ fontSize: '0.72rem', padding: '1px 6px' }}>
                        {col.key}
                      </span>
                    ) : (
                      <span className="muted">None</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* DDL SQL Generator Preview */}
        <section className="glass">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
            <h3>Generated SQL Migration (DDL)</h3>
            <select
              value={migrationFormat}
              onChange={(e) => setMigrationFormat(e.target.value)}
              style={{ fontSize: '0.78rem', padding: '0.2rem 0.5rem' }}
            >
              <option value="mysql">MySQL 8.0</option>
              <option value="postgres">PostgreSQL 16</option>
            </select>
          </div>

          <pre
            style={{
              margin: 0,
              padding: '1rem',
              background: 'rgba(0,0,0,0.6)',
              borderRadius: '8px',
              fontFamily: 'monospace',
              fontSize: '0.8rem',
              lineHeight: '1.5',
              color: '#86efac',
              maxHeight: '340px',
              overflowY: 'auto',
            }}
          >
            <code>{generateDdl()}</code>
          </pre>
        </section>
      </div>
    </div>
  );
}
