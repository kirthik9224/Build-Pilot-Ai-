// Organization: Orbytes Global Solutions, Owner: Logaraj S, Created at: 2026-10-11
// Description: AI Debugging and Error-to-Fix Studio with automated test verification

import { useState, useEffect } from 'react';
import { api } from '../api.js';

const SAMPLE_ERRORS = {
  npe: {
    title: 'NullPointerException in OrderService',
    type: 'Java Exception',
    file: 'OrderService.java',
    trace: `java.lang.NullPointerException: Cannot invoke "Customer.getEmail()" because "cust" is null\n\tat com.shop.OrderService.sendConfirmation(OrderService.java:42)\n\tat com.shop.OrderService.processOrder(OrderService.java:28)`,
    context: `Customer cust = customerRepo.findById(id).orElse(null);\nString email = cust.getEmail();`,
  },
  sql: {
    title: 'BadSqlGrammarException in OrderRepository',
    type: 'Spring Boot Stacktrace',
    file: 'OrderRepository.java',
    trace: `org.springframework.jdbc.BadSqlGrammarException: StatementCallback; bad SQL grammar [SELECT * FROM orders WHERE user_id = 99']; nested exception is java.sql.SQLException: syntax error near '99''`,
    context: `String q = "SELECT * FROM orders WHERE user_id = " + userId + "'";\njdbcTemplate.query(q);`,
  },
  frontend: {
    title: 'TypeError: Cannot read properties of undefined',
    type: 'Frontend Console Error',
    file: 'ProductList.jsx',
    trace: `TypeError: Cannot read properties of undefined (reading 'map')\n    at ProductList (ProductList.jsx:14)\n    at renderWithHooks (react-dom.development.js:16305)`,
    context: `export default function ProductList({ data }) {\n  return <div>{data.items.map(i => <Item key={i.id} {...i} />)}</div>;\n}`,
  },
};

export default function DebuggingStudio({ projectId }) {
  const [title, setTitle] = useState(SAMPLE_ERRORS.npe.title);
  const [errorType, setErrorType] = useState(SAMPLE_ERRORS.npe.type);
  const [targetFile, setTargetFile] = useState(SAMPLE_ERRORS.npe.file);
  const [stackTrace, setStackTrace] = useState(SAMPLE_ERRORS.npe.trace);
  const [contextCode, setContextCode] = useState(SAMPLE_ERRORS.npe.context);
  const [busy, setBusy] = useState(false);
  const [verifyingId, setVerifyingId] = useState(null);
  const [currentSession, setCurrentSession] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [banner, setBanner] = useState('');

  const loadSessions = async () => {
    try {
      const res = await api.listDebuggingSessions(projectId);
      setSessions(res);
    } catch (e) {
      // Keep empty sessions
    }
  };

  useEffect(() => { loadSessions(); }, [projectId]);

  const diagnose = async () => {
    if (!stackTrace.trim()) return;
    setBusy(true);
    setBanner('');
    try {
      const s = await api.diagnoseError({
        projectId: projectId || 1,
        title,
        errorType,
        targetFile,
        stackTrace,
        contextCode,
      });
      setCurrentSession(s);
      loadSessions();
    } catch (err) {
      setBanner('Failed to analyze error: ' + err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleVerify = async (fixId, originalCode, proposedCode, file) => {
    setVerifyingId(fixId);
    try {
      const verifiedFix = await api.verifyFix(fixId, {
        targetFile: file,
        originalCode,
        proposedCode,
      });
      if (currentSession) {
        setCurrentSession({
          ...currentSession,
          fixes: currentSession.fixes.map((f) => (f.id === fixId ? verifiedFix : f)),
        });
      }
      loadSessions();
    } catch (err) {
      alert('Verification execution failed: ' + err.message);
    } finally {
      setVerifyingId(null);
    }
  };

  const loadSample = (key) => {
    const s = SAMPLE_ERRORS[key];
    setTitle(s.title);
    setErrorType(s.type);
    setTargetFile(s.file);
    setStackTrace(s.trace);
    setContextCode(s.context);
  };

  const handleLogUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      setStackTrace(evt.target.result);
      setTitle('Diagnostics: ' + file.name);
    };
    reader.readAsText(file);
  };

  return (
    <div className="debugging-studio">
      <header className="page-head row">
        <div>
          <h2>AI Debugging & Error-to-Fix Studio</h2>
          <p className="muted">
            Analyze stack traces, generate step-by-step fixes, and verify code via automated tests.
          </p>
        </div>
        <div className="actions" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <label className="btn primary" style={{ cursor: 'pointer', margin: 0 }}>
            Upload Log / Trace
            <input type="file" onChange={handleLogUpload} style={{ display: 'none' }} />
          </label>
          <button className="btn" onClick={() => loadSample('npe')}>Load NPE</button>
          <button className="btn" onClick={() => loadSample('sql')}>Load SQL Error</button>
          <button className="btn" onClick={() => loadSample('frontend')}>Load React Error</button>
        </div>
      </header>

      {banner && <div className="banner" role="alert">{banner}</div>}

      <section className="glass">
        <div className="grid">
          <label>
            Issue Title
            <input value={title} onChange={(e) => setTitle(e.target.value)} />
          </label>
          <label>
            Error Category
            <input value={errorType} onChange={(e) => setErrorType(e.target.value)} />
          </label>
          <label>
            Target File
            <input value={targetFile} onChange={(e) => setTargetFile(e.target.value)} />
          </label>
        </div>

        <div className="field" style={{ marginTop: '0.8rem' }}>
          <label>Stack Trace / Error Log</label>
          <textarea
            rows={5}
            value={stackTrace}
            onChange={(e) => setStackTrace(e.target.value)}
            style={{
              width: '100%',
              background: 'rgba(0,0,0,0.4)',
              color: 'var(--crit)',
              border: '1px solid var(--line)',
              borderRadius: '8px',
              padding: '0.8rem',
              fontFamily: 'monospace',
            }}
          />
        </div>

        <div className="field">
          <label>Relevant Code Context (Optional)</label>
          <textarea
            rows={3}
            value={contextCode}
            onChange={(e) => setContextCode(e.target.value)}
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

        <button className="btn primary" disabled={busy} onClick={diagnose}>
          {busy ? 'Diagnosing Root Cause…' : 'Analyze & Generate Fix'}
        </button>
      </section>

      {currentSession && (
        <section className="glass">
          <h3>Root Cause Diagnosis</h3>
          <p><b>Identified Cause:</b> {currentSession.rootCause}</p>
          <div style={{ whiteSpace: 'pre-line', margin: '0.8rem 0' }}>
            <b>Recommended Fix Steps:</b>
            <p className="muted">{currentSession.stepsToFix}</p>
          </div>

          <h4>Proposed Code Modifications</h4>
          {currentSession.fixes?.map((f) => (
            <article key={f.id} className="glass" style={{ background: 'rgba(0,0,0,0.3)' }}>
              <div className="issue-top">
                <b>{f.description}</b>
                <code>{f.targetFile}</code>
                {f.verified && (
                  <span className={`sev ${f.verificationPassed ? 'low' : 'critical'}`}>
                    {f.verificationPassed ? 'VERIFIED PASS' : 'VERIFICATION FAILED'}
                  </span>
                )}
              </div>

              <pre style={{
                background: 'rgba(0,0,0,0.6)',
                padding: '0.8rem',
                borderRadius: '8px',
                color: 'var(--cyan)',
              }}>
                {f.diffPatch || f.fixedSnippet}
              </pre>

              {f.testOutput && (
                <div style={{
                  padding: '0.6rem',
                  background: 'rgba(0,0,0,0.4)',
                  borderRadius: '6px',
                  marginBottom: '0.8rem',
                }}>
                  <small className="muted">Test Execution Result:</small>
                  <pre style={{ margin: 0, color: f.verificationPassed ? 'var(--low)' : 'var(--crit)' }}>
                    {f.testOutput}
                  </pre>
                </div>
              )}

              <button
                className="btn primary"
                disabled={verifyingId === f.id}
                onClick={() => handleVerify(f.id, f.originalSnippet, f.fixedSnippet, f.targetFile)}
              >
                {verifyingId === f.id ? 'Running Automated Tests…' : 'Run Verification Tests'}
              </button>
            </article>
          ))}
        </section>
      )}

      {sessions.length > 0 && (
        <section className="glass">
          <h3>Debugging History ({sessions.length})</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {sessions.map((s) => (
              <li
                key={s.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '0.5rem 0',
                  borderBottom: '1px solid var(--line)',
                  cursor: 'pointer',
                }}
                onClick={() => setCurrentSession(s)}
              >
                <span><b>{s.title}</b> ({s.errorType})</span>
                <span className={`sev ${s.status === 'VERIFIED' ? 'low' : 'high'}`}>{s.status}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
