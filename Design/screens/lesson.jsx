/* global React */
function LessonScreen({ onComplete, onBack, tweaks }) {
  const [phase, setPhase] = React.useState('setup'); // setup -> read -> decide -> reveal
  const [confidence, setConfidence] = React.useState(60);
  const [choice, setChoice] = React.useState(null);
  const [tellMeter, setTellMeter] = React.useState(0);

  // animate tell meter during read phase
  React.useEffect(() => {
    if (phase !== 'read') return;
    let v = 0;
    const id = setInterval(() => {
      v = Math.min(100, v + 4);
      setTellMeter(v);
      if (v >= 100) clearInterval(id);
    }, 60);
    return () => clearInterval(id);
  }, [phase]);

  React.useEffect(() => {
    if (phase === 'setup') {
      const t = setTimeout(() => setPhase('read'), 1400);
      return () => clearTimeout(t);
    }
  }, [phase]);

  const choose = (c) => { setChoice(c); setPhase('reveal'); };
  const correct = choice === 'raise';

  return (
    <div className="screen felt-bg" style={{ background: 'var(--felt)' }}>
      <TopBar
        onBack={onBack}
        center="Hand 3 of 5"
        right={<div className="pill"><span style={{color:'var(--gold)'}}>●</span> +20 XP</div>}
      />

      {/* Scenario context */}
      <div style={{ padding: '4px 24px 0' }}>
        <div className="eyebrow" style={{ color: 'var(--gold)' }}>UTG · 100BB · $1/$2 NLHE</div>
        <div className="serif" style={{ fontSize: 26, lineHeight: 1.1, marginTop: 6 }}>
          {phase === 'setup' && 'Folded to you on the button.'}
          {phase === 'read' && 'Villain just min-raised. Quickly.'}
          {phase === 'decide' && 'What\'s your move?'}
          {phase === 'reveal' && (correct ? 'Nice read.' : <>Hmm. <em style={{color:'var(--coral-soft)'}}>Re-deal that one.</em></>)}
        </div>
      </div>

      {/* Table felt */}
      <div style={{ flex: 1, position: 'relative', margin: '20px 16px 0', borderRadius: 32, background: 'radial-gradient(ellipse at center, var(--felt-3) 0%, var(--felt) 70%)', border: '1px solid var(--hairline-strong)', boxShadow: 'inset 0 0 60px rgba(0,0,0,0.4)', overflow: 'hidden' }}>
        {/* opponent zone */}
        <div style={{ position: 'absolute', top: 24, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: 56, height: 56, borderRadius: 999, background: '#2a1a14', border: '2px solid var(--hairline-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🎩</div>
          <div className="mono" style={{ fontSize: 11, marginTop: 6, color: 'var(--cream-dim)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Villain · UTG</div>
          {/* Tell meter — novel */}
          {(phase === 'read' || phase === 'decide') && (
            <div style={{ marginTop: 10, padding: '6px 12px', background: 'rgba(0,0,0,0.5)', borderRadius: 999, display: 'flex', alignItems: 'center', gap: 8, border: '1px solid rgba(255,91,72,0.3)' }}>
              <span style={{ fontSize: 10 }}>👁</span>
              <div style={{ width: 80, height: 4, borderRadius: 2, background: 'rgba(245,233,212,0.15)', overflow: 'hidden' }}>
                <div style={{ width: `${tellMeter}%`, height: '100%', background: 'linear-gradient(90deg, var(--gold), var(--coral))', transition: 'width 100ms linear' }} />
              </div>
              <span className="mono" style={{ fontSize: 10, color: 'var(--gold)' }}>TELL</span>
            </div>
          )}
        </div>

        {/* opponent cards face down */}
        <div style={{ position: 'absolute', top: 100, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 4 }}>
          <PlayingCard faceDown size="sm" treatment={tweaks.cardStyle} />
          <PlayingCard faceDown size="sm" treatment={tweaks.cardStyle} delay={80} />
        </div>

        {/* pot */}
        <div style={{ position: 'absolute', top: '46%', left: 0, right: 0, textAlign: 'center' }}>
          <div className="eyebrow">Pot</div>
          <div className="mono" style={{ fontSize: 22, fontWeight: 700, color: 'var(--gold)' }}>$7</div>
          <div style={{ display: 'inline-flex', gap: 2, marginTop: 4 }}>
            <span className="chip" style={{ width: 22, height: 22, fontSize: 9 }}>$1</span>
            <span className="chip" style={{ width: 22, height: 22, fontSize: 9 }}>$2</span>
          </div>
        </div>

        {/* hero cards */}
        <div style={{ position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 6 }}>
          <PlayingCard rank="A" suit="♠" size="lg" treatment={tweaks.cardStyle} />
          <PlayingCard rank="K" suit="♠" size="lg" treatment={tweaks.cardStyle} delay={120} />
        </div>
      </div>

      {/* Decision panel */}
      <div style={{ padding: '20px 20px 28px' }}>
        {phase === 'read' && (
          <div className="anim-float" style={{ textAlign: 'center', padding: 12 }}>
            <div className="eyebrow">Reading...</div>
            <div style={{ fontSize: 14, color: 'var(--cream-dim)', marginTop: 6 }}>Quick min-raise after a long pause = uncertainty.<br/>Often a hand he wishes was bigger.</div>
            <button className="btn btn-primary" style={{ width: '100%', marginTop: 14 }} onClick={() => setPhase('decide')}>
              Got it →
            </button>
          </div>
        )}

        {phase === 'decide' && (
          <div className="anim-float">
            {/* Confidence slider — novel */}
            <div style={{ padding: '0 4px 16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span className="eyebrow">Confidence</span>
                <span className="mono" style={{ fontSize: 12, fontWeight: 700, color: 'var(--coral)' }}>{confidence}%</span>
              </div>
              <input type="range" min="20" max="100" value={confidence} onChange={e => setConfidence(+e.target.value)}
                style={{ width: '100%', accentColor: 'var(--coral)' }} />
              <div style={{ fontSize: 11, color: 'var(--cream-dim)', textAlign: 'center', marginTop: 4 }}>
                Right + bold = bigger XP. Wrong + bold = bigger lesson.
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
              <button onClick={() => choose('fold')} style={{ background: 'rgba(245,233,212,0.06)', border: '1.5px solid var(--hairline-strong)', borderRadius: 14, padding: '14px 8px', color: 'var(--cream)', cursor: 'pointer', fontFamily: 'inherit' }}>
                <div style={{ fontSize: 18, marginBottom: 4 }}>🗑️</div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>Fold</div>
              </button>
              <button onClick={() => choose('call')} style={{ background: 'rgba(233,185,73,0.1)', border: '1.5px solid rgba(233,185,73,0.4)', borderRadius: 14, padding: '14px 8px', color: 'var(--gold-soft)', cursor: 'pointer', fontFamily: 'inherit' }}>
                <div style={{ fontSize: 18, marginBottom: 4 }}>➡️</div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>Call $4</div>
              </button>
              <button onClick={() => choose('raise')} style={{ background: 'var(--coral)', border: '1.5px solid var(--coral)', borderRadius: 14, padding: '14px 8px', color: '#2a0a05', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 0 #b03d30' }}>
                <div style={{ fontSize: 18, marginBottom: 4 }}>🔥</div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>3-bet $14</div>
              </button>
            </div>
          </div>
        )}

        {phase === 'reveal' && (
          <div className="anim-float" style={{ borderRadius: 18, padding: 18, background: correct ? 'rgba(72,200,120,0.12)' : 'rgba(255,91,72,0.12)', border: `1px solid ${correct ? 'rgba(72,200,120,0.4)' : 'rgba(255,91,72,0.4)'}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
              <div className="eyebrow" style={{ color: correct ? '#7adb9c' : 'var(--coral-soft)' }}>{correct ? '✓ Correct' : '✗ Not quite'}</div>
              <div className="mono" style={{ fontSize: 14, fontWeight: 700, color: correct ? '#7adb9c' : 'var(--coral-soft)' }}>{correct ? `+${Math.round(20 * confidence/60)} XP` : `-${Math.round(5 * confidence/60)} XP`}</div>
            </div>
            <div style={{ fontSize: 14, lineHeight: 1.4 }}>
              AKs vs an UTG min-raiser is a <em className="serif" style={{color:'var(--coral-soft)'}}>premium 3-bet</em>. You either fold out his marginal stuff or build a pot you'll often win.
            </div>
            <button className="btn btn-cream" style={{ width: '100%', marginTop: 14 }} onClick={onComplete}>
              Next hand →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

window.LessonScreen = LessonScreen;
