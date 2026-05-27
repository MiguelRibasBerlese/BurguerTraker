import { useState, useEffect, useCallback } from 'react'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import StatsBar from './components/StatsBar'
import ProgressBar from './components/ProgressBar'
import MemberGrid from './components/MemberGrid'
import MiniGame from './components/MiniGame'
import RulesPopup from './components/RulesPopup'
import AddMemberModal from './components/AddMemberModal'
import MonthWarning from './components/MonthWarning'
import Confetti from './components/Confetti'

const TOTAL = 15;
const MEMBROS_INICIAIS = ['Lucas', 'Bela', 'Miguel', 'Soluço', 'Sofia', 'Gustavo', 'Matheus'];

// Carrega estado inicial e verifica virada de mês
function initState() {
  const mesAtual = new Date().toISOString().slice(0, 7);
  const mesAnterior = localStorage.getItem('burger_last_month');

  let members = JSON.parse(localStorage.getItem('burger_members') || 'null');
  const history = JSON.parse(localStorage.getItem('burger_winners_history') || '[]');

  if (!members) {
    members = MEMBROS_INICIAIS.map((name, i) => ({
      id: Date.now() + i, name, burgers: 0, wonLastMonth: false
    }));
  }

  // Reseta contadores na virada de mês
  if (mesAnterior && mesAnterior !== mesAtual) {
    members = members.map(m => ({ ...m, burgers: 0, wonLastMonth: false }));
  }

  localStorage.setItem('burger_last_month', mesAtual);
  localStorage.setItem('burger_members', JSON.stringify(members));

  return { members, history };
}

export default function App() {
  const [members, setMembersRaw] = useState(() => initState().members);
  const [history, setHistoryRaw] = useState(() =>
    JSON.parse(localStorage.getItem('burger_winners_history') || '[]')
  );
  const [showAdd, setShowAdd] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [showGame, setShowGame] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [confetti, setConfetti] = useState(false);

  const perPerson = Math.floor(TOTAL / (members.length || 1));
  const extra = TOTAL % (members.length || 1);
  const totalComidos = members.reduce((s, m) => s + m.burgers, 0);

  // Verifica aviso de último dia do mês (1x por dia)
  useEffect(() => {
    const hoje = new Date();
    const ultimoDia = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0).getDate();
    const hojeStr = hoje.toISOString().slice(0, 10);
    const jaVisto = localStorage.getItem('burger_warning_shown');
    if (hoje.getDate() === ultimoDia && jaVisto !== hojeStr) {
      setShowWarning(true);
    }
  }, []);

  const setMembers = useCallback((next) => {
    setMembersRaw(prev => {
      const val = typeof next === 'function' ? next(prev) : next;
      localStorage.setItem('burger_members', JSON.stringify(val));
      return val;
    });
  }, []);

  const setHistory = useCallback((next) => {
    setHistoryRaw(prev => {
      const val = typeof next === 'function' ? next(prev) : next;
      localStorage.setItem('burger_winners_history', JSON.stringify(val));
      return val;
    });
  }, []);

  const addBurger = (id) => {
    setMembers(prev => prev.map(m =>
      m.id === id && m.burgers < perPerson ? { ...m, burgers: m.burgers + 1 } : m
    ));
    setConfetti(true);
    setTimeout(() => setConfetti(false), 2500);
  };

  const removeBurger = (id) => {
    setMembers(prev => prev.map(m =>
      m.id === id && m.burgers > 0 ? { ...m, burgers: m.burgers - 1 } : m
    ));
  };

  const removeMember = (id) => {
    setMembers(prev => prev.filter(m => m.id !== id));
  };

  const addMember = (name) => {
    setMembers(prev => [...prev, { id: Date.now(), name: name.trim(), burgers: 0, wonLastMonth: false }]);
    setShowAdd(false);
  };

  const onReset = () => {
    setHistory([]);
    setMembers(prev => prev.map(m => ({ ...m, wonLastMonth: false })));
  };

  const onGameOver = (winner) => {
    const mes = new Date().toISOString().slice(0, 7);
    setHistory(prev => [{ name: winner.name, month: mes }, ...prev]);
    setMembers(prev => prev.map(m => ({
      ...m,
      burgers: m.id === winner.id ? m.burgers + 1 : m.burgers,
      wonLastMonth: m.id === winner.id
    })));
    setShowGame(false);
  };

  const eligiblePlayers = members.filter(m => !m.wonLastMonth);

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', position: 'relative', zIndex: 1 }}>

      {/* Overlay mobile para fechar sidebar */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
            zIndex: 20, backdropFilter: 'blur(2px)'
          }}
        />
      )}

      <Sidebar
        history={history}
        onAddMember={() => setShowAdd(true)}
        onReset={onReset}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main style={{
        flex: 1, overflowY: 'auto', padding: '24px',
        display: 'flex', flexDirection: 'column', gap: '24px'
      }}>
        <Header onMenuToggle={() => setSidebarOpen(o => !o)} />

        <StatsBar
          total={TOTAL}
          comidos={totalComidos}
          perPerson={perPerson}
          extra={extra}
          numMembers={members.length}
        />

        <ProgressBar total={TOTAL} comidos={totalComidos} />

        <MemberGrid
          members={members}
          perPerson={perPerson}
          onAdd={addBurger}
          onRemove={removeBurger}
          onDelete={removeMember}
        />

        {extra > 0 && (
          <button
            className="btn-game"
            onClick={() => setShowRules(true)}
            aria-label="Disputar o burger extra"
          >
            🎰 DISPUTAR O BURGER EXTRA 🎰
          </button>
        )}
      </main>

      {confetti && <Confetti />}

      {showWarning && (
        <MonthWarning
          restantes={TOTAL - totalComidos}
          onClose={() => {
            localStorage.setItem('burger_warning_shown', new Date().toISOString().slice(0, 10));
            setShowWarning(false);
          }}
        />
      )}

      {showAdd && <AddMemberModal onAdd={addMember} onClose={() => setShowAdd(false)} />}

      {showRules && (
        <RulesPopup
          members={members}
          eligiblePlayers={eligiblePlayers}
          onStart={() => { setShowRules(false); setShowGame(true); }}
          onCancel={() => setShowRules(false)}
        />
      )}

      {showGame && (
        <MiniGame
          players={eligiblePlayers}
          onGameOver={onGameOver}
          onClose={() => setShowGame(false)}
        />
      )}

      <style>{`
        .btn-game {
          font-family: 'Bangers', cursive;
          font-size: 28px;
          letter-spacing: 3px;
          padding: 22px 40px;
          background: linear-gradient(135deg, var(--roxo-dark), var(--roxo), var(--roxo-light));
          border: none; border-radius: 16px; color: white; cursor: pointer;
          width: 100%; margin-bottom: 16px;
          animation: glowPulse 2s ease-in-out infinite;
          transition: transform 0.15s;
        }
        .btn-game:hover { transform: scale(1.02); }
        .btn-game:active { transform: scale(0.97); }
        @media (max-width: 768px) {
          main { padding: 12px !important; gap: 16px !important; }
          .btn-game { font-size: 20px; padding: 16px 20px; }
        }
      `}</style>
    </div>
  );
}
