import "../../../../chunks/environment.js";
import { V as escape_html, a as ensure_array_like, c as store_get, et as getContext, i as derived, l as stringify, r as attr_style, u as unsubscribe_stores } from "../../../../chunks/dev.js";
import "../../../../chunks/client.js";
import "../../../../chunks/navigation.js";
import { t as Confetti } from "../../../../chunks/Confetti.js";
//#region node_modules/.pnpm/@sveltejs+kit@2.59.0_@sveltejs+vite-plugin-svelte@7.0.0_svelte@5.55.5_vite@8.0.10_@type_1f7bcefe05edb71b3e74d47a7ccdb98b/node_modules/@sveltejs/kit/src/runtime/app/stores.js
/**
* A function that returns all of the contextual stores. On the server, this must be called during component initialization.
* Only use this if you need to defer store subscription until after the component has mounted, for some reason.
*
* @deprecated Use `$app/state` instead (requires Svelte 5, [see docs for more info](https://svelte.dev/docs/kit/migrating-to-sveltekit-2#SvelteKit-2.12:-$app-stores-deprecated))
*/
var getStores = () => {
	const stores$1 = getContext("__svelte__");
	return {
		/** @type {typeof page} */
		page: { subscribe: stores$1.page.subscribe },
		/** @type {typeof navigating} */
		navigating: { subscribe: stores$1.navigating.subscribe },
		/** @type {typeof updated} */
		updated: stores$1.updated
	};
};
/**
* A readable store whose value contains page data.
*
* On the server, this store can only be subscribed to during component initialization. In the browser, it can be subscribed to at any time.
*
* @deprecated Use `page` from `$app/state` instead (requires Svelte 5, [see docs for more info](https://svelte.dev/docs/kit/migrating-to-sveltekit-2#SvelteKit-2.12:-$app-stores-deprecated))
* @type {import('svelte/store').Readable<import('@sveltejs/kit').Page>}
*/
var page = { subscribe(fn) {
	return getStores().page.subscribe(fn);
} };
//#endregion
//#region src/routes/results/[sessionId]/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		var $$store_subs;
		let showConfetti = false;
		derived(() => store_get($$store_subs ??= {}, "$page", page).params.sessionId);
		const stats = [
			{
				label: "XP earned",
				value: "+85",
				color: "var(--coral)"
			},
			{
				label: "Accuracy",
				value: "4/5",
				color: "var(--gold)"
			},
			{
				label: "Streak",
				value: "8 🔥",
				color: "var(--coral-soft)"
			},
			{
				label: "Time",
				value: "4:12",
				color: "var(--cream)"
			}
		];
		$$renderer.push(`<div class="screen felt-bg" style="overflow-y: auto;">`);
		Confetti($$renderer, { active: showConfetti });
		$$renderer.push(`<!----> <div style="padding: 70px 28px 32px; text-align: center; position: relative;"><div class="anim-pop" style="font-size: 64px;">🃏</div> <div class="eyebrow anim-float" style="margin-top: 12px; color: var(--gold);">Session complete</div> <h1 class="h-display anim-float" style="margin-top: 8px; font-size: 56px;"><em class="serif" style="color: var(--coral-soft);">Sharp</em><br/>play, dealer.</h1> <p class="anim-float" style="font-size: 15px; color: var(--cream-dim); margin-top: 12px;">You're calibrated 18% better than yesterday.</p></div> <div style="padding: 0 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 10px;"><!--[-->`);
		const each_array = ensure_array_like(stats);
		for (let i = 0, $$length = each_array.length; i < $$length; i++) {
			let stat = each_array[i];
			$$renderer.push(`<div class="anim-float" style="padding: 18px; background: rgba(245,233,212,0.04); border: 1px solid var(--hairline); border-radius: 18px;"><div class="eyebrow">${escape_html(stat.label)}</div> <div class="serif"${attr_style(`font-size: 32px; margin-top: 4px; color: ${stringify(stat.color)};`)}>${escape_html(stat.value)}</div></div>`);
		}
		$$renderer.push(`<!--]--></div> <div class="anim-float" style="margin: 20px 20px 0; padding: 22px; border-radius: 22px; background: linear-gradient(180deg, rgba(233,185,73,0.12), rgba(233,185,73,0.03)); border: 1px solid rgba(233,185,73,0.3);"><div class="eyebrow" style="color: var(--gold);">The Read · Insight</div> <div class="serif" style="font-size: 22px; margin-top: 6px;">You bluff-catch <em style="color: var(--gold-soft);">too rarely</em> on the river.</div> <div style="font-size: 13px; color: var(--cream-dim); margin-top: 8px;">When opponents over-bet rivers, you fold 78% of the time. The math says 55% is closer to optimal.</div> <button class="btn btn-ghost" style="width: 100%; margin-top: 14px; font-size: 14px; padding: 12px;">Drill this tomorrow →</button></div> <div class="anim-float" style="margin: 14px 20px 0; padding: 16px; border-radius: 18px; background: rgba(255,91,72,0.1); border: 1px solid rgba(255,91,72,0.3); display: flex; align-items: center; gap: 14px;"><div style="width: 48px; height: 48px; border-radius: 14px; background: linear-gradient(135deg, var(--coral), var(--gold)); display: flex; align-items: center; justify-content: center; font-size: 22px;">🏅</div> <div style="flex: 1;"><div class="eyebrow" style="color: var(--coral-soft);">Achievement unlocked</div> <div style="font-size: 15px; font-weight: 600; margin-top: 2px;">Week One Wonder</div> <div style="font-size: 12px; color: var(--cream-dim);">7-day streak. Keep going.</div></div> <div class="mono" style="font-size: 13px; color: var(--coral-soft); font-weight: 700;">+25 XP</div></div> <div style="padding: 20px 20px 32px;"><button class="btn btn-primary" style="width: 100%;">Done · See you tomorrow</button> <button class="btn btn-ghost" style="width: 100%; margin-top: 8px; padding: 12px;">Share session</button></div></div>`);
		if ($$store_subs) unsubscribe_stores($$store_subs);
	});
}
//#endregion
export { _page as default };
