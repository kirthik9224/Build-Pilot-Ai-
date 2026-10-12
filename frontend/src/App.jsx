// Organization: Orbytes Global Solutions, Owner: Logaraj S, Created at: 2026-10-11
// Description: Main application shell routing modules, projects, and security sessions

import { useCallback, useEffect, useState } from 'react';
import { api, session } from './api.js';
import Login from './components/Login.jsx';
import Dashboard from './components/Dashboard.jsx';
import Analytics from './components/Analytics.jsx';
import ErrorCenter from './components/ErrorCenter.jsx';
import DebuggingStudio from './components/DebuggingStudio.jsx';
import CodeReviewCenter from './components/CodeReviewCenter.jsx';
import DesignStudio from './components/DesignStudio.jsx';
import ProjectPlanner from './components/ProjectPlanner.jsx';
import ProductionMonitor from './components/ProductionMonitor.jsx';
import AiMentorChat from './components/AiMentorChat.jsx';
import AiCopilotWidget from './components/AiCopilotWidget.jsx';
import ComponentInspector from './components/ComponentInspector.jsx';
import TeamWorkspace from './components/TeamWorkspace.jsx';
import PipelineStudio from './components/PipelineStudio.jsx';
import DatabaseStudio from './components/DatabaseStudio.jsx';
import ComplianceCertificate from './components/ComplianceCertificate.jsx';
import PromptLibrary from './components/PromptLibrary.jsx';
import TerminalSimulator from './components/TerminalSimulator.jsx';
import CloudDeployment from './components/CloudDeployment.jsx';
import ComplexityProfiler from './components/ComplexityProfiler.jsx';
import WebhookStudio from './components/WebhookStudio.jsx';
import TestCaseGenerator from './components/TestCaseGenerator.jsx';
import ApiExplorer from './components/ApiExplorer.jsx';
import GitBranchSimulator from './components/GitBranchSimulator.jsx';
import AiToolsHub from './components/AiToolsHub.jsx';
import CommandPalette from './components/CommandPalette.jsx';
import ToastContainer from './components/ToastContainer.jsx';
import OnboardingModal from './components/OnboardingModal.jsx';
import NewAppWizard from './components/NewAppWizard.jsx';
import CodeCollaborationRoom from './components/CodeCollaborationRoom.jsx';
import SecuritySbomScanner from './components/SecuritySbomScanner.jsx';
import ReleaseNotesGenerator from './components/ReleaseNotesGenerator.jsx';
import VisualSchemaStudio from './components/VisualSchemaStudio.jsx';
import RepositoryExplorer from './components/RepositoryExplorer.jsx';
import AiFinOpsAnalytics from './components/AiFinOpsAnalytics.jsx';
import Settings from './components/Settings.jsx';
import HelpCenter from './components/HelpCenter.jsx';

const GROUPS = [
  {
    title: 'Overview',
    items: [
      { id: 'dashboard', label: 'Dashboard' },
      { id: 'analytics', label: 'Analytics' },
      { id: 'finops', label: 'AI FinOps & Tokens' },
    ],
  },
  {
    title: 'Build',
    items: [
      { id: 'review', label: 'Code Review Center' },
      { id: 'files', label: 'Repository Explorer' },
      { id: 'schema', label: 'Visual ER Schema' },
      { id: 'design', label: 'Design AI Studio' },
      { id: 'inspector', label: 'Component Inspector' },
      { id: 'tests', label: 'AI Test Generator' },
      { id: 'explorer', label: 'OpenAPI Explorer' },
      { id: 'complexity', label: 'Big-O Complexity' },
      { id: 'database', label: 'Database & SQL Studio' },
      { id: 'monitor', label: 'AI Monitor' },
    ],
  },
  {
    title: 'Fix and ship',
    items: [
      { id: 'errors', label: 'Error Detection & Fix' },
      { id: 'deadline', label: 'Deadline & Planner' },
      { id: 'pipeline', label: 'CI/CD Pipelines' },
      { id: 'git', label: 'Git Branches & PRs' },
      { id: 'cloud', label: 'Multi-Cloud & K8s' },
      { id: 'sbom', label: 'SBOM & Security Audit' },
      { id: 'webhooks', label: 'Incident Webhooks' },
      { id: 'terminal', label: 'Terminal Simulator' },
      { id: 'production', label: 'Production Monitoring' },
      { id: 'release', label: 'Release Notes & Changelog' },
      { id: 'certificate', label: 'Compliance Certificate' },
    ],
  },
  {
    title: 'Learn and collaborate',
    items: [
      { id: 'mentor', label: 'AI Mentor Chat' },
      { id: 'aitools', label: 'AI Tools & LLM Hub' },
      { id: 'collab', label: 'Live Code Pairing' },
      { id: 'prompts', label: 'Prompt Library' },
      { id: 'team', label: 'Team Workspace' },
    ],
  },
  {
    title: 'Account',
    items: [
      { id: 'settings', label: 'Settings' },
      { id: 'help', label: 'Help Center' },
    ],
  },
];
const ALL = GROUPS.flatMap((g) => g.items);

export default function App() {
  const [user, setUser] = useState(() => {
    const u = session.get();
    return u && u.name ? u : null;
  });
  const [page, setPage] = useState('dashboard');
  const [errorMode, setErrorMode] = useState('debugger'); // 'debugger' | 'issues'
  const [theme, setTheme] = useState('default'); // 'default' | 'obsidian' | 'cyberpunk' | 'light'
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [projects, setProjects] = useState([]);
  const [activeProjectId, setActiveProjectId] = useState(1);
  const [issues, setIssues] = useState([]);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  const showToast = useCallback((msg, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message: msg, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
    document.body.className = newTheme === 'default' ? '' : `theme-${newTheme}`;
    showToast(`Switched theme to ${newTheme.toUpperCase()}`);
  };

  const loadProjects = useCallback(async () => {
    try {
      const list = await api.projects();
      setProjects(list);
      if (list.length > 0 && !list.some((p) => p.id === activeProjectId)) {
        setActiveProjectId(list[0].id);
      }
    } catch (e) {}
  }, [activeProjectId]);

  const load = useCallback(async () => {
    try {
      const [i, s] = await Promise.all([
        api.issues(activeProjectId),
        api.dashboard(activeProjectId),
      ]);
      setIssues(i);
      setStats(s);
      setError('');
    } catch (e) {
      if (session.get()) {
        setError('Cannot reach the API. Start the Spring Boot backend on port 8080.');
      }
    }
  }, [activeProjectId]);

  useEffect(() => {
    const out = () => setUser(null);
    window.addEventListener('bp-logout', out);
    return () => window.removeEventListener('bp-logout', out);
  }, []);

  useEffect(() => {
    if (user) {
      loadProjects();
      load();
    }
  }, [user, load, loadProjects]);

  const handleCreateProject = async () => {
    const name = window.prompt('Enter new project name:');
    if (!name || !name.trim()) return;
    try {
      const p = await api.createProject({ name: name.trim() });
      await loadProjects();
      setActiveProjectId(p.id);
    } catch (err) {
      alert('Could not create project: ' + err.message);
    }
  };

  const logout = async () => {
    try { await api.logout(); } catch { /* ignore */ }
    session.clear();
    setUser(null);
    setPage('dashboard');
  };

  if (!user) return <Login onLogin={setUser} />;

  const repair = async (id) => { await api.repair(id); await load(); };
  const repairAll = async () => { await api.repairAll(activeProjectId); await load(); };
  const current = ALL.find((m) => m.id === page) || ALL[0];

  return (
    <div className="shell">
      <nav className="sidebar" aria-label="Modules">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <img
            src="/logo.png"
            alt="BuildPilot AI Pro Logo"
            style={{
              width: '38px',
              height: '38px',
              objectFit: 'contain',
              filter: 'drop-shadow(0 0 6px rgba(0, 229, 255, 0.4))',
            }}
          />
          <h1 className="brand" style={{ margin: 0 }}>BuildPilot <span>AI Pro</span></h1>
        </div>
        {GROUPS.map((g) => (
          <div key={g.title} className="group">
            <h4>{g.title}</h4>
            {g.items.map((m) => (
              <button
                key={m.id}
                className={`nav-item ${page === m.id ? 'active' : ''}`}
                onClick={() => setPage(m.id)}
                aria-current={page === m.id ? 'page' : undefined}
              >
                {m.label}
              </button>
            ))}
          </div>
        ))}
      </nav>

      <div className="main">
        <header className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span className="crumb">{current.label}</span>
            <select
              value={activeProjectId}
              onChange={(e) => setActiveProjectId(Number(e.target.value))}
              style={{
                fontSize: '0.85rem',
                padding: '0.35rem 0.6rem',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid var(--line)',
                color: 'var(--text)',
                borderRadius: '8px',
              }}
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
              {projects.length === 0 && <option value={1}>ShopEase E-commerce Store</option>}
            </select>
            <button
              className="btn primary"
              style={{ padding: '0.3rem 0.75rem', fontSize: '0.82rem' }}
              onClick={() => setWizardOpen(true)}
              title="Create a new full-stack app from scratch"
            >
              + Create App 🚀
            </button>
          </div>

          <div className="who">
            <button
              className="chip"
              onClick={() => setPaletteOpen(true)}
              title="Command Palette (Ctrl+K)"
              style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem', background: 'rgba(99,102,241,0.15)' }}
            >
              ⌘K Search
            </button>
            <select
              value={theme}
              onChange={(e) => changeTheme(e.target.value)}
              style={{ fontSize: '0.8rem', padding: '0.35rem 0.5rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}
              title="Switch Visual Theme"
            >
              <option value="default">🌌 Deep Space</option>
              <option value="obsidian">🖤 Obsidian</option>
              <option value="cyberpunk">⚡ Cyberpunk</option>
              <option value="light">☀️ Light</option>
            </select>
            <button
              className="chip"
              onClick={() => setShowTour(true)}
              title="Take interactive tour"
              style={{ fontSize: '0.8rem', padding: '0.35rem 0.6rem' }}
            >
              🚀 Tour
            </button>
            <button className="btn" onClick={() => setPage('help')}>Help</button>
            <span className="avatar" aria-hidden="true">{user.name.charAt(0)}</span>
            <span><b>{user.name}</b><small>{user.role}</small></span>
            <button className="btn" onClick={logout}>Log out</button>
          </div>
        </header>

        <main className="content">
          {error && <div className="banner" role="alert">{error}</div>}

          {page === 'dashboard' && (
            <Dashboard stats={stats} user={user} go={setPage} />
          )}

          {page === 'analytics' && (
            <Analytics stats={stats} user={user} go={setPage} />
          )}

          {page === 'finops' && (
            <AiFinOpsAnalytics onTriggerToast={showToast} />
          )}

          {page === 'review' && (
            <CodeReviewCenter projectId={activeProjectId} />
          )}

          {page === 'files' && (
            <RepositoryExplorer onTriggerToast={showToast} />
          )}

          {page === 'schema' && (
            <VisualSchemaStudio onTriggerToast={showToast} />
          )}

          {page === 'errors' && (
            <div>
              <div className="chips" style={{ marginBottom: '1.2rem' }}>
                <button
                  className={`chip ${errorMode === 'debugger' ? 'on' : ''}`}
                  onClick={() => setErrorMode('debugger')}
                >
                  AI Error Diagnosis & Test Verification
                </button>
                <button
                  className={`chip ${errorMode === 'issues' ? 'on' : ''}`}
                  onClick={() => setErrorMode('issues')}
                >
                  Database Defect Inventory ({issues.filter((i) => i.status === 'OPEN').length} Open)
                </button>
              </div>

              {errorMode === 'debugger' ? (
                <DebuggingStudio projectId={activeProjectId} />
              ) : (
                <ErrorCenter issues={issues} onRepair={repair} onRepairAll={repairAll} />
              )}
            </div>
          )}

          {page === 'design' && (
            <DesignStudio projectId={activeProjectId} />
          )}

          {page === 'inspector' && (
            <ComponentInspector />
          )}

          {page === 'tests' && (
            <TestCaseGenerator onTriggerToast={showToast} />
          )}

          {page === 'explorer' && (
            <ApiExplorer onTriggerToast={showToast} />
          )}

          {page === 'complexity' && (
            <ComplexityProfiler onTriggerToast={showToast} />
          )}

          {page === 'deadline' && (
            <ProjectPlanner projectId={activeProjectId} />
          )}

          {page === 'team' && (
            <TeamWorkspace user={user} />
          )}

          {page === 'pipeline' && (
            <PipelineStudio projectId={activeProjectId} />
          )}

          {page === 'git' && (
            <GitBranchSimulator onTriggerToast={showToast} />
          )}

          {page === 'cloud' && (
            <CloudDeployment onTriggerToast={showToast} />
          )}

          {page === 'sbom' && (
            <SecuritySbomScanner onTriggerToast={showToast} />
          )}

          {page === 'webhooks' && (
            <WebhookStudio onTriggerToast={showToast} />
          )}

          {page === 'database' && (
            <DatabaseStudio />
          )}

          {page === 'terminal' && (
            <TerminalSimulator />
          )}

          {page === 'production' && (
            <ProductionMonitor projectId={activeProjectId} />
          )}

          {page === 'release' && (
            <ReleaseNotesGenerator onTriggerToast={showToast} />
          )}

          {page === 'certificate' && (
            <ComplianceCertificate stats={stats} user={user} />
          )}

          {(page === 'monitor') && (
            <ProductionMonitor projectId={activeProjectId} />
          )}

          {page === 'mentor' && (
            <AiMentorChat projectId={activeProjectId} />
          )}

          {page === 'aitools' && (
            <AiToolsHub onTriggerToast={showToast} />
          )}

          {page === 'collab' && (
            <CodeCollaborationRoom user={user} onTriggerToast={showToast} />
          )}

          {page === 'prompts' && (
            <PromptLibrary onTriggerToast={showToast} />
          )}

          {page === 'settings' && <Settings user={user} />}
          {page === 'help' && <HelpCenter />}
        </main>
      </div>
      <AiCopilotWidget projectId={activeProjectId} go={setPage} />
      <CommandPalette
        isOpen={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onSelect={setPage}
        onTriggerToast={showToast}
      />
      <ToastContainer
        toasts={toasts}
        onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))}
      />
      <OnboardingModal
        isOpen={showTour}
        onClose={() => setShowTour(false)}
        onNavigate={setPage}
      />
      <NewAppWizard
        isOpen={wizardOpen}
        onClose={() => setWizardOpen(false)}
        onProjectCreated={(newProj) => {
          setProjects((prev) => [newProj, ...prev]);
          setActiveProjectId(newProj.id);
          setPage('dashboard');
        }}
        onTriggerToast={showToast}
      />
    </div>
  );
}
