import { useEffect, useState } from 'react';
import { api } from '../api.js';

const DEFAULTS = {
  sensitivity: '3', alertLevel: 'HIGH', ruleWcag: 'true', ruleSecurity: 'true', ruleResponsive: 'true',
  ruleStyle: 'false', aiModel: 'balanced', tabSize: '2', autoFix: 'false', emailDigest: 'true', apiToken: '',
};
const SENSITIVITY = ['', 'Relaxed: clear failures only', 'Light', 'Balanced', 'Strict', 'Pixel perfect: report everything'];

export default function Settings({ user }) {
  const [v, setV] = useState(DEFAULTS);
  const [status, setStatus] = useState('');
  const [showToken, setShowToken] = useState(false);

  useEffect(() => { api.settings().then((s) => setV({ ...DEFAULTS, ...s })).catch(() => setStatus('Could not load settings.')); }, []);

  const set = (k) => (e) => { setV({ ...v, [k]: e.target.type === 'checkbox' ? String(e.target.checked) : e.target.value }); setStatus(''); };
  const save = async () => {
    try { setV({ ...DEFAULTS, ...(await api.saveSettings(v)) }); setStatus('Settings saved.'); }
    catch { setStatus('Could not save. Check the server and try again.'); }
  };
  const Toggle = ({ k, label, hint }) => (
    <label className="toggle"><input type="checkbox" checked={v[k] === 'true'} onChange={set(k)} /><span><b>{label}</b><small>{hint}</small></span></label>
  );

  return (
    <>
      <header className="page-head row">
        <div><h2>Settings</h2><p className="muted">Changes apply after you press Save settings.</p></div>
        <div><button className="btn primary" onClick={save}>Save settings</button> <span role="status" className="ok">{status}</span></div>
      </header>

      <section className="glass">
        <h3>Account</h3>
        <dl><dt>Name</dt><dd>{user.name}</dd><dt>Email</dt><dd>{user.email}</dd><dt>Role</dt><dd>{user.role}</dd></dl>
      </section>

      <section className="glass">
        <h3>Monitoring</h3>
        <label className="field">Sensitivity: <b>{SENSITIVITY[v.sensitivity]}</b>
          <input type="range" min="1" max="5" value={v.sensitivity} onChange={set('sensitivity')} />
        </label>
        <label className="field">Alert me for
          <select value={v.alertLevel} onChange={set('alertLevel')}>
            <option value="CRITICAL">Critical issues only</option><option value="HIGH">High and critical</option><option value="ALL">All issues</option>
          </select>
        </label>
        <Toggle k="autoFix" label="Suggest fixes automatically" hint="Show a repair suggestion as soon as an issue is found." />
      </section>

      <section className="glass">
        <h3>Rule sets</h3>
        <Toggle k="ruleWcag" label="Accessibility (WCAG 2.1 AA)" hint="Contrast, alt text, labels and keyboard access." />
        <Toggle k="ruleSecurity" label="Security" hint="Injection, secrets in code and unsafe requests." />
        <Toggle k="ruleResponsive" label="Responsive layout" hint="Overflow and breakpoints on phone and tablet sizes." />
        <Toggle k="ruleStyle" label="Style consistency" hint="Spacing scale and repeated values in CSS." />
      </section>

      <section className="glass">
        <h3>AI and integrations</h3>
        <label className="field">AI model preset
          <select value={v.aiModel} onChange={set('aiModel')}>
            <option value="fast">Fast: quick checks while you type</option><option value="balanced">Balanced: default</option><option value="deep">Deep: slower, most thorough</option>
          </select>
        </label>
        <label className="field">API token
          <span className="inline"><input type={showToken ? 'text' : 'password'} value={v.apiToken} onChange={set('apiToken')} />
            <button type="button" className="btn" onClick={() => setShowToken(!showToken)}>{showToken ? 'Hide' : 'Show'}</button></span>
        </label>
      </section>

      <section className="glass">
        <h3>Developer preferences</h3>
        <label className="field">Editor tab size
          <select value={v.tabSize} onChange={set('tabSize')}><option value="2">2 spaces</option><option value="4">4 spaces</option></select>
        </label>
        <Toggle k="emailDigest" label="Weekly email summary" hint="One email on Monday with open issues and progress." />
      </section>
    </>
  );
}
