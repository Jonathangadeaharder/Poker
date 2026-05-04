import { a as ensure_array_like, c as stringify, i as derived, n as attr_class, r as attr_style, z as escape_html } from "../../../../chunks/dev.js";
import { t as goto } from "../../../../chunks/client.js";
import "../../../../chunks/navigation.js";
import { t as TopBar } from "../../../../chunks/TopBar.js";
import { n as PUSH_FOLD_CHARTS, t as ICM_GUIDELINES } from "../../../../chunks/pushFoldCharts.js";
//#region src/routes/learn/pushfold/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let selectedStack = "TWENTY_BB";
		let selectedAction = "openShove";
		let selectedPosition = "BTN";
		const currentStack = derived(() => PUSH_FOLD_CHARTS[selectedStack]);
		const stackColorMap = {
			TWENTY_BB: "#22c55e",
			FIFTEEN_BB: "#ff9800",
			TEN_BB: "#f44336"
		};
		const stackColor = derived(() => stackColorMap[selectedStack] || "#666");
		const currentOpenShove = derived(() => selectedAction === "openShove" ? currentStack().openShove[selectedPosition] : null);
		const reShoveEntries = derived(() => selectedAction === "reShove" ? Object.entries(currentStack().reShove || {}) : []);
		$$renderer.push(`<div class="screen felt-bg svelte-78gchx">`);
		{
			function center($$renderer) {
				$$renderer.push(`<!---->Push/Fold Explorer`);
			}
			TopBar($$renderer, {
				onBack: () => goto("/home"),
				center,
				$$slots: { center: true }
			});
		}
		$$renderer.push(`<!----> <div class="scroll-content svelte-78gchx"><p class="subtitle svelte-78gchx">Nash Equilibrium ranges for MTT short-stack play</p> <div class="section-label svelte-78gchx">Stack Size</div> <div class="stack-row svelte-78gchx"><!--[-->`);
		const each_array = ensure_array_like(Object.entries(PUSH_FOLD_CHARTS));
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let [key, stack] = each_array[$$index];
			$$renderer.push(`<button${attr_class("stack-btn svelte-78gchx", void 0, { "active": selectedStack === key })}${attr_style(selectedStack === key ? `background: ${stackColorMap[key]}; border-color: ${stackColorMap[key]};` : "")}><div class="stack-label svelte-78gchx">${escape_html(stack.stackSize)}</div></button>`);
		}
		$$renderer.push(`<!--]--></div> <div class="scenario-pill mono svelte-78gchx">${escape_html(currentStack().scenario)}</div> <div class="action-row svelte-78gchx"><button${attr_class("action-btn svelte-78gchx", void 0, { "active": selectedAction === "openShove" })}>Open-Shove</button> <button${attr_class("action-btn svelte-78gchx", void 0, { "active": selectedAction === "reShove" })}>Re-Shove</button></div> `);
		if (selectedAction === "openShove") {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="section-label svelte-78gchx">Position</div> <div class="position-row svelte-78gchx"><!--[-->`);
			const each_array_1 = ensure_array_like(Object.keys(currentStack().openShove));
			for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
				let pos = each_array_1[$$index_1];
				$$renderer.push(`<button${attr_class("pos-btn svelte-78gchx", void 0, { "active": selectedPosition === pos })}>${escape_html(pos)}</button>`);
			}
			$$renderer.push(`<!--]--></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (selectedAction === "openShove" && currentOpenShove()) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="chart-card svelte-78gchx"><div class="chart-header svelte-78gchx"><span class="chart-title svelte-78gchx">${escape_html(currentOpenShove().position)}</span> <span class="range-pill svelte-78gchx"${attr_style(`background: ${stringify(stackColor())}`)}>${escape_html(currentOpenShove().range)}</span></div> <p class="chart-desc svelte-78gchx">${escape_html(currentOpenShove().description)}</p> <div class="hands-grid svelte-78gchx"><!--[-->`);
			const each_array_2 = ensure_array_like(currentOpenShove().hands);
			for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
				let hand = each_array_2[$$index_2];
				$$renderer.push(`<span class="hand-chip svelte-78gchx">${escape_html(hand)}</span>`);
			}
			$$renderer.push(`<!--]--></div></div>`);
		} else if (selectedAction === "reShove") {
			$$renderer.push("<!--[1-->");
			$$renderer.push(`<!--[-->`);
			const each_array_3 = ensure_array_like(reShoveEntries());
			for (let $$index_4 = 0, $$length = each_array_3.length; $$index_4 < $$length; $$index_4++) {
				let [key, posData] = each_array_3[$$index_4];
				$$renderer.push(`<div class="chart-card svelte-78gchx"><div class="chart-header svelte-78gchx"><span class="chart-title svelte-78gchx">${escape_html(posData.scenario)}</span> <span class="range-pill svelte-78gchx"${attr_style(`background: ${stringify(stackColor())}`)}>${escape_html(posData.range)}</span></div> <p class="chart-desc svelte-78gchx">${escape_html(posData.description)}</p> <div class="hands-grid svelte-78gchx"><!--[-->`);
				const each_array_4 = ensure_array_like(posData.hands);
				for (let $$index_3 = 0, $$length = each_array_4.length; $$index_3 < $$length; $$index_3++) {
					let hand = each_array_4[$$index_3];
					$$renderer.push(`<span class="hand-chip svelte-78gchx">${escape_html(hand)}</span>`);
				}
				$$renderer.push(`<!--]--></div></div>`);
			}
			$$renderer.push(`<!--]-->`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div class="icm-card svelte-78gchx"><div class="icm-title svelte-78gchx">ICM Adjustments</div> <div class="icm-section svelte-78gchx"><div class="icm-subtitle svelte-78gchx">${escape_html(ICM_GUIDELINES.BUBBLE.scenario)}</div> <span class="icm-badge svelte-78gchx">${escape_html(ICM_GUIDELINES.BUBBLE.adjustment)}</span> <p class="icm-desc svelte-78gchx">${escape_html(ICM_GUIDELINES.BUBBLE.description)}</p> <!--[-->`);
		const each_array_5 = ensure_array_like(ICM_GUIDELINES.BUBBLE.keyPoints);
		for (let $$index_5 = 0, $$length = each_array_5.length; $$index_5 < $$length; $$index_5++) {
			let point = each_array_5[$$index_5];
			$$renderer.push(`<div class="icm-point svelte-78gchx">• ${escape_html(point)}</div>`);
		}
		$$renderer.push(`<!--]--></div> <div class="icm-section svelte-78gchx"><div class="icm-subtitle svelte-78gchx">${escape_html(ICM_GUIDELINES.FINAL_TABLE.scenario)}</div> <span class="icm-badge svelte-78gchx">${escape_html(ICM_GUIDELINES.FINAL_TABLE.adjustment)}</span> <p class="icm-desc svelte-78gchx">${escape_html(ICM_GUIDELINES.FINAL_TABLE.description)}</p> <!--[-->`);
		const each_array_6 = ensure_array_like(ICM_GUIDELINES.FINAL_TABLE.keyPoints);
		for (let $$index_6 = 0, $$length = each_array_6.length; $$index_6 < $$length; $$index_6++) {
			let point = each_array_6[$$index_6];
			$$renderer.push(`<div class="icm-point svelte-78gchx">• ${escape_html(point)}</div>`);
		}
		$$renderer.push(`<!--]--></div></div> <div class="note-card svelte-78gchx"><div class="note-title svelte-78gchx">Important</div> <p class="note-text svelte-78gchx">These charts are for chip-EV situations (pre-bubble, no extreme pay jumps).
				At bubble and final table: play TIGHTER than these charts (see ICM adjustments).
				As big stack: play aggressively against medium stacks.</p></div></div></div>`);
	});
}
//#endregion
export { _page as default };
