// ProgressBar — barra de progresso animada + fileira de emojis

export default function ProgressBar({ total, comidos }) {
  const pct = total > 0 ? Math.round((comidos / total) * 100) : 0;

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--roxo-border)',
      borderRadius: 16, padding: '20px 24px',
      animation: 'fadeInUp 0.5s ease 0.3s both',
    }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: 10,
      }}>
        <span style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: 13, letterSpacing: 2,
          color: 'var(--text-muted)', textTransform: 'uppercase',
        }}>
          Progresso do Mês
        </span>
        <span style={{
          fontFamily: "'Bangers', cursive",
          fontSize: 28, letterSpacing: 2,
          color: pct === 100 ? 'var(--verde)' : 'var(--roxo-light)',
        }}>
          {pct}% DEVORADO
        </span>
      </div>

      {/* Barra */}
      <div style={{
        height: 18, background: 'rgba(255,255,255,0.05)',
        borderRadius: 9, overflow: 'hidden', position: 'relative',
      }}>
        <div style={{
          height: '100%', borderRadius: 9,
          width: `${pct}%`,
          background: 'linear-gradient(90deg, var(--roxo-dark), var(--roxo), var(--roxo-light), var(--roxo))',
          backgroundSize: '200% 100%',
          animation: 'progressShimmer 2s linear infinite',
          transition: 'width 0.5s cubic-bezier(0.34,1.56,0.64,1)',
          boxShadow: '0 0 12px var(--roxo-glow)',
        }} />
      </div>

      {/* Fileira de emojis */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: 4,
        marginTop: 12, justifyContent: 'center',
      }}>
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            style={{
              fontSize: 20,
              opacity: i < comidos ? 1 : 0.2,
              transform: i < comidos ? 'scale(1)' : 'scale(0.85)',
              transition: `all 0.3s ease ${i * 0.03}s`,
              filter: i < comidos ? 'drop-shadow(0 0 6px var(--roxo-glow))' : 'none',
              animation: i < comidos ? `pulse 1.5s ease ${i * 0.1}s infinite` : 'none',
            }}
          >
            🍔
          </span>
        ))}
      </div>

      {pct === 100 && (
        <div style={{
          textAlign: 'center', marginTop: 12,
          fontFamily: "'Bangers', cursive",
          fontSize: 22, letterSpacing: 3,
          color: 'var(--verde)',
          animation: 'pulse 0.8s ease infinite',
        }}>
          🎉 TODOS OS BURGERS FORAM DEVORADOS! 🎉
        </div>
      )}
    </div>
  );
}
