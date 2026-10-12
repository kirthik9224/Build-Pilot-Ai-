import { useState } from 'react';

const CATEGORIES = ['All', 'UI/UX', 'Accessibility', 'Responsive', 'Security', 'Code Quality'];

export default function ErrorCenter({ issues, onRepair, onRepairAll }) {
  const [filter, setFilter] = useState('All');
  const [busy, setBusy] = useState(null);

  const shown = issues.filter((i) => filter === 'All' || i.category === filter);
  const openCount = issues.filter((i) => i.status === 'OPEN').length;

  const fix = async (id) => {
    setBusy(id);
    await new Promise((r) => setTimeout(r, 600)); // simulated AI repair time
    await onRepair(id);
    setBusy(null);
  };

  return (
    <>
      <header className="page-head row">
        <div>
          <h2>Error Detection Center</h2>
          <p className="muted">{openCount} open issues. Filter by category, read the cause and impact, then repair.</p>
        </div>
        <button className="btn primary" disabled={!openCount} onClick={onRepairAll}>Repair all open issues</button>
      </header>

      <div className="chips" role="tablist">
        {CATEGORIES.map((c) => (
          <button key={c} className={`chip ${filter === c ? 'on' : ''}`} onClick={() => setFilter(c)}>{c}</button>
        ))}
      </div>

      {shown.length === 0 && <section className="glass"><p className="muted">No issues in this category.</p></section>}

      {shown.map((i) => (
        <article key={i.id} className={`glass issue ${i.status === 'RESOLVED' ? 'done' : ''}`}>
          <div className="issue-top">
            <span className={`sev ${i.severity.toLowerCase()}`}>{i.severity.toLowerCase()}</span>
            <h3>{i.title}</h3>
            <code>{i.fileName}</code>
          </div>
          <dl>
            <dt>Root cause</dt><dd>{i.rootCause}</dd>
            <dt>Impact</dt><dd>{i.impact}</dd>
          </dl>
          {i.status === 'OPEN'
            ? <button className="btn" disabled={busy === i.id} onClick={() => fix(i.id)}>{busy === i.id ? 'Repairing…' : 'Repair issue'}</button>
            : <span className="ok">Repaired</span>}
        </article>
      ))}
    </>
  );
}
