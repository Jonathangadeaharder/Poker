import { describe, expect, it, vi } from 'vitest';
import { captureError, identify, initTelemetry, pageview, reset, track } from './telemetry';

vi.mock('posthog-js', () => ({
	default: {
		init: vi.fn(),
		capture: vi.fn(),
		identify: vi.fn(),
		reset: vi.fn()
	}
}));

vi.mock('$env/static/public', () => ({
	PUBLIC_POSTHOG_HOST: 'https://app.posthog.com',
	PUBLIC_POSTHOG_PROJECT_TOKEN: 'phc_test_token'
}));

describe('telemetry wrapper', () => {
	it('initializes and tracks events', () => {
		expect(() => initTelemetry()).not.toThrow();
		expect(() => track('test_event', { foo: 'bar' })).not.toThrow();
		expect(() => pageview('/test')).not.toThrow();
		expect(() => captureError(new Error('test error'))).not.toThrow();
		expect(() => identify('user_123', { plan: 'pro' })).not.toThrow();
		expect(() => reset()).not.toThrow();
	});
});
