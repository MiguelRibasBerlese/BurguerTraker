// Confetti — partículas coloridas ao adicionar burger

import { useMemo } from 'react'

const CORES = [
  '#8547e4', '#a66df7', '#6a30c4',
  '#00e676', '#ff3d3d', '#ffffff',
  '#cc44ff', '#44ffcc',
];

const TOTAL_PARTICULAS = 60;

export default function Confetti() {
  const particles = useMemo(() => {
    return Array.from({ length: TOTAL_PARTICULAS }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.8,
      duration: 1.5 + Math.random() * 1.5,
      size: 6 + Math.random() * 10,
      color: CORES[Math.floor(Math.random() * CORES.length)],
      rotate: Math.random() * 360,
      shape: Math.random() > 0.5 ? 'circle' : 'square',
    }));
  }, []);

  return (
    <div style={{
      position: 'fixed', inset: 0,
      pointerEvents: 'none', zIndex: 200,
      overflow: 'hidden',
    }}>
      {particles.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.left}%`,
            top: -20,
            width: p.size,
            height: p.size,
            background: p.color,
            borderRadius: p.shape === 'circle' ? '50%' : '2px',
            transform: `rotate(${p.rotate}deg)`,
            animation: `confettiFall ${p.duration}s ease ${p.delay}s forwards`,
            opacity: 0.9,
            boxShadow: `0 0 6px ${p.color}`,
          }}
        />
      ))}
    </div>
  );
}
