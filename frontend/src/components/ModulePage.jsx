import { MODULE_INFO } from '../moduleInfo.js';

export default function ModulePage({ id, label, go }) {
  const info = MODULE_INFO[id];
  if (!info) return null;
  return (
    <>
      <header className="page-head">
        <h2>{label}</h2>
        <p className="muted">{info.tagline}</p>
      </header>
      <div className="grid">
        <section className="glass">
          <h3>What you can do here</h3>
          <ul>{info.does.map((d) => <li key={d}>{d}</li>)}</ul>
        </section>
        <section className="glass">
          <h3>How to use it</h3>
          <ol>{info.steps.map((d) => <li key={d}>{d}</li>)}</ol>
        </section>
      </div>
      <section className="glass tip"><b>Tip:</b> {info.tip}</section>
      <section className="glass status">
        <p className="muted">The interactive tools for this page are still being built. In the meantime you can review open problems or ask for help.</p>
        <button className="btn primary" onClick={() => go('errors')}>Review open issues</button>
        <button className="btn" onClick={() => go('help')}>Open Help Center</button>
      </section>
    </>
  );
}
