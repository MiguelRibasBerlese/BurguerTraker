// AddMemberModal — modal para adicionar novo funcionário

import { useState, useRef, useEffect } from 'react'

export default function AddMemberModal({ onAdd, onClose }) {
  const [name, setName] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onAdd(trimmed);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter') handleSubmit();
    if (e.key === 'Escape') onClose();
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth: 420, textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 8 }}>👤</div>

        <div style={{
          fontFamily: "'Bangers', cursive",
          fontSize: 32, letterSpacing: 4,
          color: 'var(--roxo-light)', marginBottom: 20,
        }}>
          NOVO FUNCIONÁRIO
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{
            display: 'block', textAlign: 'left',
            fontSize: 12, letterSpacing: 3,
            color: 'var(--text-muted)', textTransform: 'uppercase',
            marginBottom: 8,
          }}>
            Nome do funcionário
          </label>
          <input
            ref={inputRef}
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ex: João, Maria..."
            aria-label="Nome do novo funcionário"
            style={{
              width: '100%', padding: '14px 16px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--roxo-border)',
              borderRadius: 12, color: 'var(--text)',
              fontSize: 16, outline: 'none',
              transition: 'border-color 0.2s, box-shadow 0.2s',
            }}
            onFocus={e => {
              e.target.style.borderColor = 'var(--roxo-light)';
              e.target.style.boxShadow = '0 0 0 3px var(--roxo-bg)';
            }}
            onBlur={e => {
              e.target.style.borderColor = 'var(--roxo-border)';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: '12px 0',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 12, color: 'var(--text-muted)',
              cursor: 'pointer', fontWeight: 600, fontSize: 15,
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
          >
            Cancelar
          </button>

          <button
            onClick={handleSubmit}
            disabled={!name.trim()}
            style={{
              flex: 2, padding: '12px 0',
              background: name.trim()
                ? 'linear-gradient(135deg, var(--roxo-dark), var(--roxo-light))'
                : 'rgba(255,255,255,0.05)',
              border: 'none', borderRadius: 12, color: 'white',
              cursor: name.trim() ? 'pointer' : 'not-allowed',
              fontFamily: "'Bangers', cursive",
              fontSize: 20, letterSpacing: 2,
              opacity: name.trim() ? 1 : 0.4,
              transition: 'all 0.2s',
            }}
          >
            ➕ ADICIONAR
          </button>
        </div>
      </div>
    </div>
  );
}
