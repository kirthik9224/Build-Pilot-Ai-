import { useState } from 'react';
import { api } from '../api.js';

export default function DeadlineMode() {
  const [form, setForm] = useState({ days: 30, teamSize: 3, features: 12 });
  const [plan, setPlan] = useState(null);
  const [error, setError] = useState('');

  const set = (k) => (e) => setForm({ ...form, [k]: Number(e.target.value) });

  const generate = async (e) => {
    e.preventDefault();
    try { setPlan(await api.roadmap(form)); setError(''); }
    catch { setError('Could not generate the roadmap. Is the backend running?'); }
  };

  return (
    <>
      <header className="page-head">
        <h2>Deadline Mode</h2>
        <p className="muted">Enter your constraints to get a phased roadmap and a risk rating.</p>
      </header>

      <form className="glass form" onSubmit={generate}>
        <label>Days until deadline<input type="number" min="1" value={form.days} onChange={set('days')} /></label>
        <label>Team size<input type="number" min="1" value={form.teamSize} onChange={set('teamSize')} /></label>
        <label>Features to ship<input type="number" min="1" value={form.features} onChange={set('features')} /></label>
        <button className="btn primary">Generate roadmap</button>
        <p className="muted hint">Risk compares features (about 3 person-days each) with days × team size.</p>
      </form>

      {error && <div className="banner" role="alert">{error}</div>}

      {plan && (
        <>
          <section className="glass">
            <h3>Delivery risk: <span className={`sev ${plan.risk.toLowerCase()}`}>{plan.risk.toLowerCase()}</span></h3>
            <p className="muted">Workload is {plan.loadRatio}× the available capacity.</p>
            <ul>{plan.priorities.map((p) => <li key={p}>{p}</li>)}</ul>
          </section>

          <section className="glass">
            <h3>Timeline</h3>
            {plan.phases.map((p) => (
              <div className="track" key={p.name}>
                <span>{p.name} <small>day {p.startDay}–{p.endDay}</small></span>
                <div className="bar">
                  <i className="cat" style={{ marginLeft: `${((p.startDay - 1) / form.days) * 100}%`, width: `${((p.endDay - p.startDay + 1) / form.days) * 100}%` }} />
                </div>
                <small className="muted">{p.tasks.join(' · ')}</small>
              </div>
            ))}
          </section>
        </>
      )}
    </>
  );
}
