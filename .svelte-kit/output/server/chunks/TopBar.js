import "./dev.js";
//#region src/lib/components/TopBar.svelte
function TopBar($$renderer, $$props) {
	let { left, center, right, onBack } = $$props;
	$$renderer.push(`<div style="display: flex; align-items: center; justify-content: space-between; padding: 14px 20px 8px; position: relative; z-index: 5;"><div style="min-width: 40px;">`);
	if (onBack) {
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<button type="button" aria-label="Back" style="background: rgba(245,233,212,0.08); border: 1px solid var(--hairline); border-radius: 999px; width: 36px; height: 36px; color: var(--cream); cursor: pointer; font-size: 18px; display: inline-flex; align-items: center; justify-content: center;">‹</button>`);
	} else $$renderer.push("<!--[-1-->");
	$$renderer.push(`<!--]--> `);
	if (left) {
		$$renderer.push("<!--[0-->");
		left($$renderer);
		$$renderer.push(`<!---->`);
	} else $$renderer.push("<!--[-1-->");
	$$renderer.push(`<!--]--></div> <div style="flex: 1; text-align: center; font-size: 13px; font-family: var(--mono); letter-spacing: 0.1em; text-transform: uppercase; color: var(--cream-dim);">`);
	if (center) {
		$$renderer.push("<!--[0-->");
		center($$renderer);
		$$renderer.push(`<!---->`);
	} else $$renderer.push("<!--[-1-->");
	$$renderer.push(`<!--]--></div> <div style="min-width: 40px; text-align: right;">`);
	if (right) {
		$$renderer.push("<!--[0-->");
		right($$renderer);
		$$renderer.push(`<!---->`);
	} else $$renderer.push("<!--[-1-->");
	$$renderer.push(`<!--]--></div></div>`);
}
//#endregion
export { TopBar as t };
