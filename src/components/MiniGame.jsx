// MiniGame — roleta automática de sorteio (rules + spin + result em um único modal)

import { useState, useRef, useCallback } from 'react'

// Intervalos da roleta: começa rápido, vai desacelerando
const SPIN_INTERVALS = [70, 75, 80, 90, 105, 125, 155, 195, 245, 315, 405, 525, 680, 900, 1100];

const HYPE_SPIN = ['🔥 GIRANDO...', '⚡ QUEM VAI SER?!', '💀 TÁ QUASE...', '🎰 SORTEANDO...', '🤯 SUSPENSE!!'];
const HYPE_WIN  = ['PARABÉNS SORTUDO!!', 'O DESTINO ESCOLHEU!!', 'ERA ESCRITO!!', 'MERECEU DEMAIS!!'];
const MESES_PT  = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];

function formatMonth(s) {
  const [y, m] = s.split('-');
  return `${MESES_PT[parseInt(m) - 1]}/${y}`;
}

export default function MiniGame({ players, members, history, onGameOver, onClose }) {
  const blocked = members.filter(m => m.wonLastMonth);

  const [phase, setPhase]     = useState('rules');   // rules | spinning | result
  const [current, setCurrent] = useState(players[0]);
  const [winner, setWinner]   = useState(null);
  const [hype, setHype]       = useState('');
  const [nameKey, setNameKey] = useState(0); // força reanimação ao trocar nome
  const hypeRef = useRef(null);

  const startSpin = useCallback(() => {
    if (players.length < 2) return;
    const chosen = players[Math.floor(Math.random() * players.length)];
    setPhase('spinning');
    setHype(HYPE_SPIN[0]);

    let hi = 0;
    hypeRef.current = setInterval(() => {
      hi = (hi + 1) % HYPE_SPIN.length;
      setHype(HYPE_SPIN[hi]);
    }, 700);

    let idx = 0;
    const tick = (frameIdx) => {
      idx = (idx + 1) % players.length;
      setCurrent(players[idx]);
      setNameKey(k => k + 1); // re-key para acionar a animação fadeIn

      if (frameIdx < SPIN_INTERVALS.length - 1) {
        setTimeout(() => tick(frameIdx + 1), SPIN_INTERVALS[frameIdx + 1]);
      } else {
        clearInterval(hypeRef.current);
        setCurrent(chosen);
        setNameKey(k => k + 1);
        setWinner(chosen);
        setPhase('result');
      }
    };
    setTimeout(() => tick(0), SPIN_INTERVALS[0]);
  }, [players]);

  return (
    <div className="modal-overlay">
      <div className="modal-box" style={{ maxWidth: 520, textAlign: 'center' }}>

        <style>{`
          @keyframes nameFadeIn {
            from { opacity: 0; transform: translateY(-8px) scale(0.95); }
            to   { opacity: 1; transform: translateY(0) scale(1); }
          }
          @keyframes winnerPop {
            0%   { transform: scale(0.7); opacity: 0; }
            60%  { transform: scale(1.08); }
            100% { transform: scale(1); opacity: 1; }
          }
          @keyframes spinIcon {
            from { transform: rotate(0deg); }
            to   { transform: rotate(360deg); }
          }
        `}</style>

        {/* ===== RULES ===== */}
        {phase === 'rules' && (
          <>
            <div style={{ fontSize: 48, marginBottom: 10, animation: 'pulse 1.2s ease infinite' }}>🍔🎰🍔</div>
            <div style={{
              fontFamily: "'Bangers', cursive", fontSize: 30, letterSpacing: 4, marginBottom: 20,
              background: 'linear-gradient(135deg, var(--roxo-light), #fff)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              SORTEIO DO BURGER EXTRA
            </div>

            <div style={{
              background: 'var(--roxo-bg)', border: '1px solid var(--roxo-border)',
              borderRadius: 14, padding: '14px 18px', marginBottom: 14, textAlign: 'left',
            }}>
              {[
                ['🍔', 'Sobrou 1 hambúrguer na divisão do mês'],
                ['🎰', 'O sistema sorteia automaticamente o vencedor'],
                ['⚡', 'O nome fica girando e para no escolhido pelo destino'],
                ['🏆', 'O sortudo leva o 3º burger do mês!'],
                ['🚫', 'Quem ganhou não participa no mês seguinte'],
              ].map(([icon, text]) => (
                <div key={text} style={{ display: 'flex', gap: 10, marginBottom: 7, fontSize: 13, lineHeight: 1.5 }}>
                  <span style={{ fontSize: 18, flexShrink: 0 }}>{icon}</span>
                  <span>{text}</span>
                </div>
              ))}
            </div>

            {/* Participantes */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, letterSpacing: 3, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6 }}>
                ✅ PARTICIPANTES ({players.length})
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center' }}>
                {players.map(p => (
                  <span key={p.id} style={{
                    background: 'var(--roxo-bg)', border: '1px solid var(--roxo-border)',
                    borderRadius: 8, padding: '4px 12px', color: 'var(--roxo-light)', fontWeight: 600, fontSize: 14,
                  }}>{p.name}</span>
                ))}
              </div>
            </div>

            {/* Bloqueados */}
            {blocked.length > 0 && (
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 11, letterSpacing: 3, color: '#ff6b6b', textTransform: 'uppercase', marginBottom: 6 }}>
                  🚫 BLOQUEADOS
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center' }}>
                  {blocked.map(p => (
                    <span key={p.id} style={{
                      background: 'rgba(255,61,61,0.1)', border: '1px solid rgba(255,61,61,0.3)',
                      borderRadius: 8, padding: '4px 12px', color: '#ff6b6b', fontWeight: 600, fontSize: 14,
                    }}>👑 {p.name}</span>
                  ))}
                </div>
              </div>
            )}

            {players.length < 2 && (
              <div style={{
                background: 'rgba(255,61,61,0.1)', border: '1px solid rgba(255,61,61,0.3)',
                borderRadius: 10, padding: '10px', marginBottom: 12, fontSize: 13, color: '#ff6b6b',
              }}>
                ⚠️ Precisa de pelo menos 2 participantes!
              </div>
            )}

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={onClose} style={{
                flex: 1, padding: '12px 0', background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12,
                color: 'var(--text-muted)', cursor: 'pointer', fontWeight: 600, fontSize: 15,
              }}>Cancelar</button>

              <button
                onClick={startSpin}
                disabled={players.length < 2}
                style={{
                  flex: 2, padding: '12px 0',
                  background: players.length >= 2
                    ? 'linear-gradient(135deg, var(--roxo-dark), var(--roxo-light))'
                    : 'rgba(255,255,255,0.05)',
                  border: 'none', borderRadius: 12, color: 'white',
                  fontFamily: "'Bangers', cursive", fontSize: 22, letterSpacing: 3,
                  cursor: players.length >= 2 ? 'pointer' : 'not-allowed',
                  opacity: players.length < 2 ? 0.5 : 1,
                  animation: players.length >= 2 ? 'glowPulse 2s infinite' : 'none',
                }}
              >🎰 BORA SORTEAR!</button>
            </div>
          </>
        )}

        {/* ===== SPINNING ===== */}
        {phase === 'spinning' && (
          <>
            <div style={{ fontSize: 36, marginBottom: 12, animation: 'spinIcon 0.6s linear infinite' }}>🎰</div>

            <div style={{
              fontFamily: "'Bangers', cursive", fontSize: 15, letterSpacing: 4,
              color: 'var(--text-muted)', marginBottom: 16, minHeight: 24,
            }}>{hype}</div>

            {/* Caixa do nome — tamanho fixo para não "pular" */}
            <div style={{
              background: 'var(--roxo-bg)', border: '2px solid var(--roxo-border)',
              borderRadius: 16, padding: '24px 32px', marginBottom: 20,
              boxShadow: '0 0 40px var(--roxo-glow)',
              minHeight: 90, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span
                key={nameKey}
                style={{
                  fontFamily: "'Bangers', cursive",
                  fontSize: 48, letterSpacing: 4,
                  color: 'var(--roxo-light)', lineHeight: 1,
                  display: 'block',
                  animation: 'nameFadeIn 0.12s ease forwards',
                }}
              >
                {current?.name?.toUpperCase() || '???'}
              </span>
            </div>

            <div style={{ color: 'var(--text-muted)', fontSize: 13, letterSpacing: 2 }}>
              aguarde o resultado...
            </div>
          </>
        )}

        {/* ===== RESULT ===== */}
        {phase === 'result' && winner && (
          <>
            <div style={{ fontSize: 56, marginBottom: 8 }}>🎉👑🎉</div>

            <div style={{
              fontFamily: "'Bangers', cursive", fontSize: 15, letterSpacing: 4,
              color: 'var(--text-muted)', marginBottom: 6,
            }}>
              {HYPE_WIN[Math.floor(Math.random() * HYPE_WIN.length)]}
            </div>

            <div style={{
              fontFamily: "'Bangers', cursive", fontSize: 52, letterSpacing: 4, lineHeight: 1,
              background: 'linear-gradient(135deg, var(--roxo-light), #fff)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              marginBottom: 8,
              animation: 'winnerPop 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards',
            }}>
              {winner.name.toUpperCase()}
            </div>

            <div style={{ fontSize: 15, color: 'var(--text-muted)', marginBottom: 24, lineHeight: 1.7 }}>
              🍔 O burger extra vai pro sortudo!<br />
              <span style={{ color: '#ff6b6b', fontSize: 13 }}>
                ⚠️ {winner.name} não participa no mês que vem.
              </span>
            </div>

            <button
              onClick={() => onGameOver(winner)}
              style={{
                width: '100%', padding: '16px 0',
                background: 'linear-gradient(135deg, var(--roxo-dark), var(--roxo-light))',
                border: 'none', borderRadius: 12, color: 'white',
                fontFamily: "'Bangers', cursive", fontSize: 22, letterSpacing: 3,
                cursor: 'pointer', animation: 'glowPulse 2s infinite',
              }}
            >
              🍔 CONFIRMAR VENCEDOR!
            </button>
          </>
        )}
      </div>
    </div>
  );
}
