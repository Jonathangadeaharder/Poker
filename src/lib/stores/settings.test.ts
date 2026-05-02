// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('$app/environment', () => ({ browser: true }));

describe('settings store', () => {
	beforeEach(() => {
		localStorage.clear();
		vi.resetModules();
	});

	it('defaults card style to classic', async () => {
		const { cardStyle } = await import('./settings.svelte.ts');
		expect(cardStyle.value).toBe('classic');
	});

	it('updates card style', async () => {
		const { cardStyle, setCardStyle } = await import('./settings.svelte.ts');
		setCardStyle('luxury');
		expect(cardStyle.value).toBe('luxury');
	});

	it('persists card style to localStorage', async () => {
		const { setCardStyle } = await import('./settings.svelte.ts');
		setCardStyle('minimal');
		expect(localStorage.getItem('tilt_card_style')).toBe('minimal');
	});

	it('loads saved card style from localStorage', async () => {
		localStorage.setItem('tilt_card_style', 'luxury');
		const { cardStyle } = await import('./settings.svelte.ts');
		expect(cardStyle.value).toBe('luxury');
	});

	it('defaults sound enabled to true', async () => {
		const { soundEnabled } = await import('./settings.svelte.ts');
		expect(soundEnabled.value).toBe(true);
	});

	it('toggles sound', async () => {
		const { soundEnabled, toggleSound } = await import('./settings.svelte.ts');
		toggleSound();
		expect(soundEnabled.value).toBe(false);
		toggleSound();
		expect(soundEnabled.value).toBe(true);
	});

	it('defaults haptics enabled to true', async () => {
		const { hapticsEnabled } = await import('./settings.svelte.ts');
		expect(hapticsEnabled.value).toBe(true);
	});

	it('toggles haptics', async () => {
		const { hapticsEnabled, toggleHaptics } = await import('./settings.svelte.ts');
		toggleHaptics();
		expect(hapticsEnabled.value).toBe(false);
	});
});
