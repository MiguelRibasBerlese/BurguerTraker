// Header — título gigante com glow e botão hamburger no mobile

export default function Header({ onMenuToggle }) {
  return (
    <>
      <style>{`
        .header-wrap {
          text-align: center; position: relative;
          padding: 16px 0 8px;
        }
        .header-title {
          font-family: 'Bangers', cursive;
          font-size: clamp(48px, 8vw, 96px);
          letter-spacing: 6px; line-height: 1;
          background: linear-gradient(135deg, #fff 0%, var(--roxo-light) 50%, var(--roxo) 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          text-shadow: none;
          filter: drop-shadow(0 0 30px var(--roxo-glow));
          animation: fadeInUp 0.6s ease both;
        }
        .header-sub {
          font-size: clamp(11px, 2vw, 14px);
          letter-spacing: 4px; color: var(--text-muted);
          text-transform: uppercase; margin-top: 8px;
          animation: fadeInUp 0.6s ease 0.1s both;
        }
        .header-emojis {
          font-size: clamp(20px, 4vw, 32px);
          margin: 8px 0 0;
          animation: fadeInUp 0.6s ease 0.2s both;
        }
        .header-glow {
          position: absolute; inset: -40px -80px;
          background: radial-gradient(ellipse at center, var(--roxo-glow) 0%, transparent 70%);
          pointer-events: none; z-index: -1; opacity: 0.5;
        }
        .menu-btn {
          display: none;
          position: absolute; left: 0; top: 20px;
          background: var(--roxo-bg); border: 1px solid var(--roxo-border);
          color: var(--text); border-radius: 10px; padding: 8px 12px;
          cursor: pointer; font-size: 22px; line-height: 1;
          transition: all 0.2s;
        }
        .menu-btn:hover { background: var(--roxo); }
        @media (max-width: 768px) {
          .menu-btn { display: flex; align-items: center; justify-content: center; }
          .header-wrap { padding-top: 20px; }
        }
      `}</style>

      <div className="header-wrap">
        <div className="header-glow" />

        <button className="menu-btn" onClick={onMenuToggle} aria-label="Abrir menu">
          ☰
        </button>

        <div className="header-emojis">🍔🔥🍔🔥🍔</div>

        <h1 className="header-title">BURGER TRACKER</h1>

        <div className="header-sub">
          Sistema Zueiro da LINKA™ · Powered by Fome
        </div>
      </div>
    </>
  );
}
