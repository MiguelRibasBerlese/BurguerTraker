// Sidebar — histórico de vencedores + botão novo funcionário + reset de dados

const MESES_PT = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];

function formatMonth(monthStr) {
  const [year, month] = monthStr.split('-');
  return `${MESES_PT[parseInt(month) - 1]}/${year}`;
}

export default function Sidebar({ history, onAddMember, onReset, isOpen, onClose }) {
  return (
    <>
      <style>{`
        .sidebar {
          width: 280px; min-width: 280px;
          background: var(--bg-sidebar);
          border-right: 1px solid var(--roxo-border);
          display: flex; flex-direction: column;
          height: 100vh; position: sticky; top: 0; z-index: 30;
        }
        @media (max-width: 768px) {
          .sidebar {
            position: fixed; left: 0; top: 0;
            transform: translateX(-100%);
            transition: transform 0.3s ease;
            box-shadow: 4px 0 40px rgba(0,0,0,0.8);
          }
          .sidebar[data-open="true"] { transform: translateX(0); }
          .sidebar-close-btn { display: flex !important; }
        }
      `}</style>

      <aside className="sidebar" data-open={isOpen ? 'true' : 'false'}>

        {/* Cabeçalho com logo */}
        <div style={{
          padding: '28px 20px 20px', borderBottom: '1px solid var(--roxo-border)',
          textAlign: 'center', flexShrink: 0, position: 'relative',
        }}>
          <div style={{
            fontFamily: "'Bangers', cursive", fontSize: 36, letterSpacing: 4,
            background: 'linear-gradient(135deg, var(--roxo-light), var(--roxo))',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1,
          }}>🍔 BURGER</div>
          <div style={{
            fontFamily: "'Bangers', cursive", fontSize: 28, letterSpacing: 4,
            color: 'var(--roxo-light)', lineHeight: 1, marginTop: 2,
          }}>TRACKER</div>
          <div style={{
            fontSize: 10, letterSpacing: 3, color: 'var(--text-muted)',
            marginTop: 6, textTransform: 'uppercase',
          }}>LINKA 🔥</div>

          <button
            onClick={onClose} aria-label="Fechar menu"
            className="sidebar-close-btn"
            style={{
              position: 'absolute', top: 12, right: 12, display: 'none',
              background: 'var(--roxo-bg)', border: '1px solid var(--roxo-border)',
              color: 'var(--text)', borderRadius: 8, padding: '4px 10px',
              cursor: 'pointer', fontSize: 18, alignItems: 'center', justifyContent: 'center',
            }}
          >✕</button>
        </div>

        {/* Placar de vencedores */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
          <div style={{
            fontSize: 11, letterSpacing: 3, color: 'var(--text-muted)',
            textTransform: 'uppercase', marginBottom: 12,
          }}>👑 HALL DA FAMA</div>

          {history.length === 0 ? (
            <div style={{
              color: 'var(--text-muted)', fontSize: 13, textAlign: 'center',
              padding: '20px 0', lineHeight: 1.7,
            }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🏜️</div>
              Nenhuma disputa ainda.<br />Sejam os primeiros!
            </div>
          ) : (
            history.map((entry, i) => (
              <div key={i} style={{
                background: 'var(--roxo-bg)', border: '1px solid var(--roxo-border)',
                borderRadius: 12, padding: '10px 12px', marginBottom: 8,
                animation: `fadeInUp 0.4s ease ${i * 0.05}s both`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 18 }}>👑</span>
                  <span style={{ fontWeight: 700, color: 'var(--roxo-light)', fontSize: 15, flex: 1 }}>
                    {entry.name}
                  </span>
                </div>
                <div style={{
                  marginTop: 4, fontSize: 12, color: 'var(--text-muted)',
                  textAlign: 'right',
                }}>
                  {formatMonth(entry.month)}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Rodapé — novo funcionário + reset */}
        <div style={{ padding: 16, borderTop: '1px solid var(--roxo-border)', flexShrink: 0 }}>
          <button
            onClick={onAddMember}
            style={{
              width: '100%', padding: '12px 0',
              background: 'var(--roxo-bg)', border: '1px solid var(--roxo-border)',
              borderRadius: 12, color: 'var(--roxo-light)', fontWeight: 600,
              fontSize: 14, letterSpacing: 1, cursor: 'pointer', transition: 'all 0.2s',
              marginBottom: 8,
            }}
            onMouseEnter={e => Object.assign(e.currentTarget.style, { background: 'var(--roxo)', color: '#fff' })}
            onMouseLeave={e => Object.assign(e.currentTarget.style, { background: 'var(--roxo-bg)', color: 'var(--roxo-light)' })}
          >
            ➕ NOVO FUNCIONÁRIO
          </button>

          <button
            onClick={() => {
              if (window.confirm('Resetar histórico de sorteios e desbloquear todos? (útil para testes)')) {
                onReset();
              }
            }}
            style={{
              width: '100%', padding: '8px 0',
              background: 'transparent', border: '1px solid rgba(255,61,61,0.2)',
              borderRadius: 10, color: 'rgba(255,107,107,0.6)',
              fontSize: 12, letterSpacing: 1, cursor: 'pointer', transition: 'all 0.2s',
            }}
            onMouseEnter={e => Object.assign(e.currentTarget.style, { borderColor: 'rgba(255,61,61,0.5)', color: '#ff6b6b' })}
            onMouseLeave={e => Object.assign(e.currentTarget.style, { borderColor: 'rgba(255,61,61,0.2)', color: 'rgba(255,107,107,0.6)' })}
          >
            🔄 Resetar Dados
          </button>
        </div>
      </aside>
    </>
  );
}
