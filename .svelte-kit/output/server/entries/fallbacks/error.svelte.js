import { V as escape_html } from "../../chunks/dev.js";
import { t as page } from "../../chunks/state.js";
//#region node_modules/.pnpm/@sveltejs+kit@2.59.0_@sveltejs+vite-plugin-svelte@7.0.0_svelte@5.55.5_vite@8.0.10_@type_1f7bcefe05edb71b3e74d47a7ccdb98b/node_modules/@sveltejs/kit/src/runtime/components/svelte-5/error.svelte
function Error($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		$$renderer.push(`<h1>${escape_html(page.status)}</h1> <p>${escape_html(page.error?.message)}</p>`);
	});
}
//#endregion
export { Error as default };
