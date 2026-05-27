// StatsBar — cards de estatísticas do mês

function StatCard({ label, value, icon, accent, delay = 0 }) {
  return (
    <div style={{
      background: 'var(--bg-card)',
      border: `1px solid ${accent ? 'var(--roxo-border)' : 'rgba(255,255,255,0.06)'}`,
      borderRadius: 16, padding: '16px 20px',
      display: 'flex', flexDirection: 'column', gap: 4,
      flex: '1 1 120px',
      animation: `fadeInUp 0.5s ease ${delay}s both`,
      boxShadow: accent ? '0 0 20px var(--roxo-glow)' : 'none',
      transition: 'transform 0.2s, box-shadow 0.2s',
      cursor: 'default',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.transform = 'translateY(-3px)';
      e.currentTarget.style.boxShadow = '0 8px 30px var(--roxo-glow)';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = accent ? '0 0 20px var(--roxo-glow)' : 'none';
    }}
    >
      <div style={{ fontSize: 22 }}>{icon}</div>
      <div style={{
        fontFamily: "'Bangers', cursive",
        fontSize: 36, letterSpacing: 2,
        color: accent ? 'var(--roxo-light)' : 'var(--text)',
        lineHeight: 1,
      }}>{value}</div>
      <div style={{
        fontSize: 11, letterSpacing: 2,
        color: 'var(--text-muted)', textTransform: 'uppercase',
      }}>{label}</div>
    </div>
  );
}

export default function StatsBar({ total, comidos, perPerson, extra, numMembers }) {
  const restantes = total - comidos;

  return (
    <div style={{
      display: 'flex', flexWrap: 'wrap', gap: 12,
    }}>
      <StatCard label="Total do Mês" value={total}    icon="📦" delay={0}    />
      <StatCard label="Comidos"      value={comidos}  icon="😋" delay={0.05} accent={comidos > 0} />
      <StatCard label="Restantes"    value={restantes}icon="⏳" delay={0.10} />
      <StatCard label="Por Pessoa"   value={perPerson}icon="👤" delay={0.15} />
      {extra > 0 && (
        <StatCard label="Extra 🎰"   value={extra}    icon="🍔" delay={0.20} accent />
      )}
    </div>
  );
}
