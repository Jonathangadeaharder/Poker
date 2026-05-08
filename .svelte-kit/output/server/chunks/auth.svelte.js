import { i as derived, st as public_env } from "./dev.js";
import { createBrowserClient } from "@supabase/ssr";
//#region src/lib/supabase.ts
function createClient() {
	const url = public_env.PUBLIC_SUPABASE_URL;
	const key = public_env.PUBLIC_SUPABASE_ANON_KEY;
	if (!url || !key) throw new Error("Missing PUBLIC_SUPABASE_URL or PUBLIC_SUPABASE_ANON_KEY");
	return createBrowserClient(url, key);
}
//#endregion
//#region src/lib/stores/auth.svelte.ts
function createAuthStore() {
	let session = null;
	let user = null;
	let loading = true;
	const isAuthenticated = derived(() => false);
	function init() {}
	async function signIn(email) {
		return { error: /* @__PURE__ */ new Error("Not initialized") };
	}
	async function signUp(email, password) {
		return { error: /* @__PURE__ */ new Error("Not initialized") };
	}
	async function signInWithPassword(email, password) {
		return { error: /* @__PURE__ */ new Error("Not initialized") };
	}
	async function signOut() {
		return { error: /* @__PURE__ */ new Error("Not initialized") };
	}
	return {
		get session() {
			return session;
		},
		get user() {
			return user;
		},
		get loading() {
			return loading;
		},
		get isAuthenticated() {
			return isAuthenticated();
		},
		init,
		signIn,
		signUp,
		signInWithPassword,
		signOut
	};
}
var auth = createAuthStore();
//#endregion
export { createClient as n, auth as t };
