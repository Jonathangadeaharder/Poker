import { a as ensure_array_like, i as derived, n as attr_class, z as escape_html } from "../../../../chunks/dev.js";
import { t as goto } from "../../../../chunks/client.js";
import "../../../../chunks/navigation.js";
import { t as TopBar } from "../../../../chunks/TopBar.js";
import { n as RFI_RANGES, r as THREE_BET_RANGES, t as COLD_CALL_RANGES } from "../../../../chunks/pokerRanges.js";
//#region src/routes/learn/ranges/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let selectedCategory = "RFI";
		let selectedPosition = "UTG";
		const categories = [
			{
				key: "RFI",
				label: "RFI"
			},
			{
				key: "3BET",
				label: "3-Bet"
			},
			{
				key: "CALL",
				label: "Cold Call"
			}
		];
		const currentRange = derived(() => selectedCategory === "RFI" ? RFI_RANGES[selectedPosition] : null);
		$$renderer.push(`<div class="screen felt-bg svelte-1ubwfoe">`);
		{
			function center($$renderer) {
				$$renderer.push(`<!---->Range Trainer`);
			}
			TopBar($$renderer, {
				onBack: () => goto("/home"),
				center,
				$$slots: { center: true }
			});
		}
		$$renderer.push(`<!----> <div class="scroll-content svelte-1ubwfoe"><p class="subtitle svelte-1ubwfoe">GTO preflop ranges for 6-max cash games (100bb)</p> <div class="tabs svelte-1ubwfoe"><!--[-->`);
		const each_array = ensure_array_like(categories);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let cat = each_array[$$index];
			$$renderer.push(`<button${attr_class("tab-btn svelte-1ubwfoe", void 0, { "active": selectedCategory === cat.key })}>${escape_html(cat.label)}</button>`);
		}
		$$renderer.push(`<!--]--></div> `);
		if (selectedCategory === "RFI") {
			$$renderer.push("<!--[0-->");
			if (currentRange()) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="range-card svelte-1ubwfoe"><div class="range-header svelte-1ubwfoe"><span class="range-title svelte-1ubwfoe">${escape_html(currentRange().position)}</span> <span class="percent-pill svelte-1ubwfoe">${escape_html(currentRange().percentage)}</span></div> <p class="range-desc svelte-1ubwfoe">${escape_html(currentRange().description)}</p> <div class="hands-section svelte-1ubwfoe"><div class="hands-header svelte-1ubwfoe"><span class="hands-title svelte-1ubwfoe">Hands</span> <button class="toggle-btn svelte-1ubwfoe">${escape_html("Show")}</button></div> `);
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></div></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> <div class="section-label svelte-1ubwfoe">Position</div> <div class="position-grid svelte-1ubwfoe"><!--[-->`);
			const each_array_2 = ensure_array_like(Object.keys(RFI_RANGES));
			for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
				let pos = each_array_2[$$index_2];
				$$renderer.push(`<button${attr_class("pos-btn svelte-1ubwfoe", void 0, { "active": selectedPosition === pos })}>${escape_html(pos)}</button>`);
			}
			$$renderer.push(`<!--]--></div>`);
		} else if (selectedCategory === "3BET") {
			$$renderer.push("<!--[1-->");
			$$renderer.push(`<div class="strategy-card linear-card svelte-1ubwfoe"><div class="strategy-title svelte-1ubwfoe">${escape_html(THREE_BET_RANGES.LINEAR.type)}</div> <span class="usage-pill svelte-1ubwfoe">${escape_html(THREE_BET_RANGES.LINEAR.usage)}</span> <p class="strategy-desc svelte-1ubwfoe">${escape_html(THREE_BET_RANGES.LINEAR.description)}</p> <div class="hands-label svelte-1ubwfoe">Hands</div> <div class="hands-grid svelte-1ubwfoe"><!--[-->`);
			const each_array_3 = ensure_array_like(THREE_BET_RANGES.LINEAR.hands);
			for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
				let hand = each_array_3[$$index_3];
				$$renderer.push(`<span class="hand-chip svelte-1ubwfoe">${escape_html(hand)}</span>`);
			}
			$$renderer.push(`<!--]--></div></div> <div class="strategy-card polar-card svelte-1ubwfoe"><div class="strategy-title svelte-1ubwfoe">${escape_html(THREE_BET_RANGES.POLAR.type)}</div> <span class="usage-pill svelte-1ubwfoe">${escape_html(THREE_BET_RANGES.POLAR.usage)}</span> <p class="strategy-desc svelte-1ubwfoe">${escape_html(THREE_BET_RANGES.POLAR.description)}</p> <div class="hands-label svelte-1ubwfoe">Value</div> <div class="hands-grid svelte-1ubwfoe"><!--[-->`);
			const each_array_4 = ensure_array_like(THREE_BET_RANGES.POLAR.valueHands);
			for (let $$index_4 = 0, $$length = each_array_4.length; $$index_4 < $$length; $$index_4++) {
				let hand = each_array_4[$$index_4];
				$$renderer.push(`<span class="hand-chip value-chip svelte-1ubwfoe">${escape_html(hand)}</span>`);
			}
			$$renderer.push(`<!--]--></div> <div class="hands-label svelte-1ubwfoe">Bluff (Blockers)</div> <div class="hands-grid svelte-1ubwfoe"><!--[-->`);
			const each_array_5 = ensure_array_like(THREE_BET_RANGES.POLAR.bluffHands);
			for (let $$index_5 = 0, $$length = each_array_5.length; $$index_5 < $$length; $$index_5++) {
				let hand = each_array_5[$$index_5];
				$$renderer.push(`<span class="hand-chip bluff-chip svelte-1ubwfoe">${escape_html(hand)}</span>`);
			}
			$$renderer.push(`<!--]--></div></div> <div class="tip-card svelte-1ubwfoe"><div class="tip-title svelte-1ubwfoe">When to use which?</div> <p class="tip-text svelte-1ubwfoe"><strong class="svelte-1ubwfoe">Linear:</strong> Against passive players who rarely 4-bet.</p> <p class="tip-text svelte-1ubwfoe"><strong class="svelte-1ubwfoe">Polarized:</strong> Against aggressive players who frequently 4-bet.</p> <p class="tip-text highlight svelte-1ubwfoe">At micro-stakes: almost always use LINEAR.</p></div>`);
		} else if (selectedCategory === "CALL") {
			$$renderer.push("<!--[2-->");
			$$renderer.push(`<div class="strategy-card svelte-1ubwfoe"><div class="strategy-title svelte-1ubwfoe">${escape_html(COLD_CALL_RANGES.IP.type)}</div> <p class="strategy-desc svelte-1ubwfoe">${escape_html(COLD_CALL_RANGES.IP.description)}</p> <div class="hands-label svelte-1ubwfoe">Hands</div> <div class="hands-grid svelte-1ubwfoe"><!--[-->`);
			const each_array_6 = ensure_array_like(COLD_CALL_RANGES.IP.hands);
			for (let $$index_6 = 0, $$length = each_array_6.length; $$index_6 < $$length; $$index_6++) {
				let hand = each_array_6[$$index_6];
				$$renderer.push(`<span class="hand-chip svelte-1ubwfoe">${escape_html(hand)}</span>`);
			}
			$$renderer.push(`<!--]--></div></div> <div class="strategy-card svelte-1ubwfoe"><div class="strategy-title svelte-1ubwfoe">${escape_html(COLD_CALL_RANGES.OOP.type)}</div> <p class="strategy-desc svelte-1ubwfoe">${escape_html(COLD_CALL_RANGES.OOP.description)}</p> <div class="hands-label svelte-1ubwfoe">Hands</div> <div class="hands-grid svelte-1ubwfoe"><!--[-->`);
			const each_array_7 = ensure_array_like(COLD_CALL_RANGES.OOP.hands);
			for (let $$index_7 = 0, $$length = each_array_7.length; $$index_7 < $$length; $$index_7++) {
				let hand = each_array_7[$$index_7];
				$$renderer.push(`<span class="hand-chip svelte-1ubwfoe">${escape_html(hand)}</span>`);
			}
			$$renderer.push(`<!--]--></div></div> <div class="tip-card mining-tip svelte-1ubwfoe"><div class="tip-title svelte-1ubwfoe">10x Rule for Set Mining</div> <p class="tip-text svelte-1ubwfoe">Call with small pairs (22-66) only when:</p> <p class="tip-text highlight svelte-1ubwfoe">Effective stacks ≥ 10x the call amount</p> <p class="tip-text svelte-1ubwfoe">Example: Villain raises 6bb → you need ≥ 60bb stack</p></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div></div>`);
	});
}
//#endregion
export { _page as default };
