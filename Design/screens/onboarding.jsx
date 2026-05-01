/* global React */
const { useState: useStateO, useEffect: useEffectO } = React;

function OnboardingScreen({ onDone, tweaks }) {
  const [step, setStep] = useStateO(0);
  const [picks, setPicks] = useStateO({ goal: null, time: null, level: null });

  const slides = [
    {
      kind: 'hero',
    },
    {
      kind: 'q',
      eyebrow: 'Question 1 of 3',
      q: 'What brings you to the table?',
      key: 'goal',
      opts: [
        { v: 'win', label: 'Win money from friends', emoji: '💰' },
        { v: 'pro', label: 'Take poker seriously', emoji: '🎯' },
        { v: 'fun', label: 'Just enjoy the game more', emoji: '✨' },
        { v: 'crush', label: 'Crush online cash games', emoji: '🔥' },
      ],
    },
    {
      kind: 'q',
      eyebrow: 'Question 2 of 3',
      q: 'How honest are we being about your game?',
      key: 'level',
      opts: [
        { v: 'new', label: "I know what a flush is. Mostly.", sub: 'Brand new' },
        { v: 'casual', label: "I lose more than I'd like to admit", sub: 'Casual' },
        { v: 'mid', label: "I know GTO but I freeze on the river", sub: 'Improving' },
        { v: 'shark', label: "I'm a shark sharpening teeth", sub: 'Advanced' },
      ],
    },
    {
      kind: 'q',
      eyebrow: 'Question 3 of 3',
      q: 'How much time can you steal each day?',
      key: 'time',
      opts: [
        { v: 5, label: '5 min', sub: 'Coffee break' },
        { v: 10, label: '10 min', sub: 'Commute' },
        { v: 20, label: '20 min', sub: 'Serious' },
        { v: 30, label: '30+ min', sub: 'All in' },
      ],
    },
    {
      kind: 'plan',
    },
  ];

  const slide = slides[step];

  const advance = (key, value) => {
    if (key) setPicks(p => ({ ...p, [key]: value }));
    setTimeout(() => setStep(s => s + 1), 240);
  };

  return (
    <div className="screen felt-bg" style={{ background: 'var(--felt)' }}>
      {/* progress dots */}
      {step > 0 && step < slides.length - 1 && (
        <div style={{ position: 'absolute', top: 60, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 6, zIndex: 10 }}>
          {[1,2,3].map(i => (
            <div key={i} style={{
              width: i === step ? 28 : 6,
              height: 6,
              borderRadius: 999,
              background: i <= step ? 'var(--coral)' : 'rgba(245,233,212,0.2)',
              transition: 'all 300ms ease',
            }} />
          ))}
        </div>
      )}

      {slide.kind === 'hero' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '60px 28px 40px', position: 'relative' }}>
          {/* Floating cards background */}
          <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '12%', right: '-20px', transform: 'rotate(18deg)', opacity: 0.5 }}>
              <PlayingCard rank="A" suit="♠" size="lg" treatment={tweaks.cardStyle} />
            </div>
            <div style={{ position: 'absolute', top: '22%', right: '40px', transform: 'rotate(-8deg)' }}>
              <PlayingCard rank="K" suit="♥" size="xl" treatment={tweaks.cardStyle} delay={150} />
            </div>
            <div style={{ position: 'absolute', top: '8%', left: '-30px', transform: 'rotate(-22deg)', opacity: 0.4 }}>
              <PlayingCard faceDown size="lg" treatment={tweaks.cardStyle} delay={300} />
            </div>
          </div>

          <div style={{ marginTop: 80, position: 'relative', zIndex: 2 }}>
            <div className="eyebrow" style={{ marginBottom: 12 }}>◆ Tilt</div>
          </div>

          <div style={{ position: 'relative', zIndex: 2 }}>
            <h1 className="h-display" style={{ fontSize: 64 }}>
              Poker is<br/>
              reading <em className="serif" style={{ color: 'var(--coral-soft)', fontStyle: 'italic' }}>minds.</em>
            </h1>
            <p style={{ fontSize: 18, color: 'var(--cream-dim)', marginTop: 16, lineHeight: 1.4, maxWidth: 280 }}>
              We'll teach you how. Five minutes a day. No theory dumps.
            </p>
            <button className="btn btn-primary" style={{ width: '100%', marginTop: 28 }} onClick={() => setStep(1)}>
              Deal me in →
            </button>
            <button className="btn btn-ghost" style={{ width: '100%', marginTop: 10, padding: '12px' }} onClick={() => onDone({ goal: 'fun', level: 'casual', time: 10 })}>
              I have an account
            </button>
          </div>
        </div>
      )}

      {slide.kind === 'q' && (
        <div key={step} style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '90px 24px 28px' }}>
          <div className="eyebrow anim-float">{slide.eyebrow}</div>
          <h2 className="h-1 anim-float" style={{ marginTop: 8, fontSize: 30, animationDelay: '60ms' }}>{slide.q}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 28 }}>
            {slide.opts.map((opt, i) => (
              <button key={opt.v} className="anim-float" onClick={() => advance(slide.key, opt.v)}
                style={{
                  animationDelay: `${120 + i * 60}ms`,
                  background: 'rgba(245,233,212,0.05)',
                  border: '1.5px solid var(--hairline-strong)',
                  borderRadius: 16,
                  padding: '16px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  color: 'var(--cream)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 180ms ease',
                  fontFamily: 'var(--sans)',
                }}
                onMouseDown={e => e.currentTarget.style.background = 'rgba(255,91,72,0.12)'}>
                {opt.emoji && <span style={{ fontSize: 22 }}>{opt.emoji}</span>}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 16, fontWeight: 600 }}>{opt.label}</div>
                  {opt.sub && <div style={{ fontSize: 12, color: 'var(--cream-dim)', marginTop: 2 }}>{opt.sub}</div>}
                </div>
                <span style={{ color: 'var(--cream-dim)' }}>›</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {slide.kind === 'plan' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '80px 28px 40px' }}>
          <div className="eyebrow anim-float">Your plan</div>
          <h2 className="h-1 anim-float" style={{ marginTop: 8, fontSize: 30, animationDelay: '80ms', maxWidth: 300 }}>
            Built for <em className="serif" style={{ color: 'var(--coral-soft)' }}>you</em>, dealer.
          </h2>

          <div className="anim-float" style={{ marginTop: 32, padding: 22, borderRadius: 22, background: 'linear-gradient(180deg, rgba(255,91,72,0.12), rgba(233,185,73,0.08))', border: '1px solid rgba(255,91,72,0.25)', animationDelay: '160ms' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <div className="eyebrow">Daily session</div>
              <div className="mono" style={{ fontSize: 11, color: 'var(--gold)' }}>~{picks.time || 10} MIN</div>
            </div>
            {[
              { e: '🃏', t: 'Hand of the Day', s: 'A new tricky spot, every morning' },
              { e: '🧠', t: 'Pattern Drills', s: 'Repetition that actually sticks' },
              { e: '👁️', t: 'The Read', s: 'Spot tells in <3 seconds' },
              { e: '🎬', t: 'Replay Theater', s: 'Watch your last session, narrated' },
            ].map(item => (
              <div key={item.t} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 0', borderTop: '1px solid var(--hairline)' }}>
                <span style={{ fontSize: 18 }}>{item.e}</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{item.t}</div>
                  <div style={{ fontSize: 12, color: 'var(--cream-dim)' }}>{item.s}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ flex: 1 }} />

          <button className="btn btn-primary anim-float" style={{ width: '100%', animationDelay: '300ms' }} onClick={() => onDone(picks)}>
            Start your first hand →
          </button>
        </div>
      )}
    </div>
  );
}

window.OnboardingScreen = OnboardingScreen;
