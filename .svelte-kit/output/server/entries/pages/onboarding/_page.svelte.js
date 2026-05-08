import { a as ensure_array_like, c as stringify, i as derived, n as attr_class, r as attr_style, z as escape_html } from "../../../chunks/dev.js";
import "../../../chunks/navigation.js";
import { t as PlayingCard } from "../../../chunks/PlayingCard.js";
//#region src/routes/onboarding/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let step = 0;
		let picks = {
			goal: null,
			time: null,
			level: null
		};
		const slides = [
			{ kind: "hero" },
			{
				kind: "q",
				eyebrow: "Question 1 of 3",
				q: "What brings you to the table?",
				key: "goal",
				opts: [
					{
						v: "win",
						label: "Win money from friends",
						emoji: "💰"
					},
					{
						v: "pro",
						label: "Take poker seriously",
						emoji: "🎯"
					},
					{
						v: "fun",
						label: "Just enjoy the game more",
						emoji: "✨"
					},
					{
						v: "crush",
						label: "Crush online cash games",
						emoji: "🔥"
					}
				]
			},
			{
				kind: "q",
				eyebrow: "Question 2 of 3",
				q: "How honest are we being about your game?",
				key: "level",
				opts: [
					{
						v: "new",
						label: "I know what a flush is. Mostly.",
						sub: "Brand new"
					},
					{
						v: "casual",
						label: "I lose more than I'd like to admit",
						sub: "Casual"
					},
					{
						v: "mid",
						label: "I know GTO but I freeze on the river",
						sub: "Improving"
					},
					{
						v: "shark",
						label: "I'm a shark sharpening teeth",
						sub: "Advanced"
					}
				]
			},
			{
				kind: "q",
				eyebrow: "Question 3 of 3",
				q: "How much time can you steal each day?",
				key: "time",
				opts: [
					{
						v: 5,
						label: "5 min",
						sub: "Coffee break"
					},
					{
						v: 10,
						label: "10 min",
						sub: "Commute"
					},
					{
						v: 20,
						label: "20 min",
						sub: "Serious"
					},
					{
						v: 30,
						label: "30+ min",
						sub: "All in"
					}
				]
			},
			{ kind: "plan" }
		];
		const slide = derived(() => slides[step]);
		$$renderer.push(`<div class="screen felt-bg svelte-fpvdp2">`);
		if (step > 0 && step < slides.length - 1) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="progress-dots svelte-fpvdp2"><!--[-->`);
			const each_array = ensure_array_like([
				1,
				2,
				3
			]);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let i = each_array[$$index];
				$$renderer.push(`<div${attr_class("dot svelte-fpvdp2", void 0, {
					"active": i === step,
					"completed": i < step
				})}></div>`);
			}
			$$renderer.push(`<!--]--></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (slide().kind === "hero") {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="hero-slide svelte-fpvdp2"><div class="floating-cards svelte-fpvdp2"><div class="card-float card-1 svelte-fpvdp2">`);
			PlayingCard($$renderer, {
				rank: "A",
				suit: "♠",
				size: "lg"
			});
			$$renderer.push(`<!----></div> <div class="card-float card-2 svelte-fpvdp2">`);
			PlayingCard($$renderer, {
				rank: "K",
				suit: "♥",
				size: "xl",
				delay: 150
			});
			$$renderer.push(`<!----></div> <div class="card-float card-3 svelte-fpvdp2">`);
			PlayingCard($$renderer, {
				rank: "?",
				suit: "?",
				faceDown: true,
				size: "lg",
				delay: 300
			});
			$$renderer.push(`<!----></div></div> <div class="hero-content svelte-fpvdp2"><div class="eyebrow">◆ Tilt</div></div> <div class="hero-cta svelte-fpvdp2"><h1 class="h-display hero-title svelte-fpvdp2">Poker is<br/> reading <em class="serif italic svelte-fpvdp2">minds.</em></h1> <p class="hero-subtitle svelte-fpvdp2">We'll teach you how. Five minutes a day. No theory dumps.</p> <button class="btn btn-primary">Deal me in →</button> <button class="btn btn-ghost">I have an account</button></div></div>`);
		} else if (slide().kind === "q") {
			$$renderer.push("<!--[1-->");
			$$renderer.push(`<div class="question-slide svelte-fpvdp2"><div class="eyebrow anim-float svelte-fpvdp2">${escape_html(slide().eyebrow)}</div> <h2 class="h-1 anim-float question-title svelte-fpvdp2">${escape_html(slide().q)}</h2> <div class="options svelte-fpvdp2"><!--[-->`);
			const each_array_1 = ensure_array_like(slide().opts ?? []);
			for (let i = 0, $$length = each_array_1.length; i < $$length; i++) {
				let opt = each_array_1[i];
				$$renderer.push(`<button class="option-btn anim-float svelte-fpvdp2"${attr_style(`animation-delay: ${stringify(120 + i * 60)}ms`)}>`);
				if (opt.emoji) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<span class="option-emoji svelte-fpvdp2">${escape_html(opt.emoji)}</span>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> <div class="option-text svelte-fpvdp2"><div class="option-label svelte-fpvdp2">${escape_html(opt.label)}</div> `);
				if (opt.sub) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<div class="option-sub svelte-fpvdp2">${escape_html(opt.sub)}</div>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></div> <span class="option-arrow svelte-fpvdp2">›</span></button>`);
			}
			$$renderer.push(`<!--]--></div></div>`);
		} else if (slide().kind === "plan") {
			$$renderer.push("<!--[2-->");
			$$renderer.push(`<div class="plan-slide svelte-fpvdp2"><div class="eyebrow anim-float svelte-fpvdp2">Your plan</div> <h2 class="h-1 anim-float plan-title svelte-fpvdp2">Built for <em class="serif italic svelte-fpvdp2">you</em>, dealer.</h2> <div class="plan-card anim-float svelte-fpvdp2"><div class="plan-header svelte-fpvdp2"><div class="eyebrow">Daily session</div> <div class="mono plan-time svelte-fpvdp2">~${escape_html(picks.time || 10)} MIN</div></div> <!--[-->`);
			const each_array_2 = ensure_array_like([
				{
					e: "🃏",
					t: "Hand of the Day",
					s: "A new tricky spot, every morning"
				},
				{
					e: "🧠",
					t: "Pattern Drills",
					s: "Repetition that actually sticks"
				},
				{
					e: "👁️",
					t: "The Read",
					s: "Spot tells in <3 seconds"
				},
				{
					e: "🎬",
					t: "Replay Theater",
					s: "Watch your last session, narrated"
				}
			]);
			for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
				let item = each_array_2[$$index_2];
				$$renderer.push(`<div class="plan-item svelte-fpvdp2"><span class="plan-emoji svelte-fpvdp2">${escape_html(item.e)}</span> <div><div class="plan-item-title svelte-fpvdp2">${escape_html(item.t)}</div> <div class="plan-item-desc svelte-fpvdp2">${escape_html(item.s)}</div></div></div>`);
			}
			$$renderer.push(`<!--]--></div> <div class="spacer svelte-fpvdp2"></div> <button class="btn btn-primary anim-float svelte-fpvdp2" style="animation-delay: 300ms">Start your first hand →</button></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div>`);
	});
}
//#endregion
export { _page as default };
