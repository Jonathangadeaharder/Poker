import { R as attr, c as stringify, i as derived, n as attr_class, r as attr_style, z as escape_html } from "../../../chunks/dev.js";
import { t as goto } from "../../../chunks/client.js";
import "../../../chunks/navigation.js";
import { t as PlayingCard } from "../../../chunks/PlayingCard.js";
import { t as TopBar } from "../../../chunks/TopBar.js";
//#region src/lib/components/Chip.svelte
function Chip($$renderer, $$props) {
	let { label = "", class: className = "" } = $$props;
	$$renderer.push(`<span${attr_class(`chip ${stringify(className)}`)}>${escape_html(label)}</span>`);
}
//#endregion
//#region src/lib/components/Pill.svelte
function Pill($$renderer, $$props) {
	let { class: className = "", children } = $$props;
	$$renderer.push(`<span${attr_class(`pill ${stringify(className)}`)}>`);
	children($$renderer);
	$$renderer.push(`<!----></span>`);
}
//#endregion
//#region src/routes/lesson/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let phase = "setup";
		let confidence = 60;
		let choice = null;
		let tellMeter = 0;
		let handNumber = 1;
		let totalHands = 5;
		let xpEarned = 0;
		const correct = derived(() => choice === "raise");
		const phaseText = derived(() => {
			switch (phase) {
				case "setup": return "Folded to you on the button.";
				case "read": return "Villain just min-raised. Quickly.";
				case "decide": return "What's your move?";
				case "reveal": return correct() ? "Nice read." : "Hmm. Re-deal that one.";
			}
		});
		const xpResult = derived(() => {
			return 0;
		});
		$$renderer.push(`<div class="screen felt-bg svelte-1yo039t">`);
		{
			function center($$renderer) {
				$$renderer.push(`<!---->Hand ${escape_html(handNumber)} of 5`);
			}
			function right($$renderer) {
				Pill($$renderer, {
					children: ($$renderer) => {
						$$renderer.push(`<span style="color: var(--gold);">●</span> ${escape_html(xpEarned >= 0 ? `+${xpEarned}` : xpEarned)} XP`);
					},
					$$slots: { default: true }
				});
			}
			TopBar($$renderer, {
				onBack: () => goto("/home"),
				center,
				right,
				$$slots: {
					center: true,
					right: true
				}
			});
		}
		$$renderer.push(`<!----> <div class="scenario svelte-1yo039t"><div class="eyebrow" style="color: var(--gold);">UTG · 100BB · $1/$2 NLHE</div> <div class="serif scenario-text svelte-1yo039t">${escape_html(phaseText())}</div></div> <div class="table-felt svelte-1yo039t"><div class="opponent-zone svelte-1yo039t"><div class="opponent-avatar svelte-1yo039t">🎩</div> <div class="mono opponent-label svelte-1yo039t">Villain · UTG</div> `);
		if (phase === "read" || phase === "decide") {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="tell-meter svelte-1yo039t"><span style="font-size: 10px;">👁</span> <div class="tell-track svelte-1yo039t"><div class="tell-fill svelte-1yo039t"${attr_style(`width: ${stringify(tellMeter)}%;`)}></div></div> <span class="mono tell-label svelte-1yo039t">TELL</span></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> <div class="opponent-cards svelte-1yo039t">`);
		PlayingCard($$renderer, {
			faceDown: true,
			size: "sm",
			treatment: "classic"
		});
		$$renderer.push(`<!----> `);
		PlayingCard($$renderer, {
			faceDown: true,
			size: "sm",
			treatment: "classic",
			delay: 80
		});
		$$renderer.push(`<!----></div> <div class="pot-zone svelte-1yo039t"><div class="eyebrow">Pot</div> <div class="mono pot-amount svelte-1yo039t">$7</div> <div class="pot-chips svelte-1yo039t">`);
		Chip($$renderer, {
			label: "$1",
			class: "chip-sm"
		});
		$$renderer.push(`<!----> `);
		Chip($$renderer, {
			label: "$2",
			class: "chip-sm"
		});
		$$renderer.push(`<!----></div></div> <div class="hero-cards svelte-1yo039t">`);
		PlayingCard($$renderer, {
			rank: "A",
			suit: "♠",
			size: "lg",
			treatment: "classic"
		});
		$$renderer.push(`<!----> `);
		PlayingCard($$renderer, {
			rank: "K",
			suit: "♠",
			size: "lg",
			treatment: "classic",
			delay: 120
		});
		$$renderer.push(`<!----></div></div> <div class="decision-panel svelte-1yo039t">`);
		if (phase === "read") {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="anim-float read-panel svelte-1yo039t"><div class="eyebrow">Reading...</div> <div class="read-hint svelte-1yo039t">Quick min-raise after a long pause = uncertainty.<br/> Often a hand he wishes was bigger.</div> <button class="btn btn-primary" style="width: 100%; margin-top: 14px;">Got it →</button></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (phase === "decide") {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="anim-float svelte-1yo039t"><div class="confidence-section svelte-1yo039t"><div class="confidence-header svelte-1yo039t"><span class="eyebrow">Confidence</span> <span class="mono confidence-value svelte-1yo039t">${escape_html(confidence)}%</span></div> <input type="range" min="20" max="100"${attr("value", confidence)} class="confidence-slider svelte-1yo039t"/> <div class="confidence-hint svelte-1yo039t">Right + bold = bigger XP. Wrong + bold = bigger lesson.</div></div> <div class="action-grid svelte-1yo039t"><button class="action-btn action-fold svelte-1yo039t"><div class="action-icon svelte-1yo039t">🗑️</div> <div class="action-label svelte-1yo039t">Fold</div></button> <button class="action-btn action-call svelte-1yo039t"><div class="action-icon svelte-1yo039t">➡️</div> <div class="action-label svelte-1yo039t">Call $4</div></button> <button class="action-btn action-raise svelte-1yo039t"><div class="action-icon svelte-1yo039t">🔥</div> <div class="action-label svelte-1yo039t">3-bet $14</div></button></div></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (phase === "reveal") {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div${attr_class("anim-float reveal-panel svelte-1yo039t", void 0, {
				"reveal-correct": correct(),
				"reveal-wrong": !correct()
			})}><div class="reveal-header svelte-1yo039t"><div class="eyebrow reveal-verdict svelte-1yo039t">${escape_html(correct() ? "✓ Correct" : "✗ Not quite")}</div> <div class="mono reveal-xp svelte-1yo039t">${escape_html(correct() ? `+${xpResult()}` : xpResult())} XP</div></div> <div class="reveal-explanation svelte-1yo039t">AKs vs an UTG min-raiser is a <em class="serif" style="color: var(--coral-soft);">premium 3-bet</em>.
					You either fold out his marginal stuff or build a pot you'll often win.</div> <button class="btn btn-cream" style="width: 100%; margin-top: 14px;">${escape_html(handNumber >= totalHands ? "Finish session" : "Next hand →")}</button></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div></div>`);
	});
}
//#endregion
export { _page as default };
