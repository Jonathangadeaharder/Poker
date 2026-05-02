import { B as attr, V as escape_html, a as ensure_array_like, i as derived, l as stringify, r as attr_style } from "../../../chunks/dev.js";
import "../../../chunks/navigation.js";
import "../../../chunks/auth.svelte.js";
import { n as calculateLevel } from "../../../chunks/gamification.js";
import { t as TopBar } from "../../../chunks/TopBar.js";
import { t as PlayingCard } from "../../../chunks/PlayingCard.js";
//#region src/lib/stores/profile.svelte.ts
function createProfileStore() {
	let profile = null;
	let dailyProgress = null;
	let trainingProgress = [];
	let loading = true;
	async function fetchProfile(userId) {}
	async function fetchDailyProgress(userId, date) {}
	async function fetchTrainingProgress(userId) {}
	async function updateProfile(userId, updates) {}
	async function addXP(userId, amount) {}
	return {
		get profile() {
			return profile;
		},
		get dailyProgress() {
			return dailyProgress;
		},
		get trainingProgress() {
			return trainingProgress;
		},
		get loading() {
			return loading;
		},
		fetchProfile,
		fetchDailyProgress,
		fetchTrainingProgress,
		updateProfile,
		addXP
	};
}
var profileStore = createProfileStore();
//#endregion
//#region src/lib/components/StreakBadge.svelte
function StreakBadge($$renderer, $$props) {
	let { count } = $$props;
	$$renderer.push(`<div style="display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; background: rgba(255,91,72,0.12); border: 1px solid rgba(255,91,72,0.3); border-radius: 999px;"><span style="font-size: 14px;">🔥</span> <span class="mono" style="font-size: 13px; font-weight: 700; color: var(--coral-soft);">${escape_html(count)}</span></div>`);
}
//#endregion
//#region src/lib/components/ProgressRing.svelte
function ProgressRing($$renderer, $$props) {
	let { value, size = 64, stroke = 6, label, sublabel } = $$props;
	const r = derived(() => (size - stroke) / 2);
	const c = derived(() => 2 * Math.PI * r());
	const clamped = derived(() => Math.max(0, Math.min(100, value)));
	const offset = derived(() => c() - clamped() / 100 * c());
	$$renderer.push(`<div${attr_style(`position: relative; width: ${stringify(size)}px; height: ${stringify(size)}px;`)}><svg${attr("width", size)}${attr("height", size)} style="transform: rotate(-90deg);"><circle class="ring-track"${attr("cx", size / 2)}${attr("cy", size / 2)}${attr("r", r())} fill="none"${attr("stroke-width", stroke)}></circle><circle class="ring-fill"${attr("cx", size / 2)}${attr("cy", size / 2)}${attr("r", r())} fill="none"${attr("stroke-width", stroke)}${attr("stroke-dasharray", c())}${attr("stroke-dashoffset", offset())} stroke-linecap="round"></circle></svg> `);
	if (label) {
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<div style="position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center;"><span class="mono" style="font-size: 16px; font-weight: 700;">${escape_html(label)}</span> `);
		if (sublabel) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<span style="font-size: 10px; color: var(--cream-dim);">${escape_html(sublabel)}</span>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div>`);
	} else $$renderer.push("<!--[-1-->");
	$$renderer.push(`<!--]--></div>`);
}
//#endregion
//#region src/routes/home/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const DAILY_GOAL = 100;
		const moods = [
			{
				emoji: "⚡",
				title: "Just 5 min",
				sub: "Quick drill",
				bg: "rgba(255,91,72,0.12)",
				border: "rgba(255,91,72,0.3)"
			},
			{
				emoji: "🧠",
				title: "Feel smart",
				sub: "Easy wins",
				bg: "rgba(233,185,73,0.12)",
				border: "rgba(233,185,73,0.3)"
			},
			{
				emoji: "🔥",
				title: "Challenge",
				sub: "Hard mode",
				bg: "rgba(178,76,228,0.12)",
				border: "rgba(178,76,228,0.3)"
			},
			{
				emoji: "🎬",
				title: "Replay",
				sub: "Last session",
				bg: "rgba(72,180,255,0.12)",
				border: "rgba(72,180,255,0.3)"
			}
		];
		const skillTree = [
			{
				title: "Preflop ranges",
				progress: 100,
				status: "Mastered",
				color: "var(--gold)",
				locked: false
			},
			{
				title: "Continuation betting",
				progress: 65,
				status: "In progress",
				color: "var(--coral)",
				locked: false
			},
			{
				title: "River decisions",
				progress: 0,
				status: "Locked · Lvl 5",
				color: "var(--cream-dim)",
				locked: true
			}
		];
		const profile = derived(() => profileStore.profile);
		const dailyProgress = derived(() => profileStore.dailyProgress);
		const levelResult = derived(() => profile() ? calculateLevel(profile().xp) : null);
		const xpToday = derived(() => dailyProgress()?.xp_earned ?? 0);
		const xpPercent = derived(() => Math.round(xpToday() / DAILY_GOAL * 100));
		const streak = derived(() => profile()?.streak_count ?? 0);
		const username = derived(() => profile()?.username ?? "Player");
		const initial = derived(() => username().charAt(0).toUpperCase());
		const levelTitle = derived(() => levelResult()?.levelData.title ?? "Poker Novice");
		const level = derived(() => levelResult()?.level ?? 1);
		const xpRemaining = derived(() => Math.max(0, DAILY_GOAL - xpToday()));
		$$renderer.push(`<div class="screen felt-bg svelte-1j6ictg">`);
		{
			function left($$renderer) {
				$$renderer.push(`<div style="display: inline-flex; align-items: center; gap: 8px;"><div style="width: 36px; height: 36px; border-radius: 999px; background: linear-gradient(135deg, #ff5b48, #e9b949); display: inline-flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; color: #2a0a05;">${escape_html(initial())}</div> <div><div style="font-size: 13px; font-weight: 600;">Hey, ${escape_html(username())}</div> <div class="mono" style="font-size: 10px; color: var(--cream-dim); text-transform: uppercase; letter-spacing: 0.1em;">Lvl ${escape_html(level())} · ${escape_html(levelTitle())}</div></div></div>`);
			}
			function right($$renderer) {
				StreakBadge($$renderer, { count: streak() });
			}
			TopBar($$renderer, {
				left,
				right,
				$$slots: {
					left: true,
					right: true
				}
			});
		}
		$$renderer.push(`<!----> <div class="scroll-content svelte-1j6ictg"><div class="hero-card svelte-1j6ictg"><div class="hero-glow svelte-1j6ictg"></div> <div class="eyebrow">Today</div> <div class="hero-row svelte-1j6ictg"><div><div class="serif hero-xp svelte-1j6ictg">${escape_html(xpToday())}<span class="hero-xp-goal svelte-1j6ictg">/100 xp</span></div> <div class="hero-sub svelte-1j6ictg">Keep the streak hot 🔥</div></div> `);
		ProgressRing($$renderer, {
			value: xpPercent(),
			size: 64,
			label: `${stringify(xpPercent())}%`
		});
		$$renderer.push(`<!----></div> <button class="btn btn-primary" style="width: 100%; margin-top: 16px;">Continue session · ${escape_html(xpRemaining())} xp left</button></div> <div class="section svelte-1j6ictg"><div class="section-header svelte-1j6ictg"><div class="eyebrow">Hand of the Day</div> <div class="mono" style="font-size: 10px; color: var(--gold);">2,847 PLAYING</div></div> <button type="button" class="hand-card tap svelte-1j6ictg"><div class="hand-cards svelte-1j6ictg"><div style="transform: rotate(-8deg);">`);
		PlayingCard($$renderer, {
			rank: "Q",
			suit: "♥",
			size: "md",
			treatment: "classic"
		});
		$$renderer.push(`<!----></div> <div style="transform: rotate(8deg) translateX(-12px);">`);
		PlayingCard($$renderer, {
			rank: "J",
			suit: "♥",
			size: "md",
			treatment: "classic",
			delay: 100
		});
		$$renderer.push(`<!----></div></div> <div class="eyebrow" style="color: var(--gold);">WED · #284</div> <div class="serif hand-title svelte-1j6ictg">QJ suited on a wet board. Hero or zero?</div> <div class="hand-footer svelte-1j6ictg"><div class="hand-dots svelte-1j6ictg"><!--[-->`);
		const each_array = ensure_array_like([
			"🟢",
			"🟢",
			"🟢",
			"🟡",
			"⚪"
		]);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let dot = each_array[$$index];
			$$renderer.push(`<span style="font-size: 8px;">${escape_html(dot)}</span>`);
		}
		$$renderer.push(`<!--]--></div> <div class="mono" style="font-size: 11px; color: var(--cream-dim);">3 MIN · +50 XP</div></div></button></div> <div class="section svelte-1j6ictg"><div class="eyebrow" style="margin-bottom: 12px;">What's the mood?</div> <div class="mood-grid svelte-1j6ictg"><!--[-->`);
		const each_array_1 = ensure_array_like(moods);
		for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
			let mood = each_array_1[$$index_1];
			$$renderer.push(`<button type="button" class="mood-btn svelte-1j6ictg"${attr_style(`background: ${stringify(mood.bg)}; border: 1px solid ${stringify(mood.border)};`)}><div style="font-size: 22px; margin-bottom: 6px;">${escape_html(mood.emoji)}</div> <div style="font-size: 14px; font-weight: 600;">${escape_html(mood.title)}</div> <div style="font-size: 11px; color: var(--cream-dim);">${escape_html(mood.sub)}</div></button>`);
		}
		$$renderer.push(`<!--]--></div></div> <div class="section svelte-1j6ictg"><div class="section-header svelte-1j6ictg"><div class="eyebrow">Your path</div> <div class="mono" style="font-size: 10px; color: var(--cream-dim);">3 / 18 MASTERED</div></div> <div class="skill-tree svelte-1j6ictg"><!--[-->`);
		const each_array_2 = ensure_array_like(skillTree);
		for (let i = 0, $$length = each_array_2.length; i < $$length; i++) {
			let skill = each_array_2[i];
			$$renderer.push(`<div class="skill-row svelte-1j6ictg"${attr_style(`border-top: ${stringify(i ? "1px solid var(--hairline)" : "none")}; opacity: ${stringify(skill.locked ? .5 : 1)};`)}><div class="skill-bar svelte-1j6ictg"${attr_style(`background: ${stringify(skill.color)};`)}></div> <div class="skill-info svelte-1j6ictg"><div style="font-size: 15px; font-weight: 600;">${escape_html(skill.title)}</div> <div class="mono" style="font-size: 10px; color: var(--cream-dim); text-transform: uppercase; letter-spacing: 0.08em;">${escape_html(skill.status)}</div></div> <div class="skill-progress-track svelte-1j6ictg"><div class="skill-progress-fill svelte-1j6ictg"${attr_style(`width: ${stringify(skill.progress)}%; background: ${stringify(skill.color)};`)}></div></div></div>`);
		}
		$$renderer.push(`<!--]--></div></div></div></div>`);
	});
}
//#endregion
export { _page as default };
