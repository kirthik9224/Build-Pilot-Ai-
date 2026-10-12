// Organization: Orbytes Global Solutions, Owner: Logaraj S, Created at: 2026-10-11
// Description: Interactive side-by-side Git diff viewer with line highlighting

import { useState } from 'react';

export default function DiffViewer({ diffText, filePath }) {
  const [viewMode, setViewMode] = useState('split'); // 'split' or 'unified'

  if (!diffText) return null;

  const lines = diffText.split('\n');
  const removedLines = [];
  const addedLines = [];

  lines.forEach((l, idx) => {
    if (l.startsWith('-')) {
      removedLines.push({ num: idx + 1, text: l.substring(1) });
    } else if (l.startsWith('+')) {
      addedLines.push({ num: idx + 1, text: l.substring(1) });
    } else {
      removedLines.push({ num: idx + 1, text: l });
      addedLines.push({ num: idx + 1, text: l });
    }
  });

  return (
    <div
      className="diff-viewer"
      style={{
        border: '1px solid var(--line)',
        borderRadius: '10px',
        overflow: 'hidden',
        margin: '0.8rem 0',
        background: '#090b1c',
      }}
    >
      {/* Diff Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0.6rem 1rem',
          background: 'rgba(255,255,255,0.04)',
          borderBottom: '1px solid var(--line)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ fontSize: '0.85rem' }}>📄</span>
          <code>{filePath || 'Proposed Code Patch'}</code>
        </div>
        <div className="chips" style={{ margin: 0 }}>
          <button
            className={`chip ${viewMode === 'split' ? 'on' : ''}`}
            style={{ padding: '2px 8px', fontSize: '0.75rem' }}
            onClick={() => setViewMode('split')}
          >
            Side-by-Side
          </button>
          <button
            className={`chip ${viewMode === 'unified' ? 'on' : ''}`}
            style={{ padding: '2px 8px', fontSize: '0.75rem' }}
            onClick={() => setViewMode('unified')}
          >
            Unified
          </button>
        </div>
      </div>

      {/* Unified View */}
      {viewMode === 'unified' ? (
        <div style={{ padding: '0.6rem 0', fontFamily: 'monospace', fontSize: '0.82rem' }}>
          {lines.map((l, i) => {
            const isAdd = l.startsWith('+');
            const isSub = l.startsWith('-');
            return (
              <div
                key={i}
                style={{
                  display: 'flex',
                  gap: '1rem',
                  padding: '2px 1rem',
                  background: isAdd
                    ? 'rgba(74,222,128,0.15)'
                    : isSub
                    ? 'rgba(244,63,94,0.18)'
                    : 'transparent',
                  color: isAdd ? '#86efac' : isSub ? '#fca5a5' : 'var(--text)',
                }}
              >
                <span style={{ width: '24px', opacity: 0.4, userSelect: 'none' }}>
                  {isAdd ? '+' : isSub ? '-' : ' '}
                </span>
                <span style={{ flex: 1, whiteSpace: 'pre-wrap' }}>{l}</span>
              </div>
            );
          })}
        </div>
      ) : (
        /* Split / Side-by-Side View */
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            fontFamily: 'monospace',
            fontSize: '0.82rem',
            borderTop: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          {/* Left Column: Original */}
          <div style={{ borderRight: '1px solid var(--line)', padding: '0.6rem 0' }}>
            <div
              style={{
                padding: '2px 1rem',
                fontSize: '0.75rem',
                color: 'var(--muted)',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                marginBottom: '4px',
              }}
            >
              Original Code
            </div>
            {lines.map((l, i) => {
              const isSub = l.startsWith('-');
              if (l.startsWith('+')) return null;
              return (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    padding: '2px 1rem',
                    background: isSub ? 'rgba(244,63,94,0.2)' : 'transparent',
                    color: isSub ? '#fca5a5' : 'var(--text)',
                  }}
                >
                  <span style={{ flex: 1, whiteSpace: 'pre-wrap' }}>
                    {isSub ? l.substring(1) : l}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Right Column: Proposed */}
          <div style={{ padding: '0.6rem 0' }}>
            <div
              style={{
                padding: '2px 1rem',
                fontSize: '0.75rem',
                color: 'var(--low)',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                marginBottom: '4px',
              }}
            >
              Proposed AI Patch
            </div>
            {lines.map((l, i) => {
              const isAdd = l.startsWith('+');
              if (l.startsWith('-')) return null;
              return (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    padding: '2px 1rem',
                    background: isAdd ? 'rgba(74,222,128,0.2)' : 'transparent',
                    color: isAdd ? '#86efac' : 'var(--text)',
                  }}
                >
                  <span style={{ flex: 1, whiteSpace: 'pre-wrap' }}>
                    {isAdd ? l.substring(1) : l}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
