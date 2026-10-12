// Organization: Orbytes Global Solutions, Owner: Kirthik, Created at: 2026-10-12
// Description: Interactive In-Browser Repository File Explorer and Code Editor

import { useState } from 'react';

const REPO_TREE = [
  {
    path: 'backend/src/main/java/com/buildpilot/BuildPilotApplication.java',
    name: 'BuildPilotApplication.java',
    type: 'java',
    content: `package com.buildpilot;\n\nimport org.springframework.boot.SpringApplication;\nimport org.springframework.boot.autoconfigure.SpringBootApplication;\n\n@SpringBootApplication\npublic class BuildPilotApplication {\n    public static void main(String[] args) {\n        SpringApplication.run(BuildPilotApplication.class, args);\n    }\n}`,
  },
  {
    path: 'backend/src/main/java/com/buildpilot/security/SecurityConfig.java',
    name: 'SecurityConfig.java',
    type: 'java',
    content: `package com.buildpilot.security;\n\nimport org.springframework.context.annotation.Bean;\nimport org.springframework.context.annotation.Configuration;\nimport org.springframework.security.config.annotation.web.builders.HttpSecurity;\nimport org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;\nimport org.springframework.security.web.SecurityFilterChain;\n\n@Configuration\npublic class SecurityConfig {\n    @Bean\n    public BCryptPasswordEncoder passwordEncoder() {\n        return new BCryptPasswordEncoder();\n    }\n}`,
  },
  {
    path: 'frontend/src/App.jsx',
    name: 'App.jsx',
    type: 'javascript',
    content: `import { useState } from 'react';\nimport Dashboard from './components/Dashboard.jsx';\n\nexport default function App() {\n  const [activeProject, setActiveProject] = useState(1);\n  return <Dashboard />;\n}`,
  },
  {
    path: 'backend/src/main/resources/schema.sql',
    name: 'schema.sql',
    type: 'sql',
    content: `CREATE TABLE IF NOT EXISTS projects (\n    id BIGINT PRIMARY KEY AUTO_INCREMENT,\n    name VARCHAR(255) NOT NULL,\n    description TEXT,\n    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);`,
  },
  {
    path: 'docker-compose.yml',
    name: 'docker-compose.yml',
    type: 'yaml',
    content: `version: '3.8'\nservices:\n  mysql:\n    image: mysql:8.0\n    ports:\n      - "3306:3306"\n  backend:\n    build: ./backend\n    ports:\n      - "8080:8080"`,
  },
];

export default function RepositoryExplorer({ onTriggerToast }) {
  const [selectedFile, setSelectedFile] = useState(REPO_TREE[0]);
  const [editorContent, setEditorContent] = useState(REPO_TREE[0].content);
  const [saved, setSaved] = useState(false);

  const saveFile = () => {
    setSaved(true);
    if (onTriggerToast) onTriggerToast(`Saved changes to ${selectedFile.name}!`, 'success');
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="repo-explorer-view">
      <header className="page-head row">
        <div>
          <h2>Project File Explorer & Code Editor</h2>
          <p className="muted">
            Inspect repository file tree, edit Java, React, SQL, and Docker files in-browser.
          </p>
        </div>
        <div className="actions">
          <button className="btn primary" onClick={saveFile}>
            {saved ? '✓ Changes Saved' : '💾 Save File'}
          </button>
        </div>
      </header>

      <div className="grid" style={{ gridTemplateColumns: '280px 1fr', gap: '1.2rem' }}>
        {/* File Tree Explorer */}
        <section className="glass">
          <h3>Repository Tree</h3>
          <p className="muted" style={{ fontSize: '0.8rem' }}>Workspace: BuildPilot-AI-Pro</p>

          <div style={{ display: 'grid', gap: '0.4rem', marginTop: '0.8rem' }}>
            {REPO_TREE.map((f) => (
              <div
                key={f.path}
                onClick={() => {
                  setSelectedFile(f);
                  setEditorContent(f.content);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '0.6rem 0.8rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  background: selectedFile.path === f.path ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.03)',
                  border: '1px solid ' + (selectedFile.path === f.path ? 'var(--indigo)' : 'var(--line)'),
                  fontSize: '0.82rem',
                }}
              >
                <span>{f.type === 'java' ? '☕' : f.type === 'sql' ? '🗄️' : f.type === 'yaml' ? '🐳' : '⚛️'}</span>
                <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {f.name}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* In-Browser Code Editor */}
        <section className="glass" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
            <code style={{ fontSize: '0.85rem' }}>{selectedFile.path}</code>
            <span className="chip on" style={{ fontSize: '0.72rem' }}>Syntax: {selectedFile.type.toUpperCase()}</span>
          </div>

          <textarea
            rows={18}
            value={editorContent}
            onChange={(e) => setEditorContent(e.target.value)}
            style={{
              width: '100%',
              background: '#060818',
              color: '#e2e8f0',
              border: '1px solid var(--line)',
              borderRadius: '8px',
              padding: '1rem',
              fontFamily: 'monospace',
              fontSize: '0.85rem',
              lineHeight: '1.6',
              resize: 'vertical',
            }}
          />
        </section>
      </div>
    </div>
  );
}
