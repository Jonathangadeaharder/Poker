import { B as attr, V as escape_html } from "../../../../chunks/dev.js";
import "../../../../chunks/navigation.js";
import "../../../../chunks/auth.svelte.js";
//#region src/routes/(auth)/login/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let email = "";
		let password = "";
		let loading = false;
		$$renderer.push(`<div class="auth-screen svelte-8k30lk"><div class="auth-header svelte-8k30lk"><div class="eyebrow">◆ Tilt</div> <h1 class="h-display svelte-8k30lk">Welcome back</h1> <p class="subtitle svelte-8k30lk">Pick up where you left off.</p></div> <form class="auth-form svelte-8k30lk">`);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <label class="field svelte-8k30lk"><span class="field-label svelte-8k30lk">Email</span> <input type="email"${attr("value", email)} autocomplete="email" placeholder="you@example.com" required=""${attr("disabled", loading, true)} class="svelte-8k30lk"/></label> <label class="field svelte-8k30lk"><span class="field-label svelte-8k30lk">Password</span> <input type="password"${attr("value", password)} autocomplete="current-password" placeholder="••••••••" required=""${attr("disabled", loading, true)} class="svelte-8k30lk"/></label> <button type="submit" class="btn btn-primary"${attr("disabled", loading, true)}>${escape_html("Sign in")}</button></form> <div class="auth-footer svelte-8k30lk"><span>Don't have an account?</span> <a href="/register" class="svelte-8k30lk">Create one</a></div></div>`);
	});
}
//#endregion
export { _page as default };
