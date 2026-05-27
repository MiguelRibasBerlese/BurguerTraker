// MiniGame — o jogo do burger extra (countdown + 5s de cliques + resultado)

import { useState, useEffect, useRef, useCallback } from 'react'

const HYPE_MSGS = [
  'TOCA O TERROR NO BOTÃO! 🔥',
  'APERTA APERTA APERTA!!! 💀',
  'VEM COM TUDO! ⚡',
  'METE O DEDO LOGO! 🖕',
  'SEUS DEDOS PEGAM FOGO?? 🔥',
  'MAIS RÁPIDO!! MAIS RÁPIDO!! 💨',
  'VAI QUE É TUA!! 👊',
  'CLICA FILHÃO!! 🎯',
  'NÃO DEIXA ELE GANHAR!! 😤',
  'VAI BORA QUE O TEMPO TÁ ACABANDO! ⏰',
];

export default function MiniGame({ players, onGameOver, onClose }) {
  const [phase, setPhase] = useState('countdown'); // countdown | playing | result
  const [countdown, setCountdown] = useState(3);
  const [timeLeft, setTimeLeft] = useState(5);
  const [clicks, setClicks] = useState(() => Object.fromEntries(players.map(p => [p.id, 0])));
  const [hypeMsg, setHypeMsg] = useState(HYPE_MSGS[0]);
  const [winner, setWinner] = useState(null);
  const timerRef = useRef(null);
  const hypeRef = useRef(null);

  // Fase countdown: 3 → 2 → 1 → começa
  useEffect(() => {
    if (phase !== 'countdown') return;
    if (countdown === 0) {
      setPhase('playing');
      return;
    }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, countdown]);

  // Fase playing: timer de 5 segundos
  useEffect(() => {
    if (phase !== 'playing') return;

    // Troca mensagem de hype a cada segundo
    hypeRef.current = setInterval(() => {
      setHypeMsg(HYPE_MSGS[Math.floor(Math.random() * HYPE_MSGS.length)]);
    }, 800);

    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          clearInterval(hypeRef.current);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timerRef.current);
      clearInterval(hypeRef.current);
    };
  }, [phase]);

  // Quando timer zera, calcula vencedor
  useEffect(() => {
    if (phase !== 'playing' || timeLeft > 0) return;
    const winner = players.reduce((best, p) =>
      (clicks[p.id] || 0) > (clicks[best.id] || 0) ? p : best
    , players[0]);
    setWinner({ ...winner, clicks: clicks[winner.id] || 0 });
    setPhase('result');
  }, [timeLeft, phase, players, clicks]);

  const handleClick = useCallback((playerId) => {
    if (phase !== 'playing') return;
    setClicks(prev => ({ ...prev, [playerId]: (prev[playerId] || 0) + 1 }));
  }, [phase]);

  const handleConfirm = () => {
    onGameOver(winner);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box" style={{ maxWidth: 700, textAlign: 'center' }}>

        {/* COUNTDOWN */}
        {phase === 'countdown' && (
          <div>
            <div style={{
              fontFamily: "'Bangers', cursive",
              fontSize: 20, letterSpacing: 4,
              color: 'var(--text-muted)', marginBottom: 20,
            }}>
              PREPARA OS DEDOS...
            </div>
            <div style={{
              fontFamily: "'Bangers', cursive",
              fontSize: countdown === 0 ? 140 : 120,
              color: countdown === 0 ? 'var(--verde)' : 'var(--roxo-light)',
              lineHeight: 1,
              animation: 'countPulse 0.4s ease',
              key: countdown,
            }}>
              {countdown === 0 ? 'JÁ!!' : countdown}
            </div>
            <div style={{ fontSize: 32, marginTop: 16 }}>🍔🎰🍔</div>
          </div>
        )}

        {/* PLAYING */}
        {phase === 'playing' && (
          <div>
            <div style={{
              fontFamily: "'Bangers', cursive",
              fontSize: 80, lineHeight: 1,
              color: timeLeft <= 2 ? 'var(--vermelho)' : 'var(--roxo-light)',
              animation: 'countPulse 0.5s ease infinite',
              marginBottom: 4,
            }}>
              {timeLeft}s
            </div>

            <div style={{
              fontFamily: "'Bangers', cursive",
              fontSize: 22, letterSpacing: 3,
              color: 'var(--text-muted)', marginBottom: 20,
              minHeight: 36,
            }}>
              {hypeMsg}
            </div>

            <div style={{
              display: 'flex', flexWrap: 'wrap',
              gap: 16, justifyContent: 'center',
            }}>
              {players.map(p => (
                <div key={p.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  <button
                    style={{
                      width: 130, height: 130, borderRadius: 24,
                      background: `linear-gradient(135deg, var(--roxo-dark), var(--roxo))`,
                      border: '3px solid var(--roxo-light)',
                      color: 'white', cursor: 'pointer',
                      fontFamily: "'Bangers', cursive",
                      fontSize: 18, letterSpacing: 2,
                      transition: 'transform 0.05s',
                      userSelect: 'none', WebkitUserSelect: 'none',
                      boxShadow: '0 0 20px var(--roxo-glow)',
                      display: 'flex', flexDirection: 'column',
                      alignItems: 'center', justifyContent: 'center', gap: 4,
                    }}
                    onPointerDown={e => {
                      e.currentTarget.style.transform = 'scale(0.92)';
                      handleClick(p.id);
                    }}
                    onPointerUp={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                  >
                    <span style={{ fontSize: 28 }}>🍔</span>
                    <span>{p.name.toUpperCase()}</span>
                  </button>
                  <div style={{
                    fontFamily: "'Bangers', cursive",
                    fontSize: 28, color: 'var(--roxo-light)', letterSpacing: 2,
                  }}>
                    {clicks[p.id] || 0}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RESULT */}
        {phase === 'result' && winner && (
          <div>
            <div style={{ fontSize: 60, marginBottom: 8 }}>🎉👑🎉</div>
            <div style={{
              fontFamily: "'Bangers', cursive",
              fontSize: 52, letterSpacing: 4,
              background: 'linear-gradient(135deg, var(--roxo-light), #fff)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              marginBottom: 4,
            }}>
              {winner.name.toUpperCase()} GANHOU!!
            </div>
            <div style={{
              fontSize: 16, color: 'var(--text-muted)', marginBottom: 20,
            }}>
              🍔 O burger extra vai pro gostoso com <strong style={{ color: 'var(--roxo-light)' }}>
                {winner.clicks} cliques
              </strong>!
            </div>

            {/* Placar final */}
            <div style={{ marginBottom: 24 }}>
              {players
                .map(p => ({ ...p, c: clicks[p.id] || 0 }))
                .sort((a, b) => b.c - a.c)
                .map((p, i) => (
                  <div key={p.id} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '8px 16px', margin: '4px 0',
                    background: p.id === winner.id ? 'var(--roxo-bg)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${p.id === winner.id ? 'var(--roxo-border)' : 'transparent'}`,
                    borderRadius: 10,
                  }}>
                    <span style={{ fontFamily: "'Bangers', cursive", fontSize: 22, width: 30 }}>
                      {i === 0 ? '👑' : `#${i + 1}`}
                    </span>
                    <span style={{ flex: 1, fontWeight: 600, textAlign: 'left' }}>{p.name}</span>
                    <span style={{
                      fontFamily: "'Bangers', cursive", fontSize: 22,
                      color: p.id === winner.id ? 'var(--roxo-light)' : 'var(--text-muted)',
                    }}>
                      {p.c} cliques
                    </span>
                  </div>
                ))
              }
            </div>

            <button
              onClick={handleConfirm}
              style={{
                fontFamily: "'Bangers', cursive",
                fontSize: 22, letterSpacing: 3, padding: '14px 40px',
                background: 'linear-gradient(135deg, var(--roxo-dark), var(--roxo-light))',
                border: 'none', borderRadius: 12, color: 'white',
                cursor: 'pointer', width: '100%',
                animation: 'glowPulse 2s infinite',
              }}
            >
              🍔 CONFIRMAR VENCEDOR 🍔
            </button>
          </div>
        )}

        {phase !== 'result' && phase !== 'playing' && (
          <button
            onClick={onClose}
            style={{
              marginTop: 20, background: 'none',
              border: '1px solid var(--roxo-border)', borderRadius: 10,
              color: 'var(--text-muted)', padding: '8px 20px', cursor: 'pointer',
            }}
          >
            Cancelar
          </button>
        )}
      </div>
    </div>
  );
}
