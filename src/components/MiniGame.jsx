// MiniGame — sorteio automático do burger extra com efeito de roleta

import { useState, useRef, useCallback } from 'react'

// Velocidade das trocas de nome na roleta (ms por frame, acelerando → desacelerando)
const SPIN_INTERVALS = [70, 70, 80, 90, 100, 120, 150, 190, 240, 310, 400, 520, 680, 900, 1100];

const HYPE_SPIN = ['🔥 GIRANDO...', '⚡ QUEM VAI SER?!', '💀 TÁ QUASE...', '🎰 SORTEANDO...', '🤯 SUSPENSE!!'];
const HYPE_WIN  = ['PARABÉNS SORTUDO!!', 'O DESTINO ESCOLHEU!!', 'ERA ESCRITO!!', 'MERECEU DEMAIS!!'];

export default function MiniGame({ players, onGameOver, onClose }) {
  const [phase, setPhase]     = useState('ready');   // ready | spinning | result
  const [current, setCurrent] = useState(players[0]);
  const [winner, setWinner]   = useState(null);
  const [hype, setHype]       = useState('');
  const frameRef = useRef(0);
  const hypeRef  = useRef(null);

  const startSpin = useCallback(() => {
    if (players.length === 0) return;

    // Escolhe o vencedor antes de começar a animação
    const chosen = players[Math.floor(Math.random() * players.length)];
    setPhase('spinning');

    // Troca mensagem de hype durante a roleta
    let hi = 0;
    setHype(HYPE_SPIN[0]);
    hypeRef.current = setInterval(() => {
      hi = (hi + 1) % HYPE_SPIN.length;
      setHype(HYPE_SPIN[hi]);
    }, 600);

    // Anima os nomes ciclando, depois para no vencedor
    let idx = 0;
    const tick = (frameIdx) => {
      idx = (idx + 1) % players.length;
      setCurrent(players[idx]);

      if (frameIdx < SPIN_INTERVALS.length - 1) {
        setTimeout(() => tick(frameIdx + 1), SPIN_INTERVALS[frameIdx + 1]);
      } else {
        // Fim: mostra o vencedor
        clearInterval(hypeRef.current);
        setCurrent(chosen);
        setWinner(chosen);
        setPhase('result');
      }
    };

    setTimeout(() => tick(0), SPIN_INTERVALS[0]);
  }, [players]);

  const handleConfirm = () => onGameOver(winner);

  return (
    <div className="modal-overlay">
      <div className="modal-box" style={{ maxWidth: 520, textAlign: 'center' }}>

        {/* READY — botão único para iniciar o sorteio */}
        {phase === 'ready' && (
          <div>
            <div style={{ fontSize: 56, marginBottom: 12, animation: 'pulse 1s ease infinite' }}>
              🎰
            </div>
            <div style={{
              fontFamily: "'Bangers', cursive",
              fontSize: 34, letterSpacing: 4,
              background: 'linear-gradient(135deg, var(--roxo-light), #fff)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              marginBottom: 8,
            }}>
              SORTEIO DO BURGER EXTRA
            </div>
            <div style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 28, lineHeight: 1.6 }}>
              {players.length} participante{players.length !== 1 ? 's' : ''} disputando o burger extra.<br />
              O destino vai decidir quem leva!
            </div>

            {/* Lista de participantes */}
            <div style={{
              display: 'flex', flexWrap: 'wrap', gap: 8,
              justifyContent: 'center', marginBottom: 32,
            }}>
              {players.map(p => (
                <span key={p.id} style={{
                  background: 'var(--roxo-bg)', border: '1px solid var(--roxo-border)',
                  borderRadius: 8, padding: '6px 14px',
                  color: 'var(--roxo-light)', fontWeight: 600, fontSize: 15,
                }}>
                  {p.name}
                </span>
              ))}
            </div>

            <button
              onClick={startSpin}
              style={{
                width: '100%', padding: '20px 0',
                background: 'linear-gradient(135deg, var(--roxo-dark), var(--roxo), var(--roxo-light))',
                border: 'none', borderRadius: 14, color: 'white',
                fontFamily: "'Bangers', cursive",
                fontSize: 28, letterSpacing: 4,
                cursor: 'pointer',
                animation: 'glowPulse 2s ease infinite',
                transition: 'transform 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              🎰 SORTEAR O VENCEDOR!
            </button>

            <button
              onClick={onClose}
              style={{
                marginTop: 12, background: 'none',
                border: '1px solid var(--roxo-border)', borderRadius: 10,
                color: 'var(--text-muted)', padding: '8px 20px',
                cursor: 'pointer', width: '100%', fontSize: 14,
              }}
            >
              Cancelar
            </button>
          </div>
        )}

        {/* SPINNING — roleta girando */}
        {phase === 'spinning' && (
          <div>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🎰</div>

            <div style={{
              fontFamily: "'Bangers', cursive",
              fontSize: 16, letterSpacing: 4,
              color: 'var(--text-muted)', marginBottom: 12,
            }}>
              {hype}
            </div>

            {/* Nome girando */}
            <div style={{
              background: 'var(--roxo-bg)', border: '2px solid var(--roxo-border)',
              borderRadius: 16, padding: '28px 32px', marginBottom: 12,
              boxShadow: '0 0 40px var(--roxo-glow)',
            }}>
              <div style={{
                fontFamily: "'Bangers', cursive",
                fontSize: 52, letterSpacing: 4,
                color: 'var(--roxo-light)',
                animation: 'countPulse 0.2s ease infinite',
                lineHeight: 1,
              }}>
                {current?.name?.toUpperCase() || '???'}
              </div>
            </div>

            <div style={{ fontSize: 28, animation: 'spin 0.4s linear infinite' }}>⚡</div>

            <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
          </div>
        )}

        {/* RESULT — vencedor revelado */}
        {phase === 'result' && winner && (
          <div>
            <div style={{ fontSize: 64, marginBottom: 8 }}>🎉👑🎉</div>

            <div style={{
              fontFamily: "'Bangers', cursive",
              fontSize: 18, letterSpacing: 4,
              color: 'var(--text-muted)', marginBottom: 4,
            }}>
              {HYPE_WIN[Math.floor(Math.random() * HYPE_WIN.length)]}
            </div>

            <div style={{
              fontFamily: "'Bangers', cursive",
              fontSize: 56, letterSpacing: 4,
              background: 'linear-gradient(135deg, var(--roxo-light), #fff)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              marginBottom: 8, lineHeight: 1,
            }}>
              {winner.name.toUpperCase()}
            </div>

            <div style={{
              fontSize: 16, color: 'var(--text-muted)', marginBottom: 28, lineHeight: 1.7,
            }}>
              🍔 O burger extra vai pro sortudo!<br />
              <span style={{ color: '#ff6b6b', fontSize: 13 }}>
                ⚠️ {winner.name} não participa no mês que vem.
              </span>
            </div>

            <button
              onClick={handleConfirm}
              style={{
                width: '100%', padding: '16px 0',
                background: 'linear-gradient(135deg, var(--roxo-dark), var(--roxo-light))',
                border: 'none', borderRadius: 12, color: 'white',
                fontFamily: "'Bangers', cursive",
                fontSize: 24, letterSpacing: 3, cursor: 'pointer',
                animation: 'glowPulse 2s infinite',
              }}
            >
              🍔 CONFIRMAR {winner.name.toUpperCase()} COMO VENCEDOR!
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
