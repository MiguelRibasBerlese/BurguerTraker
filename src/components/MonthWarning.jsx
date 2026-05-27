// MonthWarning — popup de aviso no último dia do mês

export default function MonthWarning({ restantes, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal-box" style={{ maxWidth: 460, textAlign: 'center' }}>

        <div style={{
          fontSize: 60, marginBottom: 8,
          animation: 'pulse 0.7s ease infinite',
        }}>
          ⚠️
        </div>

        <div style={{
          fontFamily: "'Bangers', cursive",
          fontSize: 36, letterSpacing: 4,
          color: 'var(--roxo-light)', marginBottom: 8,
        }}>
          ATENÇÃO!!
        </div>

        <div style={{
          fontFamily: "'Bangers', cursive",
          fontSize: 22, letterSpacing: 2,
          color: '#ff6b6b', marginBottom: 20,
        }}>
          Amanhã os contadores resetam!
        </div>

        <div style={{
          background: 'var(--roxo-bg)', border: '1px solid var(--roxo-border)',
          borderRadius: 14, padding: '20px', marginBottom: 20,
        }}>
          <div style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 8 }}>
            Burgers sobrando hoje:
          </div>
          <div style={{
            fontFamily: "'Bangers', cursive",
            fontSize: 64, letterSpacing: 4,
            color: restantes > 0 ? 'var(--roxo-light)' : 'var(--verde)',
            lineHeight: 1,
            animation: 'countPulse 1s ease infinite',
          }}>
            {restantes}
          </div>
          <div style={{ fontSize: 28, marginTop: 8 }}>
            {Array.from({ length: Math.min(restantes, 15) }).map((_, i) => (
              <span key={i}>🍔</span>
            ))}
          </div>
        </div>

        {restantes > 0 ? (
          <div style={{
            fontFamily: "'Bangers', cursive",
            fontSize: 20, letterSpacing: 2,
            color: 'var(--text)', marginBottom: 20,
          }}>
            Corre pra comer antes que zere! 🍔🔥
          </div>
        ) : (
          <div style={{
            fontFamily: "'Bangers', cursive",
            fontSize: 20, letterSpacing: 2,
            color: 'var(--verde)', marginBottom: 20,
          }}>
            Vocês zeraram tudo! Que equipe! 🎉
          </div>
        )}

        <button
          onClick={onClose}
          style={{
            width: '100%', padding: '14px 0',
            background: 'linear-gradient(135deg, var(--roxo-dark), var(--roxo-light))',
            border: 'none', borderRadius: 12, color: 'white',
            fontFamily: "'Bangers', cursive",
            fontSize: 22, letterSpacing: 3,
            cursor: 'pointer',
            animation: 'glowPulse 2s infinite',
          }}
        >
          Entendi! 🍔
        </button>
      </div>
    </div>
  );
}
