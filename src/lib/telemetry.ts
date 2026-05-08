import { browser } from '$app/environment';
import { PUBLIC_POSTHOG_HOST, PUBLIC_POSTHOG_PROJECT_TOKEN } from '$env/static/public';

const enabled = !!PUBLIC_POSTHOG_PROJECT_TOKEN;

export async function track(event: string, props?: Record<string, unknown>) {
	if (!enabled) return;
	if (browser) {
		const ph = await getClientPh();
		ph?.capture(event, props);
	} else {
		const ph = await getServerPh();
		const distinctId = props?.userId ? String(props.userId) : 'server';
		ph?.capture({ distinctId, event, properties: props });
	}
}

export async function pageview(route: string) {
	if (!enabled) return;
	if (browser) {
		const ph = await getClientPh();
		ph?.capture('$pageview', { $current_url: route });
	} else {
		const ph = await getServerPh();
		ph?.capture({ distinctId: 'server', event: '$pageview', properties: { $current_url: route } });
	}
}

export async function captureError(err: unknown, ctx?: Record<string, unknown>) {
	if (!enabled) return;
	if (browser) {
		const ph = await getClientPh();
		ph?.captureException(err, ctx);
	} else {
		const ph = await getServerPh();
		ph?.capture({
			distinctId: 'server',
			event: 'server_error',
			properties: {
				error: err instanceof Error ? err.message : String(err),
				stack: err instanceof Error ? err.stack : undefined,
				...ctx
			}
		});
	}
}

export async function identify(userId: string, traits?: Record<string, unknown>) {
	if (!enabled) return;
	if (browser) {
		const ph = await getClientPh();
		ph?.identify(userId, traits);
	} else {
		const ph = await getServerPh();
		ph?.identify({ distinctId: userId, properties: traits });
	}
}

export async function reset() {
	if (!enabled || !browser) return;
	const ph = await getClientPh();
	ph?.reset();
}

export async function shutdown() {
	if (!enabled || browser) return;
	if (!serverPhInstance) return;
	await serverPhInstance.shutdown();
	serverPhInstance = null;
}

let clientPhInstance: import('posthog-js').default | null = null;

async function getClientPh() {
	if (!browser) return null;
	if (clientPhInstance) return clientPhInstance;
	const mod = await import('posthog-js');
	clientPhInstance = mod.default;
	if (!(clientPhInstance as Record<string, unknown>).__tilt_init) {
		clientPhInstance.init(PUBLIC_POSTHOG_PROJECT_TOKEN, {
			api_host: '/ingest',
			ui_host: PUBLIC_POSTHOG_HOST,
			defaults: '2026-01-30',
			capture_pageview: false,
			capture_exceptions: true,
			person_profiles: 'identified_only'
		});
		(clientPhInstance as Record<string, unknown>).__tilt_init = true;
	}
	return clientPhInstance;
}

let serverPhInstance: import('posthog-node').PostHog | null = null;

async function getServerPh() {
	if (browser) return null;
	if (serverPhInstance) return serverPhInstance;
	const { PostHog } = await import('posthog-node');
	serverPhInstance = new PostHog(PUBLIC_POSTHOG_PROJECT_TOKEN, {
		host: PUBLIC_POSTHOG_HOST,
		personProfiles: 'identified_only'
	});
	return serverPhInstance;
}
