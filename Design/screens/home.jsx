/* global React */
function HomeScreen({ onStart, onLesson, picks, tweaks }) {
  const xpToday = 65;
  const dailyGoal = 100;
  const streak = 7;
  const level = 4;
  const levelTitle = 'Reading the Felt';

  return (
    <div className="screen felt-bg" style={{ background: 'var(--felt)', overflowY: 'auto', overflowX: 'hidden' }}>
      <TopBar
        left={<div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 36, height: 36, borderRadius: 999, background: 'linear-gradient(135deg, #ff5b48, #e9b949)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, color: '#2a0a05' }}>R</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Hey, Rae</div>
            <div className="mono" style={{ fontSize: 10, color: 'var(--cream-dim)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Lvl {level} · {levelTitle}</div>
          </div>
        </div>}
        right={<StreakBadge count={streak} />}
      />

      <div style={{ padding: '8px 20px 100px' }}>
        {/* Daily progress hero */}
        <div style={{ marginTop: 12, padding: 22, borderRadius: 24, background: 'linear-gradient(180deg, rgba(255,91,72,0.18), rgba(255,91,72,0.04))', border: '1px solid rgba(255,91,72,0.3)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,91,72,0.25), transparent 70%)' }} />
          <div className="eyebrow">Today</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 8 }}>
            <div>
              <div className="serif" style={{ fontSize: 44, lineHeight: 1, color: 'var(--cream)' }}>
                {xpToday}<span style={{ color: 'var(--cream-dim)', fontSize: 22 }}>/{dailyGoal} xp</span>
              </div>
              <div style={{ fontSize: 13, color: 'var(--cream-dim)', marginTop: 4 }}>Keep the streak hot 🔥</div>
            </div>
            <ProgressRing value={(xpToday/dailyGoal)*100} size={64} label={`${Math.round((xpToday/dailyGoal)*100)}%`} />
          </div>
          <button className="btn btn-primary" style={{ width: '100%', marginTop: 16 }} onClick={onLesson}>
            Continue session · 35 xp left
          </button>
        </div>

        {/* Hand of the Day */}
        <div style={{ marginTop: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
            <div className="eyebrow">Hand of the Day</div>
            <div className="mono" style={{ fontSize: 10, color: 'var(--gold)' }}>2,847 PLAYING</div>
          </div>
          <div onClick={onLesson} className="tap" style={{ borderRadius: 22, overflow: 'hidden', position: 'relative', background: 'linear-gradient(135deg, #1a3d2e 0%, #0e2a20 100%)', border: '1px solid var(--hairline-strong)', padding: 22, height: 180 }}>
            {/* hand of cards */}
            <div style={{ position: 'absolute', right: 14, top: 18, display: 'flex', gap: -20 }}>
              <div style={{ transform: 'rotate(-8deg)' }}><PlayingCard rank="Q" suit="♥" size="md" treatment={tweaks.cardStyle} /></div>
              <div style={{ transform: 'rotate(8deg) translateX(-12px)' }}><PlayingCard rank="J" suit="♥" size="md" treatment={tweaks.cardStyle} delay={100} /></div>
            </div>
            <div className="eyebrow" style={{ color: 'var(--gold)' }}>WED · #284</div>
            <div className="serif" style={{ fontSize: 28, lineHeight: 1.05, marginTop: 8, maxWidth: 200 }}>
              QJ suited on a wet board. Hero or zero?
            </div>
            <div style={{ position: 'absolute', bottom: 18, left: 22, right: 22, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: 6 }}>
                {['🟢','🟢','🟢','🟡','⚪'].map((d,i) => <span key={i} style={{ fontSize: 8 }}>{d}</span>)}
              </div>
              <div className="mono" style={{ fontSize: 11, color: 'var(--cream-dim)' }}>3 MIN · +50 XP</div>
            </div>
          </div>
        </div>

        {/* Mood picker — novel feature */}
        <div style={{ marginTop: 28 }}>
          <div className="eyebrow" style={{ marginBottom: 12 }}>What's the mood?</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              { e: '⚡', t: 'Just 5 min', s: 'Quick drill', c: 'rgba(255,91,72,0.12)', bc: 'rgba(255,91,72,0.3)' },
              { e: '🧠', t: 'Feel smart', s: 'Easy wins', c: 'rgba(233,185,73,0.12)', bc: 'rgba(233,185,73,0.3)' },
              { e: '🔥', t: 'Challenge', s: 'Hard mode', c: 'rgba(178,76,228,0.12)', bc: 'rgba(178,76,228,0.3)' },
              { e: '🎬', t: 'Replay', s: 'Last session', c: 'rgba(72,180,255,0.12)', bc: 'rgba(72,180,255,0.3)' },
            ].map(m => (
              <button key={m.t} onClick={onLesson} style={{ background: m.c, border: `1px solid ${m.bc}`, borderRadius: 16, padding: 14, color: 'var(--cream)', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit' }}>
                <div style={{ fontSize: 22, marginBottom: 6 }}>{m.e}</div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{m.t}</div>
                <div style={{ fontSize: 11, color: 'var(--cream-dim)' }}>{m.s}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Skill tree teaser */}
        <div style={{ marginTop: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
            <div className="eyebrow">Your path</div>
            <div className="mono" style={{ fontSize: 10, color: 'var(--cream-dim)' }}>3 / 18 MASTERED</div>
          </div>
          <div style={{ background: 'rgba(245,233,212,0.04)', borderRadius: 22, border: '1px solid var(--hairline)', overflow: 'hidden' }}>
            {[
              { t: 'Preflop ranges', p: 100, m: 'Mastered', c: 'var(--gold)' },
              { t: 'Continuation betting', p: 65, m: 'In progress', c: 'var(--coral)' },
              { t: 'River decisions', p: 0, m: 'Locked · Lvl 5', c: 'var(--cream-dim)', locked: true },
            ].map((s,i) => (
              <div key={s.t} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', borderTop: i ? '1px solid var(--hairline)' : 'none', opacity: s.locked ? 0.5 : 1 }}>
                <div style={{ width: 8, height: 40, borderRadius: 4, background: s.c }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 600 }}>{s.t}</div>
                  <div className="mono" style={{ fontSize: 10, color: 'var(--cream-dim)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.m}</div>
                </div>
                <div style={{ width: 50, height: 4, borderRadius: 2, background: 'rgba(245,233,212,0.1)', overflow: 'hidden' }}>
                  <div style={{ width: `${s.p}%`, height: '100%', background: s.c }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom nav */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '12px 20px 28px', background: 'linear-gradient(180deg, transparent, rgba(0,0,0,0.5) 30%)', display: 'flex', justifyContent: 'space-around' }}>
        {[
          { i: '◆', l: 'Today', a: true },
          { i: '○', l: 'Practice' },
          { i: '◇', l: 'Replay' },
          { i: '△', l: 'You' },
        ].map(t => (
          <button key={t.l} style={{ background: 'transparent', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, color: t.a ? 'var(--coral)' : 'var(--cream-dim)', cursor: 'pointer', padding: '8px 12px', fontFamily: 'inherit' }}>
            <span style={{ fontSize: 20 }}>{t.i}</span>
            <span className="mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{t.l}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

window.HomeScreen = HomeScreen;
