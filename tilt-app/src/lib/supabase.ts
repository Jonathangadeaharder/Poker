import { createBrowserClient, createServerClient } from '@supabase/ssr';
import { env } from '$env/dynamic/public';

export function createClient() {
	const url = env.PUBLIC_SUPABASE_URL;
	const key = env.PUBLIC_SUPABASE_ANON_KEY;
	if (!url || !key) {
		throw new Error('Missing PUBLIC_SUPABASE_URL or PUBLIC_SUPABASE_ANON_KEY');
	}
	return createBrowserClient(url, key);
}

export function createServerSupabase(
	_fetch: typeof globalThis.fetch,
	cookies: { get: (name: string) => string | undefined }
) {
	const url = env.PUBLIC_SUPABASE_URL;
	const key = env.PUBLIC_SUPABASE_ANON_KEY;
	if (!url || !key) {
		throw new Error('Missing PUBLIC_SUPABASE_URL or PUBLIC_SUPABASE_ANON_KEY');
	}
	return createServerClient(url, key, {
		cookies: {
			get(name) {
				return cookies.get(name) ?? '';
			},
			set() {},
			remove() {}
		}
	});
}
