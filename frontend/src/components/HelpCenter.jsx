import { useEffect, useState } from 'react';
import { api } from '../api.js';

export default function HelpCenter() {
  const [articles, setArticles] = useState([]);
  const [q, setQ] = useState('');

  useEffect(() => { api.help().then(setArticles).catch(() => {}); }, []);

  const term = q.trim().toLowerCase();
  const shown = articles.filter((a) => !term || `${a.question} ${a.answer} ${a.topic}`.toLowerCase().includes(term));
  const topics = [...new Set(shown.map((a) => a.topic))];

  return (
    <>
      <header className="page-head">
        <h2>Help Center</h2>
        <p className="muted">Search for an answer, or browse by topic.</p>
      </header>
      <input className="search" type="search" placeholder="Search help, for example “health score”" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search help" />
      {topics.length === 0 && <section className="glass"><p className="muted">No answers match “{q}”. Try a shorter word.</p></section>}
      {topics.map((t) => (
        <section className="glass" key={t}>
          <h3>{t}</h3>
          {shown.filter((a) => a.topic === t).map((a) => (
            <details key={a.id}><summary>{a.question}</summary><p className="muted">{a.answer}</p></details>
          ))}
        </section>
      ))}
      <section className="glass">
        <h3>Keyboard tips</h3>
        <p className="muted">Press Tab to move between controls and Enter to activate them. Every button has a visible focus ring.</p>
      </section>
    </>
  );
}
