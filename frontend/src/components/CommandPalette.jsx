// Organization: Orbytes Global Solutions, Owner: Kirthik, Created at: 2026-10-11
// Description: Keyboard Command Palette (Ctrl+K / Cmd+K) for rapid navigation and AI actions

import { useEffect, useState } from 'react';

const COMMANDS = [
  { id: 'dashboard', label: 'Go to Dashboard', category: 'Navigation', icon: '📊' },
  { id: 'analytics', label: 'Go to Engineering Analytics', category: 'Navigation', icon: '📈' },
  { id: 'finops', label: 'Open AI FinOps & Tokens', category: 'Navigation', icon: '💎' },
  { id: 'review', label: 'Open Code Review Center', category: 'Navigation', icon: '🛡️' },
  { id: 'files', label: 'Open Repository Explorer & Editor', category: 'Navigation', icon: '📁' },
  { id: 'schema', label: 'Open Visual ER Schema Studio', category: 'Navigation', icon: '📐' },
  { id: 'design', label: 'Open Design AI Studio', category: 'Navigation', icon: '🎨' },
  { id: 'inspector', label: 'Inspect Components & WCAG', category: 'Navigation', icon: '🔍' },
  { id: 'tests', label: 'AI Test Case Generator', category: 'Navigation', icon: '🧪' },
  { id: 'explorer', label: 'OpenAPI Explorer', category: 'Navigation', icon: '🔌' },
  { id: 'complexity', label: 'Big-O Complexity Profiler', category: 'Navigation', icon: '⏱️' },
  { id: 'database', label: 'Open Database & SQL Studio', category: 'Navigation', icon: '🗄️' },
  { id: 'errors', label: 'Troubleshoot Errors & Stack Traces', category: 'Navigation', icon: '⚡' },
  { id: 'deadline', label: 'Deadline & Sprint Planner', category: 'Navigation', icon: '📅' },
  { id: 'pipeline', label: 'View CI/CD Pipelines', category: 'Navigation', icon: '🚀' },
  { id: 'git', label: 'Git Branches & PR Visualizer', category: 'Navigation', icon: '🌿' },
  { id: 'cloud', label: 'Multi-Cloud & K8s Deployer', category: 'Navigation', icon: '☁️' },
  { id: 'sbom', label: 'SBOM & Vulnerability Audit', category: 'Navigation', icon: '🔒' },
  { id: 'webhooks', label: 'Incident Webhook Studio', category: 'Navigation', icon: '🔔' },
  { id: 'terminal', label: 'Cloud Terminal Simulator', category: 'Navigation', icon: '💻' },
  { id: 'production', label: 'View Production Health Monitor', category: 'Navigation', icon: '📡' },
  { id: 'release', label: 'Release Notes & Changelog AI', category: 'Navigation', icon: '📝' },
  { id: 'certificate', label: 'Generate Compliance Certificate', category: 'Navigation', icon: '📜' },
  { id: 'mentor', label: 'Chat with AI Mentor', category: 'Navigation', icon: '💬' },
  { id: 'aitools', label: 'AI Tools & LLM Hub', category: 'Navigation', icon: '🤖' },
  { id: 'collab', label: 'Live Code Pairing Room', category: 'Navigation', icon: '🧑‍💻' },
  { id: 'prompts', label: 'Prompt Engineering Library', category: 'Navigation', icon: '📚' },
  { id: 'team', label: 'Manage Team & RBAC Roles', category: 'Navigation', icon: '👥' },
  { id: 'settings', label: 'Open Project Settings', category: 'Account', icon: '⚙️' },
  { id: 'help', label: 'Browse Documentation & Help', category: 'Account', icon: '❓' },
];

export default function CommandPalette({ isOpen, onClose, onSelect, onTriggerToast }) {
  const [query, setQuery] = useState('');
  const [selectedIdx, setSelectedIdx] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = COMMANDS.filter((c) =>
    c.label.toLowerCase().includes(query.toLowerCase()) ||
    c.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (cmd) => {
    onSelect(cmd.id);
    onClose();
    if (onTriggerToast) {
      onTriggerToast(`Navigated to ${cmd.label}`);
    }
  };

  return (
    <div
      className="palette-backdrop"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2000,
        background: 'rgba(5, 7, 18, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'grid',
        placeItems: 'start center',
        paddingTop: '12vh',
      }}
    >
      <div
        className="glass palette-dialog"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 'min(580px, calc(100vw - 32px))',
          padding: '0',
          borderRadius: '16px',
          boxShadow: '0 25px 50px rgba(0,0,0,0.8), 0 0 40px rgba(99,102,241,0.3)',
          border: '1px solid rgba(160,150,255,0.3)',
          overflow: 'hidden',
          background: '#0d1024',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid var(--line)' }}>
          <span style={{ fontSize: '1.2rem', marginRight: '10px' }}>🔍</span>
          <input
            type="text"
            placeholder="Type a command or jump to workspace… (Esc to exit)"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIdx(0);
            }}
            autoFocus
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: '1rem',
              color: '#fff',
            }}
          />
          <span className="chip" style={{ fontSize: '0.75rem', padding: '2px 8px' }}>ESC</span>
        </div>

        <div style={{ maxHeight: '360px', overflowY: 'auto', padding: '8px' }}>
          {filtered.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--muted)' }}>
              No commands matching "{query}"
            </div>
          ) : (
            filtered.map((cmd, i) => (
              <div
                key={cmd.id}
                onClick={() => handleSelect(cmd)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  background: i === selectedIdx ? 'rgba(99,102,241,0.25)' : 'transparent',
                  color: i === selectedIdx ? '#fff' : 'var(--text)',
                }}
                onMouseEnter={() => setSelectedIdx(i)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span>{cmd.icon}</span>
                  <b>{cmd.label}</b>
                </div>
                <span className="chip" style={{ fontSize: '0.7rem', padding: '1px 6px' }}>
                  {cmd.category}
                </span>
              </div>
            ))
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 14px', borderTop: '1px solid var(--line)', background: 'rgba(0,0,0,0.2)', fontSize: '0.75rem', color: 'var(--muted)' }}>
          <span>Navigate with mouse or arrow keys</span>
          <span>BuildPilot AI Pro · Orbytes</span>
        </div>
      </div>
    </div>
  );
}
