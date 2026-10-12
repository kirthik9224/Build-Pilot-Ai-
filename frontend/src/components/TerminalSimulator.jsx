// Organization: Orbytes Global Solutions, Owner: Logaraj S, Created at: 2026-10-11
// Description: Interactive Docker & Cloud Container Terminal Simulator

import { useState, useRef, useEffect } from 'react';

const INITIAL_LOGS = [
  'BuildPilot AI Terminal v2.4 (Containerized Sandbox)',
  'Connected to sandbox node: worker-ap-south-1a (Isolated cgroup v2)',
  'Type "help" to list available diagnostic commands.',
  '',
];

const COMMAND_MAP = {
  help: [
    'Available CLI commands:',
    '  mvn test           - Run full JUnit 5 Surefire test suite',
    '  docker ps          - List running microservice containers',
    '  docker logs <id>   - Stream container stdout/stderr logs',
    '  curl health        - Ping internal health gateway (/actuator/health)',
    '  git status         - Check branch, modified files, and staging status',
    '  clear              - Clear terminal buffer',
  ],
  'mvn test': [
    '[INFO] Scanning for projects...',
    '[INFO] --------------------------------[ jar ]---------------------------------',
    '[INFO] --- maven-surefire-plugin:3.2.5:test (default-test) @ buildpilot ---',
    '[INFO] Running com.buildpilot.CodeVerificationServiceTest',
    '[INFO] Tests run: 9, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 1.482 s',
    '[INFO] BUILD SUCCESS',
  ],
  'docker ps': [
    'CONTAINER ID   IMAGE                 COMMAND                  STATUS         PORTS',
    '4a8f9c1b2d3e   buildpilot-backend    "java -jar app.jar"      Up 4 hours     0.0.0.0:8080->8080/tcp',
    '7b1c3e5a9f2d   mysql:8.0             "docker-entrypoint..."   Up 4 hours     0.0.0.0:3306->3306/tcp',
    '9e2d4a6f8b1c   buildpilot-frontend   "nginx -g daemon off"   Up 4 hours     0.0.0.0:5173->80/tcp',
  ],
  'docker logs backend': [
    '2026-10-11 22:45:01.120  INFO [main] com.buildpilot.BuildPilotApplication : Started in 2.81 seconds',
    '2026-10-11 22:45:15.890  INFO [http-nio-8080] c.b.s.AiService : Executed static analysis rule pipeline',
    '2026-10-11 22:46:30.405  INFO [http-nio-8080] c.b.s.CodeVerificationService : Syntax & test suite OK',
  ],
  'curl health': [
    'HTTP/1.1 200 OK',
    'Content-Type: application/json',
    '{ "status": "UP", "components": { "db": { "status": "UP" }, "diskSpace": { "status": "UP" } } }',
  ],
  'git status': [
    'On branch feature/buildpilot-ai-pro',
    'Your branch is up to date with \'origin/main\'.',
    'nothing to commit, working tree clean',
  ],
};

export default function TerminalSimulator() {
  const [history, setHistory] = useState(INITIAL_LOGS);
  const [cmd, setCmd] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const runCommand = (e) => {
    e.preventDefault();
    const trimmed = cmd.trim();
    if (!trimmed) return;

    if (trimmed === 'clear') {
      setHistory([]);
      setCmd('');
      return;
    }

    const output = COMMAND_MAP[trimmed] || [
      `bash: ${trimmed}: command not found. Type "help" for a list of commands.`,
    ];

    setHistory((prev) => [...prev, `$ ${trimmed}`, ...output, '']);
    setCmd('');
  };

  return (
    <div className="terminal-view">
      <header className="page-head row">
        <div>
          <h2>Container & Cloud Terminal Simulator</h2>
          <p className="muted">
            Execute sandboxed diagnostic CLI commands in an isolated execution container.
          </p>
        </div>
        <div className="actions">
          <button className="btn" onClick={() => setHistory(INITIAL_LOGS)}>
            Reset Session
          </button>
        </div>
      </header>

      <div
        className="glass"
        style={{
          background: '#04060e',
          border: '1px solid rgba(160,150,255,0.3)',
          borderRadius: '14px',
          padding: '1.2rem',
          fontFamily: 'monospace',
          fontSize: '0.85rem',
          minHeight: '440px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
        }}
      >
        <div style={{ flex: 1, overflowY: 'auto', marginBottom: '1rem' }}>
          {history.map((line, i) => (
            <div
              key={i}
              style={{
                lineHeight: '1.5',
                color: line.startsWith('$')
                  ? 'var(--cyan)'
                  : line.includes('SUCCESS') || line.includes('PASSED') || line.includes('UP')
                  ? 'var(--low)'
                  : line.includes('not found')
                  ? 'var(--crit)'
                  : '#cbd5e1',
              }}
            >
              {line}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <form onSubmit={runCommand} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: 'var(--low)', fontWeight: 600 }}>developer@sandbox:~$</span>
          <input
            type="text"
            value={cmd}
            onChange={(e) => setCmd(e.target.value)}
            placeholder="Type 'mvn test', 'docker ps', or 'curl health'..."
            autoFocus
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#fff',
              fontFamily: 'monospace',
              fontSize: '0.9rem',
            }}
          />
        </form>
      </div>
    </div>
  );
}
