import { createBrowserClient } from '@supabase/ssr';

// Switched from createServerClient to client-side-only auth (PKCE flow).
// Static sites (adapter-static + GitHub Pages) have no server runtime,
// so server-side cookie handling is not possible. All auth is handled
// in the browser using the PKCE flow via createBrowserClient.
//
// Using import.meta.env (Vite) instead of $env/dynamic/public because
// adapter-static builds everything at build time. The VITE_PUBLIC_ prefixed
// vars are injected by Vite during build and available in the browser.
export function createClient() {
	const url = import.meta.env.VITE_PUBLIC_SUPABASE_URL;
	const key = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY;
	if (!url || !key) {
		throw new Error('Missing VITE_PUBLIC_SUPABASE_URL or VITE_PUBLIC_SUPABASE_ANON_KEY');
	}
	return createBrowserClient(url, key);
}
