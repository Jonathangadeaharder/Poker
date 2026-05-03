import { R as attr, z as escape_html } from "../../../../chunks/dev.js";
import "../../../../chunks/auth.svelte.js";
//#region src/routes/(auth)/register/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let email = "";
		let password = "";
		let confirmPassword = "";
		let loading = false;
		$$renderer.push(`<div class="auth-screen svelte-ydeots"><div class="auth-header svelte-ydeots"><div class="eyebrow">◆ Tilt</div> <h1 class="h-display svelte-ydeots">Create account</h1> <p class="subtitle svelte-ydeots">Start your poker training journey.</p></div> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<form class="auth-form svelte-ydeots">`);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <label class="field svelte-ydeots"><span class="field-label svelte-ydeots">Email</span> <input type="email"${attr("value", email)} autocomplete="email" placeholder="you@example.com" required=""${attr("disabled", loading, true)} class="svelte-ydeots"/></label> <label class="field svelte-ydeots"><span class="field-label svelte-ydeots">Password</span> <input type="password"${attr("value", password)} autocomplete="new-password" placeholder="••••••••" required=""${attr("disabled", loading, true)} class="svelte-ydeots"/></label> <label class="field svelte-ydeots"><span class="field-label svelte-ydeots">Confirm password</span> <input type="password"${attr("value", confirmPassword)} autocomplete="new-password" placeholder="••••••••" required=""${attr("disabled", loading, true)} class="svelte-ydeots"/></label> <button type="submit" class="btn btn-primary"${attr("disabled", loading, true)}>${escape_html("Create account")}</button></form> <div class="auth-footer svelte-ydeots"><span>Already have an account?</span> <a href="/login" class="svelte-ydeots">Sign in</a></div>`);
		$$renderer.push(`<!--]--></div>`);
	});
}
//#endregion
export { _page as default };
