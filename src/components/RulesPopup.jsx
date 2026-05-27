// RulesPopup — popup de regras antes do minigame

export default function RulesPopup({ members, eligiblePlayers, onStart, onCancel }) {
  const blocked = members.filter(m => m.wonLastMonth);

  return (
    <div className="modal-overlay">
      <div className="modal-box" style={{ maxWidth: 520 }}>

        {/* Ícone e título */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{
            fontSize: 52, marginBottom: 8,
            animation: 'pulse 1s ease infinite',
          }}>
            🍔🎰🍔
          </div>
          <div style={{
            fontFamily: "'Bangers', cursive",
            fontSize: 38, letterSpacing: 4,
            background: 'linear-gradient(135deg, var(--roxo-light), #fff)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            MINIGAME DO BURGER EXTRA
          </div>
        </div>

        {/* Regras */}
        <div style={{
          background: 'var(--roxo-bg)', border: '1px solid var(--roxo-border)',
          borderRadius: 14, padding: '16px 20px', marginBottom: 16,
        }}>
          <div style={{
            fontSize: 13, letterSpacing: 3, color: 'var(--text-muted)',
            textTransform: 'uppercase', marginBottom: 12,
          }}>
            📋 AS REGRAS
          </div>
          {[
            ['🍔', 'Sobrou 1 hambúrguer na divisão do mês'],
            ['⚡', 'Você terá 5 segundos para clicar o máximo possível'],
            ['🏆', 'Quem fizer mais cliques ganha o burger extra'],
            ['🚫', 'Quem ganhou NÃO pode disputar no mês seguinte'],
            ['👆', 'Cada jogador tem seu próprio botão na tela'],
          ].map(([icon, text]) => (
            <div key={text} style={{
              display: 'flex', gap: 12, alignItems: 'flex-start',
              marginBottom: 8, fontSize: 14, lineHeight: 1.5,
            }}>
              <span style={{ fontSize: 20, flexShrink: 0 }}>{icon}</span>
              <span style={{ color: 'var(--text)' }}>{text}</span>
            </div>
          ))}
        </div>

        {/* Jogadores elegíveis */}
        <div style={{ marginBottom: 16 }}>
          <div style={{
            fontSize: 11, letterSpacing: 3, color: 'var(--text-muted)',
            textTransform: 'uppercase', marginBottom: 8,
          }}>
            ✅ VÃO JOGAR ({eligiblePlayers.length})
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {eligiblePlayers.map(p => (
              <span key={p.id} style={{
                background: 'var(--roxo-bg)', border: '1px solid var(--roxo-border)',
                borderRadius: 8, padding: '4px 12px',
                color: 'var(--roxo-light)', fontWeight: 600, fontSize: 14,
              }}>
                {p.name}
              </span>
            ))}
          </div>
        </div>

        {/* Bloqueados */}
        {blocked.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div style={{
              fontSize: 11, letterSpacing: 3, color: '#ff6b6b',
              textTransform: 'uppercase', marginBottom: 8,
            }}>
              🚫 BLOQUEADOS (venceram no mês passado)
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {blocked.map(p => (
                <span key={p.id} style={{
                  background: 'rgba(255,61,61,0.1)',
                  border: '1px solid rgba(255,61,61,0.3)',
                  borderRadius: 8, padding: '4px 12px',
                  color: '#ff6b6b', fontWeight: 600, fontSize: 14,
                }}>
                  👑 {p.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Aviso se não tiver jogadores suficientes */}
        {eligiblePlayers.length < 2 && (
          <div style={{
            background: 'rgba(255,61,61,0.1)', border: '1px solid rgba(255,61,61,0.3)',
            borderRadius: 10, padding: '10px 14px', marginBottom: 16,
            fontSize: 13, color: '#ff6b6b',
          }}>
            ⚠️ Precisa de pelo menos 2 jogadores elegíveis para disputar!
          </div>
        )}

        {/* Botões */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1, padding: '12px 0',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 12, color: 'var(--text-muted)',
              cursor: 'pointer', fontWeight: 600, fontSize: 15,
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
          >
            Cancelar
          </button>

          <button
            onClick={eligiblePlayers.length >= 2 ? onStart : undefined}
            disabled={eligiblePlayers.length < 2}
            style={{
              flex: 2, padding: '12px 0',
              background: eligiblePlayers.length >= 2
                ? 'linear-gradient(135deg, var(--roxo-dark), var(--roxo-light))'
                : 'rgba(255,255,255,0.05)',
              border: 'none', borderRadius: 12, color: 'white',
              cursor: eligiblePlayers.length >= 2 ? 'pointer' : 'not-allowed',
              fontFamily: "'Bangers', cursive",
              fontSize: 22, letterSpacing: 3,
              animation: eligiblePlayers.length >= 2 ? 'glowPulse 2s infinite' : 'none',
              opacity: eligiblePlayers.length < 2 ? 0.5 : 1,
            }}
          >
            🎰 BORA JOGAR!
          </button>
        </div>
      </div>
    </div>
  );
}
