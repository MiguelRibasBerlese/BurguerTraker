// MemberGrid — grade de cards dos membros

import MemberCard from './MemberCard'

export default function MemberGrid({ members, perPerson, onAdd, onRemove, onDelete }) {
  if (members.length === 0) {
    return (
      <div style={{
        textAlign: 'center', padding: '40px 20px',
        color: 'var(--text-muted)', fontSize: 16, lineHeight: 1.7,
      }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>👻</div>
        <div>Nenhum funcionário cadastrado.</div>
        <div style={{ fontSize: 13, marginTop: 4 }}>Adicione alguém pela sidebar!</div>
      </div>
    );
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
      gap: 16,
    }}>
      {members.map((member, i) => (
        <MemberCard
          key={member.id}
          member={member}
          perPerson={perPerson}
          delay={i * 0.07}
          onAdd={() => onAdd(member.id)}
          onRemove={() => onRemove(member.id)}
          onDelete={() => onDelete(member.id)}
        />
      ))}
    </div>
  );
}
