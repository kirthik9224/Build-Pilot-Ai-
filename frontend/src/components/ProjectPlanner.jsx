// Organization: Orbytes Global Solutions, Owner: Kirthik, Created at: 2026-10-11
// Description: Intelligent Project Planner with task dependencies, milestones & risk forecast

import { useState, useEffect } from 'react';
import { api } from '../api.js';

const STATUSES = ['TODO', 'IN_PROGRESS', 'BLOCKED', 'COMPLETED'];

export default function ProjectPlanner({ projectId }) {
  const [tasks, setTasks] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [forecast, setForecast] = useState(null);
  const [days, setDays] = useState(30);
  const [teamSize, setTeamSize] = useState(3);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskHours, setNewTaskHours] = useState(8);
  const [newTaskPriority, setNewTaskPriority] = useState('MEDIUM');
  const [newAssignee, setNewAssignee] = useState('Kirthik');
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');

  const loadAll = async () => {
    try {
      const [t, m, f] = await Promise.all([
        api.tasks(projectId),
        api.milestones(projectId),
        api.forecast(projectId, days, teamSize),
      ]);
      setTasks(t);
      setMilestones(m);
      setForecast(f);
    } catch (e) {}
  };

  useEffect(() => { loadAll(); }, [projectId, days, teamSize]);

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    try {
      await api.createTask({
        projectId: projectId || 1,
        title: newTaskTitle.trim(),
        estimatedHours: Number(newTaskHours),
        priority: newTaskPriority,
        assigneeName: newAssignee,
      });
      setNewTaskTitle('');
      loadAll();
    } catch (err) {
      alert('Could not add task: ' + err.message);
    }
  };

  const updateTaskStatus = async (id, status) => {
    try {
      await api.updateTask(id, { status });
      loadAll();
    } catch (err) {
      alert('Could not update task status: ' + err.message);
    }
  };

  const addMilestone = async (e) => {
    e.preventDefault();
    if (!newMilestoneTitle.trim()) return;
    try {
      await api.createMilestone({
        projectId: projectId || 1,
        title: newMilestoneTitle.trim(),
      });
      setNewMilestoneTitle('');
      loadAll();
    } catch (err) {
      alert('Could not add milestone: ' + err.message);
    }
  };

  const toggleMilestone = async (id) => {
    try {
      await api.toggleMilestone(id);
      loadAll();
    } catch (err) {
      alert('Could not toggle milestone: ' + err.message);
    }
  };

  return (
    <div className="planner-workspace">
      <header className="page-head row">
        <div>
          <h2>Intelligent Project Planner</h2>
          <p className="muted">
            Manage tasks, sprint milestones, workload forecasting, and delivery risk modeling.
          </p>
        </div>
      </header>

      {forecast && (
        <section className="glass">
          <div className="issue-top" style={{ justifyContent: 'space-between' }}>
            <h3>
              Delivery Risk: <span className={`sev ${forecast.risk?.toLowerCase()}`}>{forecast.risk}</span>
            </h3>
            <span className="muted">Workload Ratio: <b>{forecast.loadRatio}×</b> capacity</span>
          </div>
          <p className="hint muted" style={{ color: 'var(--med)' }}>{forecast.disclaimer}</p>
          <div className="grid" style={{ marginTop: '0.8rem' }}>
            <div className="glass" style={{ background: 'rgba(0,0,0,0.3)' }}>
              <small className="muted">Total Tasks</small>
              <h2 style={{ margin: '0.2rem 0' }}>{forecast.totalTasks}</h2>
              <span className="ok">{forecast.completedTasks} completed</span>
            </div>
            <div className="glass" style={{ background: 'rgba(0,0,0,0.3)' }}>
              <small className="muted">Remaining Workload</small>
              <h2 style={{ margin: '0.2rem 0' }}>{forecast.remainingHours} hrs</h2>
              <span className="muted">Capacity: {forecast.capacityHours} hrs</span>
            </div>
            <div className="glass" style={{ background: 'rgba(0,0,0,0.3)' }}>
              <small className="muted">Sprint Progress</small>
              <h2 style={{ margin: '0.2rem 0' }}>{forecast.progressPercent}%</h2>
              <span className="muted">{forecast.blockedTasks} blocked tasks</span>
            </div>
          </div>

          <div className="form" style={{ marginTop: '1rem' }}>
            <label>
              Days to Deadline
              <input
                type="number"
                min="1"
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
              />
            </label>
            <label>
              Team Size (Devs)
              <input
                type="number"
                min="1"
                value={teamSize}
                onChange={(e) => setTeamSize(Number(e.target.value))}
              />
            </label>
            <button className="btn primary" onClick={loadAll}>Recalculate Forecast</button>
          </div>
        </section>
      )}

      <section className="glass">
        <h3>Create Development Task</h3>
        <form className="form" onSubmit={addTask}>
          <label style={{ flex: 2 }}>
            Task Title
            <input
              style={{ width: '100%' }}
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="e.g. Implement OAuth2 refresh token logic"
            />
          </label>
          <label>
            Est. Hours
            <input
              type="number"
              min="1"
              value={newTaskHours}
              onChange={(e) => setNewTaskHours(e.target.value)}
            />
          </label>
          <label>
            Priority
            <select
              value={newTaskPriority}
              onChange={(e) => setNewTaskPriority(e.target.value)}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </label>
          <label>
            Assignee
            <input
              value={newAssignee}
              onChange={(e) => setNewAssignee(e.target.value)}
            />
          </label>
          <button className="btn primary">Add Task</button>
        </form>
      </section>

      <section className="glass">
        <h3>Project Tasks ({tasks.length})</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          {STATUSES.map((st) => (
            <div key={st} style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '1rem', border: '1px solid var(--line)' }}>
              <h4 style={{ margin: '0 0 0.8rem', textTransform: 'capitalize' }}>
                {st.replace('_', ' ').toLowerCase()} ({tasks.filter((t) => t.status === st).length})
              </h4>
              {tasks.filter((t) => t.status === st).map((t) => (
                <div key={t.id} className="glass" style={{ padding: '0.8rem', marginBottom: '0.6rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <span className={`sev ${t.priority.toLowerCase()}`}>{t.priority}</span>
                    <small className="muted">{t.estimatedHours}h</small>
                  </div>
                  <b>{t.title}</b>
                  <p className="muted" style={{ margin: '0.3rem 0', fontSize: '0.8rem' }}>
                    Assignee: {t.assigneeName}
                  </p>
                  <select
                    value={t.status}
                    onChange={(e) => updateTaskStatus(t.id, e.target.value)}
                    style={{ fontSize: '0.8rem', width: '100%', marginTop: '0.4rem' }}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className="glass">
        <h3>Project Milestones</h3>
        <form className="inline" onSubmit={addMilestone} style={{ marginBottom: '1rem' }}>
          <input
            value={newMilestoneTitle}
            onChange={(e) => setNewMilestoneTitle(e.target.value)}
            placeholder="New milestone name (e.g. Production Go-Live)"
          />
          <button className="btn primary">Add Milestone</button>
        </form>

        <ul style={{ listStyle: 'none', padding: 0 }}>
          {milestones.map((m) => (
            <li
              key={m.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.8rem',
                padding: '0.6rem 0',
                borderBottom: '1px solid var(--line)',
              }}
            >
              <input
                type="checkbox"
                checked={m.completed}
                onChange={() => toggleMilestone(m.id)}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <span style={{ textDecoration: m.completed ? 'line-through' : 'none', flex: 1 }}>
                <b>{m.title}</b>
              </span>
              <span className={`sev ${m.completed ? 'low' : 'high'}`}>
                {m.completed ? 'COMPLETED' : 'PENDING'}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
