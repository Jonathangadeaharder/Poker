/* global React */
const { useState, useEffect, useRef, useMemo } = React;

// === Playing Card component ===
function PlayingCard({ rank, suit, faceDown, treatment = 'classic', size = 'md', delay = 0, style }) {
  const isRed = suit === '♥' || suit === '♦';
  const sizes = {
    sm: { w: 44, h: 62, rank: 18, suit: 14 },
    md: { w: 64, h: 90, rank: 26, suit: 22 },
    lg: { w: 88, h: 124, rank: 36, suit: 30 },
    xl: { w: 120, h: 168, rank: 52, suit: 42 },
  };
  const s = sizes[size];

  if (faceDown) {
    return <div className="card face-down anim-deal" style={{ width: s.w, height: s.h, animationDelay: `${delay}ms`, ...style }} />;
  }

  // Treatments
  if (treatment === 'minimal') {
    return (
      <div className={`card ${isRed ? 'red' : ''} anim-deal`} style={{ width: s.w, height: s.h, animationDelay: `${delay}ms`, padding: 0, justifyContent: 'center', alignItems: 'center', ...style }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
          <span style={{ fontSize: s.rank * 1.1, fontWeight: 800, letterSpacing: '-0.06em' }}>{rank}</span>
          <span style={{ fontSize: s.suit * 0.7 }}>{suit}</span>
        </div>
      </div>
    );
  }
  if (treatment === 'luxury') {
    return (
      <div className={`card ${isRed ? 'red' : ''} anim-deal`} style={{ width: s.w, height: s.h, animationDelay: `${delay}ms`, background: 'linear-gradient(135deg, #f5e9d4, #ede0c7)', boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.15), inset 0 0 24px rgba(180,140,80,0.15), 0 8px 16px -4px rgba(0,0,0,0.5)', ...style }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <span style={{ fontSize: s.rank, fontWeight: 700, letterSpacing: '-0.04em' }}>{rank}</span>
          <span style={{ fontSize: s.suit }}>{suit}</span>
        </div>
        <div style={{ alignSelf: 'center', fontSize: s.rank * 1.5, opacity: 0.18 }}>{suit}</div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', transform: 'rotate(180deg)' }}>
          <span style={{ fontSize: s.rank, fontWeight: 700, letterSpacing: '-0.04em' }}>{rank}</span>
          <span style={{ fontSize: s.suit }}>{suit}</span>
        </div>
      </div>
    );
  }

  // Classic (default)
  return (
    <div className={`card ${isRed ? 'red' : ''} anim-deal`} style={{ width: s.w, height: s.h, animationDelay: `${delay}ms`, ...style }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1 }}>
        <span className="rank" style={{ fontSize: s.rank }}>{rank}</span>
        <span className="suit" style={{ fontSize: s.suit, marginTop: 2 }}>{suit}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', transform: 'rotate(180deg)', lineHeight: 1 }}>
        <span className="rank" style={{ fontSize: s.rank }}>{rank}</span>
        <span className="suit" style={{ fontSize: s.suit, marginTop: 2 }}>{suit}</span>
      </div>
    </div>
  );
}

// === Top Bar ===
function TopBar({ left, center, right, onBack }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px 8px', position: 'relative', zIndex: 5 }}>
      <div style={{ minWidth: 40 }}>
        {onBack && (
          <button onClick={onBack} style={{ background: 'rgba(245,233,212,0.08)', border: '1px solid var(--hairline)', borderRadius: 999, width: 36, height: 36, color: 'var(--cream)', cursor: 'pointer', fontSize: 18, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>‹</button>
        )}
        {left}
      </div>
      <div style={{ flex: 1, textAlign: 'center', fontSize: 13, fontFamily: 'var(--mono)', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--cream-dim)' }}>{center}</div>
      <div style={{ minWidth: 40, textAlign: 'right' }}>{right}</div>
    </div>
  );
}

// === Streak Flame ===
function StreakBadge({ count }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: 'rgba(255,91,72,0.12)', border: '1px solid rgba(255,91,72,0.3)', borderRadius: 999 }}>
      <span style={{ fontSize: 14 }}>🔥</span>
      <span className="mono" style={{ fontSize: 13, fontWeight: 700, color: 'var(--coral-soft)' }}>{count}</span>
    </div>
  );
}

// === Progress Ring ===
function ProgressRing({ value, size = 64, stroke = 6, label, sublabel }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle className="ring-track" cx={size/2} cy={size/2} r={r} fill="none" strokeWidth={stroke} />
        <circle className="ring-fill" cx={size/2} cy={size/2} r={r} fill="none" strokeWidth={stroke} strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round" />
      </svg>
      {label && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span className="mono" style={{ fontSize: 16, fontWeight: 700 }}>{label}</span>
          {sublabel && <span style={{ fontSize: 10, color: 'var(--cream-dim)' }}>{sublabel}</span>}
        </div>
      )}
    </div>
  );
}

// === Confetti ===
function Confetti({ active }) {
  if (!active) return null;
  const pieces = Array.from({ length: 28 });
  const colors = ['#ff5b48', '#e9b949', '#f5e9d4', '#ff8674'];
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 30 }}>
      {pieces.map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 200;
        const dur = 1200 + Math.random() * 800;
        const rot = Math.random() * 720;
        const color = colors[i % colors.length];
        return (
          <div key={i} className="confetti-piece" style={{
            left: `${left}%`,
            top: -20,
            background: color,
            animation: `confetti-fall ${dur}ms ease-out ${delay}ms forwards`,
            transform: `rotate(${rot}deg)`,
            borderRadius: i % 3 === 0 ? '50%' : 2,
          }} />
        );
      })}
      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(800px) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

Object.assign(window, { PlayingCard, TopBar, StreakBadge, ProgressRing, Confetti });
