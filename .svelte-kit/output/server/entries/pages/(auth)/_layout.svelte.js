import "../../../chunks/dev.js";
import "../../../chunks/navigation.js";
import { t as auth } from "../../../chunks/auth.svelte.js";
//#region src/routes/(auth)/+layout.svelte
function _layout($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { children } = $$props;
		if (auth.loading) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="loading-screen svelte-5bky5h"><div class="spinner svelte-5bky5h"></div></div>`);
		} else if (!auth.isAuthenticated) {
			$$renderer.push("<!--[1-->");
			children($$renderer);
			$$renderer.push(`<!---->`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
	});
}
//#endregion
export { _layout as default };
