import { createBrowserClient, createServerClient } from '@supabase/ssr';
import { env } from '$env/dynamic/public';

export function createClient() {
	return createBrowserClient(env.PUBLIC_SUPABASE_URL ?? '', env.PUBLIC_SUPABASE_ANON_KEY ?? '');
}

export function createServerSupabase(
	_fetch: typeof globalThis.fetch,
	cookies: { get: (name: string) => string | undefined }
) {
	return createServerClient(env.PUBLIC_SUPABASE_URL ?? '', env.PUBLIC_SUPABASE_ANON_KEY ?? '', {
		cookies: {
			get(name) {
				return cookies.get(name) ?? '';
			},
			set() {},
			remove() {}
		}
	});
}
