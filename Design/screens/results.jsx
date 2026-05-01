/* global React */
function ResultsScreen({ onDone, onHome, tweaks }) {
  const [showConfetti, setShowConfetti] = React.useState(false);
  React.useEffect(() => {
    const t = setTimeout(() => setShowConfetti(true), 400);
    return () => clearTimeout(t);
  }, []);

  const stats = [
    { l: 'XP earned', v: '+85', c: 'var(--coral)' },
    { l: 'Accuracy', v: '4/5', c: 'var(--gold)' },
    { l: 'Streak', v: '8 🔥', c: 'var(--coral-soft)' },
    { l: 'Time', v: '4:12', c: 'var(--cream)' },
  ];

  return (
    <div className="screen felt-bg" style={{ background: 'var(--felt)', overflowY: 'auto' }}>
      <Confetti active={showConfetti} />

      <div style={{ padding: '70px 28px 32px', textAlign: 'center', position: 'relative' }}>
        <div className="anim-pop" style={{ fontSize: 64, animation: 'pop 600ms cubic-bezier(.34,1.56,.64,1) both' }}>🃏</div>
        <div className="eyebrow anim-float" style={{ marginTop: 12, color: 'var(--gold)', animationDelay: '200ms' }}>Session complete</div>
        <h1 className="h-display anim-float" style={{ marginTop: 8, fontSize: 56, animationDelay: '300ms' }}>
          <em className="serif" style={{color:'var(--coral-soft)'}}>Sharp</em><br/>play, dealer.
        </h1>
        <p className="anim-float" style={{ fontSize: 15, color: 'var(--cream-dim)', marginTop: 12, animationDelay: '400ms' }}>
          You're calibrated 18% better than yesterday.
        </p>
      </div>

      {/* Stats grid */}
      <div style={{ padding: '0 20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {stats.map((s, i) => (
          <div key={s.l} className="anim-float" style={{ animationDelay: `${500 + i*80}ms`, padding: 18, background: 'rgba(245,233,212,0.04)', border: '1px solid var(--hairline)', borderRadius: 18 }}>
            <div className="eyebrow">{s.l}</div>
            <div className="serif" style={{ fontSize: 32, marginTop: 4, color: s.c, lineHeight: 1 }}>{s.v}</div>
          </div>
        ))}
      </div>

      {/* Insight card */}
      <div className="anim-float" style={{ margin: '20px 20px 0', padding: 22, borderRadius: 22, background: 'linear-gradient(180deg, rgba(233,185,73,0.12), rgba(233,185,73,0.03))', border: '1px solid rgba(233,185,73,0.3)', animationDelay: '900ms' }}>
        <div className="eyebrow" style={{ color: 'var(--gold)' }}>The Read · Insight</div>
        <div className="serif" style={{ fontSize: 22, marginTop: 6, lineHeight: 1.15 }}>
          You bluff-catch <em style={{color:'var(--gold-soft)'}}>too rarely</em> on the river.
        </div>
        <div style={{ fontSize: 13, color: 'var(--cream-dim)', marginTop: 8 }}>
          When opponents over-bet rivers, you fold 78% of the time. The math says 55% is closer to optimal.
        </div>
        <button className="btn btn-ghost" style={{ width: '100%', marginTop: 14, fontSize: 14, padding: '12px' }} onClick={onHome}>
          Drill this tomorrow →
        </button>
      </div>

      {/* Achievement */}
      <div className="anim-float" style={{ margin: '14px 20px 0', padding: 16, borderRadius: 18, background: 'rgba(255,91,72,0.1)', border: '1px solid rgba(255,91,72,0.3)', display: 'flex', alignItems: 'center', gap: 14, animationDelay: '1100ms' }}>
        <div style={{ width: 48, height: 48, borderRadius: 14, background: 'linear-gradient(135deg, var(--coral), var(--gold))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🏅</div>
        <div style={{ flex: 1 }}>
          <div className="eyebrow" style={{ color: 'var(--coral-soft)' }}>Achievement unlocked</div>
          <div style={{ fontSize: 15, fontWeight: 600, marginTop: 2 }}>Week One Wonder</div>
          <div style={{ fontSize: 12, color: 'var(--cream-dim)' }}>7-day streak. Keep going.</div>
        </div>
        <div className="mono" style={{ fontSize: 13, color: 'var(--coral-soft)', fontWeight: 700 }}>+25 XP</div>
      </div>

      <div style={{ padding: '20px 20px 32px' }}>
        <button className="btn btn-primary" style={{ width: '100%' }} onClick={onHome}>
          Done · See you tomorrow
        </button>
        <button className="btn btn-ghost" style={{ width: '100%', marginTop: 8, padding: '12px' }} onClick={onDone}>
          Share session
        </button>
      </div>
    </div>
  );
}

window.ResultsScreen = ResultsScreen;
