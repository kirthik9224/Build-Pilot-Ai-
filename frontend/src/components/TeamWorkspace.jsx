// Organization: Orbytes Global Solutions, Owner: Logaraj S, Created at: 2026-10-11
// Description: Team workspace with role permissions, members roster, and live activity feed

import { useState } from 'react';

const TEAM_MEMBERS = [
  { id: 1, name: 'Logaraj S', email: 'logaraj@orbytes.com', role: 'LEAD', status: 'Active', prCount: 14, avatar: 'LS' },
  { id: 2, name: 'Kirthik', email: 'demo@buildpilot.dev', role: 'LEAD', status: 'Active', prCount: 22, avatar: 'K' },
  { id: 3, name: 'Alex Rivera', email: 'alex@buildpilot.dev', role: 'DEVELOPER', status: 'Active', prCount: 18, avatar: 'AR' },
  { id: 4, name: 'Sarah Chen', email: 'sarah@buildpilot.dev', role: 'QA', status: 'In Review', prCount: 9, avatar: 'SC' },
  { id: 5, name: 'Marcus Brody', email: 'marcus@buildpilot.dev', role: 'DEVOPS', status: 'Active', prCount: 31, avatar: 'MB' },
];

const ACTIVITY_FEED = [
  { id: 101, actor: 'Kirthik', action: 'Approved verified fix for SQL Injection in auth pipeline', time: '12m ago', tag: 'SECURITY' },
  { id: 102, actor: 'Alex Rivera', action: 'Submitted Code Review for PaymentGateway.java', time: '45m ago', tag: 'REVIEW' },
  { id: 103, actor: 'Marcus Brody', action: 'Resolved latency alert on microservice Health Gateway', time: '2h ago', tag: 'DEVOPS' },
  { id: 104, actor: 'Sarah Chen', action: 'Automated test suite verification confirmed 98.6% pass', time: '3h ago', tag: 'QA' },
];

export default function TeamWorkspace({ user }) {
  const currentMember = user ? [{
    id: user.id || 1,
    name: user.name || 'Current User',
    email: user.email || 'developer@buildpilot.dev',
    role: user.role || 'LEAD',
    status: 'Active (You)',
    prCount: 14,
    avatar: (user.name || 'U').substring(0, 2).toUpperCase(),
  }] : [];

  const [members, setMembers] = useState(() => [
    ...currentMember,
    { id: 99, name: 'Logaraj S', email: 'logaraj@orbytes.com', role: 'LEAD', status: 'Active', prCount: 28, avatar: 'LS' },
    { id: 100, name: 'Alex Rivera', email: 'alex@buildpilot.dev', role: 'DEVELOPER', status: 'Active', prCount: 18, avatar: 'AR' },
    { id: 101, name: 'Sarah Chen', email: 'sarah@buildpilot.dev', role: 'QA', status: 'Active', prCount: 9, avatar: 'SC' },
    { id: 102, name: 'Marcus Brody', email: 'marcus@buildpilot.dev', role: 'DEVOPS', status: 'Active', prCount: 31, avatar: 'MB' },
  ]);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('DEVELOPER');
  const [inviteSuccess, setInviteSuccess] = useState('');

  const inviteMember = (e) => {
    e.preventDefault();
    if (!newMemberEmail.trim()) return;

    const newObj = {
      id: Date.now(),
      name: newMemberEmail.split('@')[0],
      email: newMemberEmail.trim(),
      role: newMemberRole,
      status: 'Invited',
      prCount: 0,
      avatar: newMemberEmail.substring(0, 2).toUpperCase(),
    };

    setMembers((prev) => [newObj, ...prev]);
    setInviteSuccess(`Invitation sent to ${newMemberEmail}`);
    setNewMemberEmail('');
    setTimeout(() => setInviteSuccess(''), 4000);
  };

  return (
    <div className="team-workspace">
      <header className="page-head row">
        <div>
          <h2>Team Workspace & Role-Based Access</h2>
          <p className="muted">
            Manage engineering contributors, access roles (LEAD, DEVELOPER, QA, DEVOPS), and audit activities.
          </p>
        </div>
      </header>

      {inviteSuccess && (
        <div className="banner ok" style={{ borderColor: 'var(--low)', background: 'rgba(74,222,128,0.1)' }}>
          ✓ {inviteSuccess}
        </div>
      )}

      <div className="grid" style={{ gridTemplateColumns: '1fr 340px', gap: '1.2rem' }}>
        {/* Members Roster */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <section className="glass">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3>Project Contributors ({members.length})</h3>
              <span className="chip on">Active Tenant: Orbytes Global Solutions</span>
            </div>

            <div style={{ display: 'grid', gap: '0.8rem' }}>
              {members.map((m) => (
                <div
                  key={m.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.8rem 1rem',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--line)',
                    borderRadius: '12px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
                    <div className="avatar" style={{ fontSize: '0.85rem' }}>{m.avatar}</div>
                    <div>
                      <b style={{ display: 'block' }}>{m.name}</b>
                      <small className="muted">{m.email}</small>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span className={`sev ${m.role === 'LEAD' ? 'high' : 'low'}`} style={{ fontSize: '0.75rem' }}>
                      {m.role}
                    </span>
                    <small className="muted">{m.prCount} reviews</small>
                    <span className="ok" style={{ fontSize: '0.8rem' }}>● {m.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Audit Activity Stream */}
          <section className="glass">
            <h3>Team Activity Stream</h3>
            <p className="muted">Real-time actions across reviews, debugs, and deployments</p>

            <div style={{ display: 'grid', gap: '0.8rem', marginTop: '1rem' }}>
              {ACTIVITY_FEED.map((a) => (
                <div
                  key={a.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.6rem 0.8rem',
                    borderLeft: '3px solid var(--indigo)',
                    background: 'rgba(0,0,0,0.2)',
                    borderRadius: '0 8px 8px 0',
                  }}
                >
                  <div>
                    <span style={{ fontWeight: 600 }}>{a.actor}</span>: {a.action}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span className="chip" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>{a.tag}</span>
                    <small className="muted">{a.time}</small>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Invite & Permission Matrix */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <section className="glass">
            <h3>Invite Teammate</h3>
            <p className="muted">Add developer to this project</p>

            <form onSubmit={inviteMember} style={{ display: 'grid', gap: '0.8rem', marginTop: '0.8rem' }}>
              <label style={{ display: 'grid', gap: '0.3rem' }}>
                <span className="muted">Teammate Email:</span>
                <input
                  type="email"
                  placeholder="dev@company.com"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  required
                />
              </label>

              <label style={{ display: 'grid', gap: '0.3rem' }}>
                <span className="muted">Role Permission:</span>
                <select value={newMemberRole} onChange={(e) => setNewMemberRole(e.target.value)}>
                  <option value="DEVELOPER">DEVELOPER (Write, Review, Debug)</option>
                  <option value="LEAD">LEAD (Admin, Deploy, Approve)</option>
                  <option value="QA">QA (Run Tests, Verify Fixes)</option>
                  <option value="DEVOPS">DEVOPS (Monitor, Manage Alerts)</option>
                </select>
              </label>

              <button className="btn primary" type="submit" style={{ marginTop: '0.4rem' }}>
                Send Project Invite
              </button>
            </form>
          </section>

          <section className="glass">
            <h3>RBAC Permissions Matrix</h3>
            <div style={{ fontSize: '0.8rem', display: 'grid', gap: '0.5rem', marginTop: '0.8rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--line)', paddingBottom: '4px' }}>
                <span>Code Review & Diff Approval:</span>
                <b className="ok">LEAD, DEV</b>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--line)', paddingBottom: '4px' }}>
                <span>Execute Test Verification:</span>
                <b className="ok">ALL ROLES</b>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--line)', paddingBottom: '4px' }}>
                <span>Resolve Production Alerts:</span>
                <b className="ok">LEAD, DEVOPS</b>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Project Configuration:</span>
                <b className="ok">LEAD ONLY</b>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
