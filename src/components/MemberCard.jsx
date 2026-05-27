// MemberCard — card individual do membro com animações zueiras

import { useState, useCallback } from 'react'

const FLOAT_EMOJIS = ['🍔','🔥','😋','🤤','💀','👑','🎯','⚡','🎰','💜'];

let emojiCounter = 0;

export default function MemberCard({ member, perPerson, delay, onAdd, onRemove, onDelete }) {
  const [shaking, setShaking] = useState(false);
  const [floaters, setFloaters] = useState([]);
  // Vencedor do sorteio tem limite de perPerson + 1 (ex: 3 ao invés de 2)
  const limit = member.wonExtra ? perPerson + 1 : perPerson;
  const maxed = member.burgers >= limit;

  const handleAdd = useCallback(() => {
    if (maxed) return;
    onAdd();

    // Shake
    setShaking(true);
    setTimeout(() => setShaking(false), 500);

    // Emoji flutuante
    const id = ++emojiCounter;
    const emoji = FLOAT_EMOJIS[Math.floor(Math.random() * FLOAT_EMOJIS.length)];
    const left = 20 + Math.random() * 60;
    setFloaters(prev => [...prev, { id, emoji, left }]);
    setTimeout(() => setFloaters(prev => prev.filter(f => f.id !== id)), 1100);
  }, [maxed, onAdd]);

  const pct = limit > 0 ? (member.burgers / limit) * 100 : 0;

  return (
    <>
      <style>{`
        .member-card { transition: transform 0.2s, box-shadow 0.2s; }
        .member-card:hover { transform: translateY(-4px) !important; box-shadow: 0 12px 40px var(--roxo-glow) !important; }
        .member-card.shaking { animation: shake 0.5s ease; }
        .btn-add { cursor: pointer; transition: all 0.15s; }
        .btn-add:not(:disabled):hover { background: var(--roxo) !important; transform: scale(1.08); }
        .btn-add:not(:disabled):active { transform: scale(0.95); }
        .btn-add:disabled { opacity: 0.4; cursor: not-allowed; }
        .btn-secondary { cursor: pointer; transition: all 0.15s; }
        .btn-secondary:hover { opacity: 0.8; transform: scale(1.08); }
        .btn-secondary:active { transform: scale(0.95); }
      `}</style>

      <div
        className={`member-card${shaking ? ' shaking' : ''}`}
        style={{
          background: maxed ? 'rgba(0,230,118,0.05)' : 'var(--bg-card)',
          border: `1px solid ${maxed ? 'rgba(0,230,118,0.3)' : 'var(--roxo-border)'}`,
          borderRadius: 16, padding: 20,
          position: 'relative', overflow: 'hidden',
          animation: `fadeInUp 0.5s ease ${delay}s both`,
        }}
      >
        {/* Emojis flutuantes */}
        {floaters.map(f => (
          <span key={f.id} style={{
            position: 'absolute', bottom: 40, left: `${f.left}%`,
            fontSize: 28, pointerEvents: 'none', zIndex: 10,
            animation: 'floatUp 1s ease forwards',
          }}>{f.emoji}</span>
        ))}

        {/* Badge vencedor do sorteio (pode comer 3) */}
        {member.wonExtra && (
          <div style={{
            position: 'absolute', top: 8, right: 8,
            background: 'var(--roxo-bg)', border: '1px solid var(--roxo-border)',
            borderRadius: 6, padding: '2px 8px',
            fontSize: 10, letterSpacing: 1, color: 'var(--roxo-light)',
          }}>
            🎰 +1 BURGER
          </div>
        )}

        {/* Badge bloqueado no mês seguinte */}
        {member.wonLastMonth && !member.wonExtra && (
          <div style={{
            position: 'absolute', top: 8, right: 8,
            background: 'rgba(255,61,61,0.15)', border: '1px solid rgba(255,61,61,0.3)',
            borderRadius: 6, padding: '2px 8px',
            fontSize: 10, letterSpacing: 1, color: '#ff6b6b',
          }}>
            👑 CAMPEÃO
          </div>
        )}

        {/* Nome */}
        <div style={{
          fontFamily: "'Bangers', cursive",
          fontSize: 26, letterSpacing: 2,
          color: maxed ? 'var(--verde)' : 'var(--text)',
          marginBottom: 6,
        }}>
          {member.name}
        </div>

        {/* Emojis de burgers comidos */}
        <div style={{ fontSize: 20, marginBottom: 8, minHeight: 28 }}>
          {Array.from({ length: limit }).map((_, i) => (
            <span
              key={i}
              style={{
                opacity: i < member.burgers ? 1 : 0.2,
                filter: i < member.burgers ? 'drop-shadow(0 0 4px var(--roxo-glow))' : 'none',
                transition: 'all 0.3s',
                animation: i < member.burgers ? 'pulse 2s ease infinite' : 'none',
              }}
            >
              🍔
            </span>
          ))}
        </div>

        {/* Contador */}
        <div style={{
          fontFamily: "'Bangers', cursive",
          fontSize: 20, color: 'var(--text-muted)', marginBottom: 10, letterSpacing: 2,
        }}>
          <span style={{ color: maxed ? 'var(--verde)' : 'var(--roxo-light)', fontSize: 28 }}>
            {member.burgers}
          </span>/{limit}
          {maxed && <span style={{ marginLeft: 8 }}>✅</span>}
        </div>

        {/* Mini barra de progresso */}
        <div style={{
          height: 6, background: 'rgba(255,255,255,0.08)',
          borderRadius: 3, marginBottom: 14, overflow: 'hidden',
        }}>
          <div style={{
            height: '100%', borderRadius: 3,
            width: `${pct}%`,
            background: maxed
              ? 'linear-gradient(90deg, var(--verde), #00ff88)'
              : 'linear-gradient(90deg, var(--roxo-dark), var(--roxo-light))',
            transition: 'width 0.4s ease',
            boxShadow: maxed ? '0 0 8px rgba(0,230,118,0.6)' : '0 0 8px var(--roxo-glow)',
          }} />
        </div>

        {/* Botões */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button
            className="btn-add"
            onClick={handleAdd}
            disabled={maxed}
            aria-label={`Adicionar burger para ${member.name}`}
            style={{
              flex: 1, padding: '10px 0',
              background: maxed ? 'rgba(0,230,118,0.15)' : 'var(--roxo-bg)',
              border: `1px solid ${maxed ? 'rgba(0,230,118,0.3)' : 'var(--roxo-border)'}`,
              borderRadius: 10, color: maxed ? 'var(--verde)' : 'var(--roxo-light)',
              fontWeight: 700, fontSize: 16,
            }}
          >
            {maxed ? '✅ CHEIO' : '+ 🍔'}
          </button>

          <button
            className="btn-secondary"
            onClick={onRemove}
            disabled={member.burgers === 0}
            aria-label={`Remover burger de ${member.name}`}
            style={{
              padding: '10px 12px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 10, color: 'var(--text-muted)',
              fontWeight: 700, fontSize: 16, cursor: 'pointer',
              opacity: member.burgers === 0 ? 0.3 : 1,
            }}
          >
            -
          </button>

          <button
            className="btn-secondary"
            onClick={onDelete}
            aria-label={`Remover ${member.name}`}
            style={{
              padding: '10px 12px',
              background: 'rgba(255,61,61,0.1)',
              border: '1px solid rgba(255,61,61,0.2)',
              borderRadius: 10, color: '#ff6b6b',
              fontSize: 16, cursor: 'pointer',
            }}
          >
            🗑️
          </button>
        </div>
      </div>
    </>
  );
}
