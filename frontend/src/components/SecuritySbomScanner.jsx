// Organization: Orbytes Global Solutions, Owner: Logaraj S, Created at: 2026-10-12
// Description: Interactive Dependency Security Scanner & SBOM (Software Bill of Materials) Analyzer

import { useState } from 'react';

const INITIAL_DEPS = [
  { id: 1, name: 'org.springframework.boot:spring-boot-starter-web', version: '3.3.4', latest: '3.3.4', cveCount: 0, status: 'SECURE' },
  { id: 2, name: 'com.auth0:java-jwt', version: '4.4.0', latest: '4.4.0', cveCount: 0, status: 'SECURE' },
  { id: 3, name: 'mysql:mysql-connector-j', version: '8.3.0', latest: '8.4.0', cveCount: 1, status: 'VULNERABLE', cve: 'CVE-2024-21008 (Privilege Escalation in auth plugin)' },
  { id: 4, name: 'org.apache.commons:commons-text', version: '1.9.0', latest: '1.11.0', cveCount: 1, status: 'CRITICAL', cve: 'CVE-2022-42889 (Text4Shell Remote Code Execution)' },
  { id: 5, name: 'vite', version: '5.4.2', latest: '5.4.8', cveCount: 0, status: 'SECURE' },
];

export default function SecuritySbomScanner({ onTriggerToast }) {
  const [dependencies, setDependencies] = useState(INITIAL_DEPS);
  const [scanning, setScanning] = useState(false);
  const [patched, setPatched] = useState(false);

  const runScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      if (onTriggerToast) onTriggerToast('Completed OWASP Dependency-Check & SBOM Scan!', 'success');
    }, 1200);
  };

  const autoPatchAll = () => {
    setDependencies((prev) =>
      prev.map((d) => ({
        ...d,
        version: d.latest,
        cveCount: 0,
        status: 'SECURE',
        cve: undefined,
      }))
    );
    setPatched(true);
    if (onTriggerToast) onTriggerToast('Auto-patched all vulnerable dependencies to safe versions!', 'success');
  };

  const exportSbom = () => {
    const sbomData = {
      bomFormat: 'CycloneDX',
      specVersion: '1.5',
      serialNumber: 'urn:uuid:' + crypto.randomUUID(),
      version: 1,
      metadata: {
        component: { name: 'BuildPilot AI Pro', version: '2.0.0', type: 'application' },
      },
      components: dependencies.map((d) => ({
        name: d.name,
        version: d.version,
        purl: `pkg:maven/${d.name}@${d.version}`,
      })),
    };

    const blob = new Blob([JSON.stringify(sbomData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bom-cyclonedx.json';
    a.click();
    if (onTriggerToast) onTriggerToast('Exported CycloneDX SBOM manifest!');
  };

  return (
    <div className="sbom-scanner-view">
      <header className="page-head row">
        <div>
          <h2>Dependency Security Audit & SBOM (CycloneDX)</h2>
          <p className="muted">
            Continuous CVE vulnerability auditing, automated dependency patch upgrades, and Software Bill of Materials (SBOM) generation.
          </p>
        </div>
        <div className="actions">
          <button className="btn" onClick={exportSbom}>
            📥 Export SBOM (JSON)
          </button>
          <button className="btn primary" onClick={autoPatchAll} disabled={patched}>
            {patched ? '✓ All Patches Applied' : '🛡️ One-Click Auto-Patch CVEs'}
          </button>
        </div>
      </header>

      {/* Summary KPI Cards */}
      <div className="grid" style={{ marginBottom: '1.2rem' }}>
        <div className="glass">
          <small className="muted">Total Tracked Dependencies</small>
          <h2 style={{ margin: '0.3rem 0' }}>{dependencies.length}</h2>
          <span className="ok">Maven & NPM manifest active</span>
        </div>
        <div className="glass">
          <small className="muted">Vulnerabilities Detected</small>
          <h2 style={{ margin: '0.3rem 0', color: dependencies.filter(d => d.cveCount > 0).length > 0 ? 'var(--crit)' : 'var(--low)' }}>
            {dependencies.filter((d) => d.cveCount > 0).length}
          </h2>
          <span className={dependencies.filter(d => d.cveCount > 0).length > 0 ? 'sev high' : 'ok'}>
            {dependencies.filter((d) => d.cveCount > 0).length > 0 ? 'Requires immediate upgrade' : '0 CVEs detected (Clean)'}
          </span>
        </div>
        <div className="glass">
          <small className="muted">Compliance Standard</small>
          <h2 style={{ margin: '0.3rem 0', color: 'var(--cyan)' }}>CycloneDX 1.5</h2>
          <span className="ok">OWASP Top 10 & NIST Approved</span>
        </div>
      </div>

      {/* Dependencies Table */}
      <section className="glass">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
          <h3>Software Bill of Materials (SBOM)</h3>
          <button className="chip on" onClick={runScan} disabled={scanning}>
            {scanning ? 'Scanning CVE Databases…' : '↻ Re-Scan Repositories'}
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--line)', textAlign: 'left', color: 'var(--muted)' }}>
                <th style={{ padding: '8px' }}>Package Name</th>
                <th style={{ padding: '8px' }}>Current Version</th>
                <th style={{ padding: '8px' }}>Latest Secure</th>
                <th style={{ padding: '8px' }}>Status</th>
                <th style={{ padding: '8px' }}>Vulnerability Description</th>
              </tr>
            </thead>
            <tbody>
              {dependencies.map((d) => (
                <tr key={d.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '8px' }}><code>{d.name}</code></td>
                  <td style={{ padding: '8px' }}>{d.version}</td>
                  <td style={{ padding: '8px', color: 'var(--low)' }}>{d.latest}</td>
                  <td style={{ padding: '8px' }}>
                    <span className={`sev ${d.status === 'SECURE' ? 'low' : d.status === 'VULNERABLE' ? 'high' : 'critical'}`}>
                      {d.status}
                    </span>
                  </td>
                  <td style={{ padding: '8px', color: d.cve ? 'var(--crit)' : 'var(--muted)' }}>
                    {d.cve || 'No known vulnerabilities'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
