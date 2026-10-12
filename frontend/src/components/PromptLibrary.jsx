// Organization: Orbytes Global Solutions, Owner: Kirthik, Created at: 2026-10-11
// Description: Interactive prompt engineering library with categorized templates and one-click copy

import { useState } from 'react';

const CATEGORIES = ['All', 'Refactoring', 'Testing', 'Security', 'Architecture', 'Database'];

const PROMPTS = [
  {
    id: 1,
    title: 'Domain-Driven Design (DDD) Refactoring',
    category: 'Architecture',
    icon: '🏛️',
    prompt: 'Refactor this service into Domain-Driven Design (DDD) principles. Extract core domain logic into pure aggregate entities and keep the application service layer thin and free of infrastructure leaks.',
  },
  {
    id: 2,
    title: 'Mockito & JUnit 5 Unit Tests (100% Branch Coverage)',
    category: 'Testing',
    icon: '🧪',
    prompt: 'Generate comprehensive JUnit 5 unit tests with Mockito for this class. Include happy paths, edge cases, null arguments, and verified exception throwing to achieve 100% branch coverage.',
  },
  {
    id: 3,
    title: 'Resolve JPA / Hibernate N+1 Query Problem',
    category: 'Database',
    icon: '🗄️',
    prompt: 'Analyze this JPA repository and entity mappings for N+1 select queries. Rewrite the query using JOIN FETCH or @EntityGraph to retrieve associated collections in a single round trip.',
  },
  {
    id: 4,
    title: 'OWASP Top 10 Security Hardening Audit',
    category: 'Security',
    icon: '🛡️',
    prompt: 'Inspect this code against OWASP Top 10 security standards. Check for SQL Injection, XSS, insecure deserialization, broken authentication, and plaintext secrets. Propose exact patch diffs.',
  },
  {
    id: 5,
    title: 'Convert REST Controller to GraphQL Schema & Resolvers',
    category: 'Refactoring',
    icon: '⚡',
    prompt: 'Convert this Spring Boot REST controller into a Spring GraphQL controller with corresponding schema definitions (.graphqls) and Query/Mutation resolver mappings.',
  },
  {
    id: 6,
    title: 'Docker Multi-Stage Build Optimization',
    category: 'Architecture',
    icon: '🐳',
    prompt: 'Generate an optimized multi-stage Dockerfile for this Java Spring Boot application using Eclipse Temurin JRE alpine, non-root user security, and layer caching.',
  },
];

export default function PromptLibrary({ onUsePrompt, onTriggerToast }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [copiedId, setCopiedId] = useState(null);

  const filtered = activeCategory === 'All'
    ? PROMPTS
    : PROMPTS.filter((p) => p.category === activeCategory);

  const handleCopy = (p) => {
    navigator.clipboard?.writeText(p.prompt);
    setCopiedId(p.id);
    if (onTriggerToast) onTriggerToast(`Copied prompt: ${p.title}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="prompt-library-view">
      <header className="page-head row">
        <div>
          <h2>AI Prompt Engineering & Template Library</h2>
          <p className="muted">
            Battle-tested prompts for Clean Architecture, Mockito tests, security audits, and query optimization.
          </p>
        </div>
      </header>

      {/* Category Filter Chips */}
      <div className="chips" style={{ marginBottom: '1.2rem' }}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`chip ${activeCategory === cat ? 'on' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Prompt Grid */}
      <div className="grid" style={{ gap: '1rem' }}>
        {filtered.map((p) => (
          <div
            key={p.id}
            className="glass"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              margin: 0,
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                <span style={{ fontSize: '1.4rem' }}>{p.icon}</span>
                <span className="chip" style={{ fontSize: '0.72rem', padding: '2px 8px' }}>
                  {p.category}
                </span>
              </div>
              <h3 style={{ fontSize: '1.05rem', margin: '0 0 0.4rem' }}>{p.title}</h3>
              <p
                style={{
                  fontSize: '0.85rem',
                  lineHeight: '1.45',
                  color: 'var(--muted)',
                  background: 'rgba(0,0,0,0.3)',
                  padding: '0.8rem',
                  borderRadius: '8px',
                  fontFamily: 'monospace',
                }}
              >
                "{p.prompt}"
              </p>
            </div>

            <div className="actions" style={{ marginTop: '0.8rem' }}>
              <button
                className="btn primary"
                style={{ flex: 1, padding: '0.45rem' }}
                onClick={() => handleCopy(p)}
              >
                {copiedId === p.id ? '✓ Copied to Clipboard' : '📋 Copy Prompt'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
