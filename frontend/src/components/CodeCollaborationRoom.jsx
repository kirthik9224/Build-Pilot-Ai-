// Organization: Orbytes Global Solutions, Owner: Kirthik, Created at: 2026-10-12
// Description: Interactive Real-Time Code Collaboration Room with synchronized cursors and inline comments

import { useState } from 'react';

const TEAM_USERS = [
  { id: 'usr-1', name: 'Kirthik (Lead)', color: '#a855f7', line: 12, cursor: 'Col 24' },
  { id: 'usr-2', name: 'Kirthik (Lead)', color: '#6366f1', line: 6, cursor: 'Col 18' },
  { id: 'usr-3', name: 'Alex Rivera (Dev)', color: '#38bdf8', line: 18, cursor: 'Col 9' },
  { id: 'usr-4', name: 'BuildPilot AI Agent', color: '#4ade80', line: 14, cursor: 'Suggesting fix…' },
];

const INITIAL_CODE = `package com.buildpilot.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OrderProcessingService {

    private final PaymentGateway paymentGateway;
    private final InventoryClient inventoryClient;

    public OrderProcessingService(PaymentGateway pg, InventoryClient ic) {
        this.paymentGateway = pg;
        this.inventoryClient = ic;
    }

    @Transactional
    public OrderResult processOrder(OrderRequest request) {
        // Step 1: Validate inventory availability
        boolean available = inventoryClient.checkStock(request.getProductId(), request.getQty());
        if (!available) {
            throw new OutOfStockException("Requested quantity unavailable");
        }

        // Step 2: Charge customer card via payment gateway
        PaymentResponse payment = paymentGateway.charge(request.getCustomerId(), request.getAmount());
        return new OrderResult("ORDER_SUCCESS", payment.getTransactionId());
    }
}`;

export default function CodeCollaborationRoom({ user, onTriggerToast }) {
  const [code, setCode] = useState(INITIAL_CODE);
  const [activeUsers] = useState(TEAM_USERS);
  const [comments, setComments] = useState([
    { id: 1, line: 14, author: 'Kirthik', text: 'Should we add idempotent transaction tokens here?', time: '10m ago' },
    { id: 2, line: 20, author: 'BuildPilot AI', text: '⚡ Suggested patch: Add retry backoff policy for payment gateway timeouts.', time: '2m ago' },
  ]);
  const [newComment, setNewComment] = useState('');
  const [selectedLine, setSelectedLine] = useState(14);

  const addComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const commentObj = {
      id: Date.now(),
      line: selectedLine,
      author: user?.name || 'Developer',
      text: newComment.trim(),
      time: 'Just now',
    };
    setComments((prev) => [...prev, commentObj]);
    setNewComment('');
    if (onTriggerToast) onTriggerToast(`Added inline review comment on line ${selectedLine}!`);
  };

  const lines = code.split('\n');

  return (
    <div className="collab-room-view">
      <header className="page-head row">
        <div>
          <h2>Real-Time Code Collaboration Room</h2>
          <p className="muted">
            Multi-developer synchronous code pairing, synchronized cursor positions, and live inline review threads.
          </p>
        </div>
        <div className="actions">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="ok" style={{ fontSize: '0.82rem' }}>● 4 Connected</span>
            <div style={{ display: 'flex', gap: '4px' }}>
              {activeUsers.map((u) => (
                <span
                  key={u.id}
                  style={{
                    background: u.color,
                    color: '#fff',
                    borderRadius: '50%',
                    width: '26px',
                    height: '26px',
                    display: 'grid',
                    placeItems: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                  }}
                  title={`${u.name} (Line ${u.line})`}
                >
                  {u.name.charAt(0)}
                </span>
              ))}
            </div>
          </div>
        </div>
      </header>

      <div className="grid" style={{ gridTemplateColumns: '1fr 340px', gap: '1.2rem' }}>
        {/* Synchronized Code Editor with Live Presence */}
        <section className="glass" style={{ margin: 0, padding: '1rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
            <code>OrderProcessingService.java</code>
            <span className="chip on" style={{ fontSize: '0.75rem' }}>Presence: WebRTC / WebSocket Mesh</span>
          </div>

          <div
            style={{
              position: 'relative',
              background: '#070918',
              borderRadius: '10px',
              border: '1px solid var(--line)',
              overflow: 'hidden',
              fontFamily: 'monospace',
              fontSize: '0.82rem',
              lineHeight: '1.6',
            }}
          >
            {lines.map((lineText, idx) => {
              const lineNum = idx + 1;
              const userOnLine = activeUsers.find((u) => u.line === lineNum);
              const commentOnLine = comments.find((c) => c.line === lineNum);

              return (
                <div
                  key={lineNum}
                  onClick={() => setSelectedLine(lineNum)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '2px 8px',
                    background: selectedLine === lineNum
                      ? 'rgba(99,102,241,0.18)'
                      : userOnLine
                      ? `${userOnLine.color}15`
                      : 'transparent',
                    cursor: 'pointer',
                    position: 'relative',
                  }}
                >
                  {/* Line Number */}
                  <span style={{ width: '32px', color: 'var(--muted)', userSelect: 'none', opacity: 0.6 }}>
                    {lineNum}
                  </span>

                  {/* Code Line */}
                  <span style={{ flex: 1, whiteSpace: 'pre-wrap', color: '#e2e8f0' }}>
                    {lineText}
                  </span>

                  {/* Active Remote Cursor Badge */}
                  {userOnLine && (
                    <span
                      style={{
                        background: userOnLine.color,
                        color: '#fff',
                        fontSize: '0.68rem',
                        padding: '1px 6px',
                        borderRadius: '4px',
                        marginLeft: '8px',
                      }}
                    >
                      {userOnLine.name.split(' ')[0]}
                    </span>
                  )}

                  {/* Inline Comment Pin */}
                  {commentOnLine && (
                    <span
                      style={{
                        background: 'rgba(168,85,247,0.3)',
                        border: '1px solid var(--violet)',
                        color: '#f3e8ff',
                        fontSize: '0.7rem',
                        padding: '1px 6px',
                        borderRadius: '4px',
                        marginLeft: '6px',
                      }}
                      title={commentOnLine.text}
                    >
                      💬 1
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Live Inline Comment & Review Threads */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <section className="glass" style={{ margin: 0 }}>
            <h3>Review Thread (Line {selectedLine})</h3>
            <p className="muted" style={{ fontSize: '0.8rem' }}>Leave live peer feedback or ask AI to refactor</p>

            <div style={{ display: 'grid', gap: '0.8rem', marginTop: '0.8rem', maxHeight: '280px', overflowY: 'auto' }}>
              {comments
                .filter((c) => c.line === selectedLine)
                .map((c) => (
                  <div
                    key={c.id}
                    style={{
                      padding: '0.8rem',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid var(--line)',
                      borderRadius: '10px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <b style={{ fontSize: '0.85rem', color: 'var(--cyan)' }}>{c.author}</b>
                      <small className="muted">{c.time}</small>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.82rem', lineHeight: '1.4' }}>{c.text}</p>
                  </div>
                ))}
              {comments.filter((c) => c.line === selectedLine).length === 0 && (
                <p className="muted" style={{ textAlign: 'center', margin: '1rem 0' }}>
                  No comments on line {selectedLine}. Add one below!
                </p>
              )}
            </div>

            <form onSubmit={addComment} style={{ display: 'grid', gap: '0.6rem', marginTop: '1rem' }}>
              <input
                type="text"
                placeholder={`Comment on line ${selectedLine}…`}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button className="btn primary" type="submit" disabled={!newComment.trim()}>
                Post Review Note
              </button>
            </form>
          </section>

          {/* Active Teammates Roster */}
          <section className="glass" style={{ margin: 0 }}>
            <h3>Active Contributors</h3>
            <div style={{ display: 'grid', gap: '0.5rem', marginTop: '0.6rem' }}>
              {activeUsers.map((u) => (
                <div key={u.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <span style={{ color: u.color }}>● {u.name}</span>
                  <small className="muted">Line {u.line}</small>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
