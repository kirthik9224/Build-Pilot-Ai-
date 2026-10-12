// Organization: Orbytes Global Solutions, Owner: Kirthik, Created at: 2026-10-11
// Description: Interactive Code Review workspace with static analysis & patch proposals

import { useState, useEffect } from 'react';
import { api } from '../api.js';
import DiffViewer from './DiffViewer.jsx';

const SAMPLES = {
  java: {
    name: 'OrderRepository.java (SQL Injection)',
    lang: 'java',
    code: `public class OrderRepository {\n  public List<Order> findOrders(String customerId) {\n    String query = "SELECT * FROM orders WHERE cust_id = '" + customerId + "'";\n    return jdbcTemplate.query(query, new OrderRowMapper());\n  }\n}`,
  },
  react: {
    name: 'CartService.js (Unawaited Fetch)',
    lang: 'javascript',
    code: `export function checkout(cartId) {\n  fetch('/api/cart/' + cartId + '/checkout', {\n    method: 'POST'\n  });\n  console.log('Checkout requested');\n}`,
  },
  security: {
    name: 'AuthConfig.java (Hardcoded Secret)',
    lang: 'java',
    code: `public class AuthConfig {\n  private static final String secret = "superSecretKey123456789";\n  public String getKey() { return secret; }\n}`,
  },
};

export default function CodeReviewCenter({ projectId }) {
  const [code, setCode] = useState(SAMPLES.java.code);
  const [lang, setLang] = useState('java');
  const [title, setTitle] = useState(SAMPLES.java.name);
  const [loading, setLoading] = useState(false);
  const [currentReview, setCurrentReview] = useState(null);
  const [history, setHistory] = useState([]);
  const [statusMsg, setStatusMsg] = useState('');

  const loadHistory = async () => {
    try {
      const res = await api.listReviews(projectId);
      setHistory(res);
    } catch (e) {
      // Keep empty history on error
    }
  };

  useEffect(() => { loadHistory(); }, [projectId]);

  const runReview = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setStatusMsg('');
    try {
      const res = await api.submitReview({
        projectId: projectId || 1,
        title,
        language: lang,
        filePath: title,
        sourceCode: code,
      });
      setCurrentReview(res);
      setStatusMsg('Review completed successfully.');
      loadHistory();
    } catch (err) {
      setStatusMsg('Failed to run review: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateFindingStatus = async (findingId, newStatus) => {
    try {
      await api.updateFinding(findingId, { status: newStatus });
      if (currentReview) {
        setCurrentReview({
          ...currentReview,
          findings: currentReview.findings.map((f) =>
            f.id === findingId ? { ...f, status: newStatus } : f
          ),
        });
      }
    } catch (err) {
      alert('Could not update finding: ' + err.message);
    }
  };

  const selectSample = (key) => {
    const s = SAMPLES[key];
    setCode(s.code);
    setLang(s.lang);
    setTitle(s.name);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      setCode(evt.target.result);
      setTitle(file.name);
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (['java', 'class'].includes(ext)) setLang('java');
      else if (['js', 'jsx', 'ts', 'tsx'].includes(ext)) setLang('javascript');
      else if (['css', 'scss'].includes(ext)) setLang('css');
      else if (['sql'].includes(ext)) setLang('sql');
      else setLang('plaintext');
    };
    reader.readAsText(file);
  };

  const handleFolderUpload = (e) => {
    const files = Array.from(e.target.files || []);
    const valid = files.filter((f) =>
      /\.(java|js|jsx|ts|tsx|css|sql|html|properties|json)$/i.test(f.name)
    );
    if (valid.length > 0) {
      const f = valid[0];
      const reader = new FileReader();
      reader.onload = (evt) => {
        setCode(evt.target.result);
        setTitle(f.webkitRelativePath || f.name);
      };
      reader.readAsText(f);
      setStatusMsg(`Loaded ${valid.length} files from folder. Currently viewing ${f.name}`);
    }
  };

  return (
    <div className="review-workspace">
      <header className="page-head row">
        <div>
          <h2>AI Code Review Center</h2>
          <p className="muted">
            Analyze code for security flaws, code smells, bugs, and maintainability.
          </p>
        </div>
        <div className="actions" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <label className="btn primary" style={{ cursor: 'pointer', margin: 0 }}>
            Upload File
            <input type="file" onChange={handleFileUpload} style={{ display: 'none' }} />
          </label>
          <label className="btn" style={{ cursor: 'pointer', margin: 0 }}>
            Upload Folder
            <input
              type="file"
              webkitdirectory="true"
              directory="true"
              multiple
              onChange={handleFolderUpload}
              style={{ display: 'none' }}
            />
          </label>
          <button className="btn" onClick={() => selectSample('java')}>Load SQL Sample</button>
          <button className="btn" onClick={() => selectSample('react')}>Load JS Sample</button>
          <button className="btn" onClick={() => selectSample('security')}>Load Secret Sample</button>
        </div>
      </header>

      <section className="glass">
        <div className="field">
          <label>File / Review Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="field">
          <label>Source Code</label>
          <textarea
            rows={8}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            style={{
              width: '100%',
              background: 'rgba(0,0,0,0.4)',
              color: 'var(--text)',
              border: '1px solid var(--line)',
              borderRadius: '8px',
              padding: '0.8rem',
              fontFamily: 'monospace',
            }}
          />
        </div>
        <button className="btn primary" disabled={loading} onClick={runReview}>
          {loading ? 'Analyzing Code…' : 'Start Code Review'}
        </button>
        {statusMsg && <span style={{ marginLeft: '1rem', color: 'var(--cyan)' }}>{statusMsg}</span>}
      </section>

      {currentReview && (
        <section className="glass">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.6rem' }}>
            <div>
              <h3 style={{ margin: 0 }}>Review Summary: {currentReview.title}</h3>
              <p className="muted" style={{ margin: '0.2rem 0 0' }}>{currentReview.summary}</p>
            </div>
            <button
              className="btn"
              onClick={() => {
                const reportContent = `# BuildPilot AI Code Review Audit Report\n\n**File:** ${currentReview.title}\n**Project ID:** ${projectId || 1}\n**Status:** ${currentReview.status}\n**Findings:** ${currentReview.findings?.length || 0}\n\n## Findings\n${(currentReview.findings || []).map(f => `### [${f.severity}] ${f.category} (Line ${f.lineStart})\n- **Explanation:** ${f.explanation}\n- **Correction:** ${f.suggestedCorrection}\n- **Diff:**\n\`\`\`\n${f.proposedDiff || 'N/A'}\n\`\`\`\n`).join('\n')}\n\n---\n*Generated by BuildPilot AI Pro (Orbytes Global Solutions)*`;
                const blob = new Blob([reportContent], { type: 'text/markdown' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `review-audit-${currentReview.id || Date.now()}.md`;
                a.click();
              }}
            >
              📥 Export Audit Report (Markdown)
            </button>
          </div>
          <div className="chips" style={{ marginTop: '0.8rem' }}>
            <span className="chip on">Total Findings: {currentReview.findings?.length || 0}</span>
            <span className="chip">Status: {currentReview.status}</span>
          </div>

          <div className="findings-list">
            {(!currentReview.findings || currentReview.findings.length === 0) && (
              <p className="ok">No issues detected in this code snippet.</p>
            )}
            {currentReview.findings?.map((f) => (
              <article key={f.id} className="glass issue" style={{ marginTop: '0.8rem' }}>
                <div className="issue-top">
                  <span className={`sev ${f.severity.toLowerCase()}`}>{f.severity}</span>
                  <span className="chip">{f.category}</span>
                  <span className="chip on">{f.source}</span>
                  <code>{f.filePath} : Line {f.lineStart}</code>
                </div>
                <p><b>Explanation:</b> {f.explanation}</p>
                {f.suggestedCorrection && (
                  <p className="muted"><b>Suggested Correction:</b> {f.suggestedCorrection}</p>
                )}
                {f.proposedDiff && (
                  <DiffViewer diffText={f.proposedDiff} filePath={f.filePath} />
                )}
                <div className="actions" style={{ marginTop: '0.6rem' }}>
                  <button
                    className={`btn ${f.status === 'ACCEPTED' ? 'primary' : ''}`}
                    onClick={() => updateFindingStatus(f.id, 'ACCEPTED')}
                  >
                    Accept Fix
                  </button>
                  <button
                    className={`btn ${f.status === 'REJECTED' ? 'warn' : ''}`}
                    onClick={() => updateFindingStatus(f.id, 'REJECTED')}
                  >
                    Reject
                  </button>
                  <span className="muted" style={{ alignSelf: 'center', marginLeft: 'auto' }}>
                    Status: <b>{f.status}</b>
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {history.length > 0 && (
        <section className="glass">
          <h3>Previous Code Reviews ({history.length})</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {history.map((h) => (
              <li
                key={h.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '0.5rem 0',
                  borderBottom: '1px solid var(--line)',
                  cursor: 'pointer',
                }}
                onClick={() => setCurrentReview(h)}
              >
                <span><b>{h.title}</b> ({h.language})</span>
                <span className="muted">{h.findings?.length || 0} findings · {h.status}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
