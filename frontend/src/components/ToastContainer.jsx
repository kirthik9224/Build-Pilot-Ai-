// Organization: Orbytes Global Solutions, Owner: Logaraj S, Created at: 2026-10-11
// Description: Non-intrusive floating toast notification manager

export default function ToastContainer({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div
      className="toast-container"
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '24px',
        zIndex: 1500,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        maxWidth: '380px',
      }}
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className="glass toast-card"
          style={{
            margin: 0,
            padding: '10px 14px',
            borderRadius: '12px',
            background: 'rgba(15,18,40,0.92)',
            border: '1px solid rgba(160,150,255,0.3)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            animation: 'fadeIn 0.2s ease-out',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.1rem' }}>
              {t.type === 'error' ? '❌' : t.type === 'warn' ? '⚠️' : '✨'}
            </span>
            <span style={{ fontSize: '0.88rem', color: '#fff' }}>{t.message}</span>
          </div>
          <button
            onClick={() => onDismiss(t.id)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--muted)',
              cursor: 'pointer',
              fontSize: '0.85rem',
            }}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
