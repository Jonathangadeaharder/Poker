import type { Handle, HandleServerError } from '@sveltejs/kit';
import { PUBLIC_POSTHOG_HOST } from '$env/static/public';
import { captureError, pageview, shutdown } from '$lib/telemetry';

export const handle: Handle = async ({ event, resolve }) => {
	const { pathname } = event.url;

	if (pathname.startsWith('/ingest')) {
		const useAssetHost =
			pathname.startsWith('/ingest/static/') || pathname.startsWith('/ingest/array/');
		const posthogHost = PUBLIC_POSTHOG_HOST || 'https://eu.i.posthog.com';
		const assetHost = posthogHost
			.replace('://i.', '://eu-assets.i.')
			.replace('://eu.', '://eu-assets.');
		const hostname = useAssetHost
			? assetHost.replace(/^https?:\/\//, '')
			: posthogHost.replace(/^https?:\/\//, '');

		const url = new URL(event.request.url);
		url.protocol = 'https:';
		url.hostname = hostname;
		url.port = '443';
		url.pathname = pathname.replace(/^\/ingest/, '');

		const headers = new Headers(event.request.headers);
		headers.set('host', hostname);
		const clientIp = event.request.headers.get('x-forwarded-for') || event.getClientAddress();
		if (clientIp) {
			headers.set('x-forwarded-for', clientIp);
		}

		try {
			const response = await fetch(url.toString(), {
				method: event.request.method,
				headers,
				body:
					event.request.method !== 'GET' && event.request.method !== 'HEAD'
						? event.request.body
						: null,
				// @ts-expect-error - duplex is required for streaming request bodies
				duplex: 'half'
			});
			return response;
		} catch {
			return new Response(null, { status: 200 });
		}
	}

	const response = await resolve(event);

	if (!pathname.startsWith('/api') && !pathname.startsWith('/_')) {
		pageview(pathname).catch(() => {});
	}

	return response;
};

export const handleError: HandleServerError = async ({ error, status, message }) => {
	captureError(error, { status, message, source: 'server' }).catch(() => {});
	return { message, status };
};

['SIGTERM', 'SIGINT'].forEach((signal) => {
	process.on(signal, () => {
		shutdown().catch(() => {});
	});
});
