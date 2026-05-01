import type { Session, User } from '@supabase/supabase-js';
import { createClient } from '$lib/supabase';

function createAuthStore() {
	let session = $state<Session | null>(null);
	let user = $state<User | null>(null);
	let loading = $state(true);
	let initialized = false;

	const supabase = createClient();

	const isAuthenticated = $derived(!!session);

	function init() {
		if (initialized) return;
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
		const { error } = await supabase.auth.signInWithOtp({ email });
		return { error };
	}

	async function signUp(email: string, password: string) {
		const { error } = await supabase.auth.signUp({ email, password });
		return { error };
	}

	async function signInWithPassword(email: string, password: string) {
		const { error } = await supabase.auth.signInWithPassword({ email, password });
		return { error };
	}

	async function signOut() {
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
