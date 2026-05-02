import "../../chunks/dev.js";
import "../../chunks/navigation.js";
import { t as auth } from "../../chunks/auth.svelte.js";
//#region src/routes/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		if (auth.loading) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div style="display: flex; align-items: center; justify-content: center; height: 100vh; color: var(--cream-dim);">Loading...</div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
	});
}
//#endregion
export { _page as default };
