import posthog from 'posthog-js';
import { PUBLIC_POSTHOG_HOST, PUBLIC_POSTHOG_PROJECT_TOKEN } from '$env/static/public';

let initialized = false;

export function initTelemetry(): void {
	if (initialized || typeof window === 'undefined') return;
	if (PUBLIC_POSTHOG_PROJECT_TOKEN) {
		posthog.init(PUBLIC_POSTHOG_PROJECT_TOKEN, {
			api_host: PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
			loaded: () => {
				initialized = true;
			}
		});
		initialized = true;
	}
}

export function track(eventName: string, properties?: Record<string, unknown>): void {
	initTelemetry();
	if (initialized && typeof window !== 'undefined') {
		posthog.capture(eventName, properties);
	}
}

export function pageview(url?: string): void {
	initTelemetry();
	if (initialized && typeof window !== 'undefined') {
		posthog.capture('$pageview', { current_url: url ?? window.location.href });
	}
}

export function captureError(error: unknown, context?: Record<string, unknown>): void {
	initTelemetry();
	if (initialized && typeof window !== 'undefined') {
		const message = error instanceof Error ? error.message : String(error);
		posthog.capture('exception', { message, error, ...context });
	}
}

export function identify(distinctId: string, userProperties?: Record<string, unknown>): void {
	initTelemetry();
	if (initialized && typeof window !== 'undefined') {
		posthog.identify(distinctId, userProperties);
	}
}

export function reset(): void {
	if (initialized && typeof window !== 'undefined') {
		posthog.reset();
	}
}
