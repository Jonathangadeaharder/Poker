import type { Session, User } from '@supabase/supabase-js';
import { browser } from '$app/environment';
import { createClient } from '$lib/supabase';

// TODO: Refactor to per-request context for proper SSR isolation.
// Current singleton is safe because init() only runs client-side via $effect,
// but the module-level createClient() call runs during SSR imports.
function createAuthStore() {
	let session = $state<Session | null>(null);
	let user = $state<User | null>(null);
	let loading = $state(true);
	let initialized = false;

	const supabase = browser ? createClient() : null;

	const isAuthenticated = $derived(!!session);

	function init() {
		if (initialized || !supabase) return;
		initialized = true;

		supabase.auth
			.getSession()
			.then(({ data }) => {
				session = data.session;
				user = data.session?.user ?? null;
			})
			.finally(() => {
				loading = false;
			});

		supabase.auth.onAuthStateChange((_event, newSession) => {
			session = newSession;
			user = newSession?.user ?? null;
		});
	}

	async function signIn(email: string) {
		if (!supabase) return { error: new Error('Not initialized') };
		const { error } = await supabase.auth.signInWithOtp({ email });
		return { error };
	}

	async function signUp(email: string, password: string) {
		if (!supabase) return { error: new Error('Not initialized') };
		const { error } = await supabase.auth.signUp({ email, password });
		return { error };
	}

	async function signInWithPassword(email: string, password: string) {
		if (!supabase) return { error: new Error('Not initialized') };
		const { error } = await supabase.auth.signInWithPassword({ email, password });
		return { error };
	}

	async function signOut() {
		if (!supabase) return { error: new Error('Not initialized') };
		const { error } = await supabase.auth.signOut();
		return { error };
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
			return isAuthenticated;
		},
		init,
		signIn,
		signUp,
		signInWithPassword,
		signOut
	};
}

export const auth = createAuthStore();
