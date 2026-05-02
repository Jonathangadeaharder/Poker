import { browser } from '$app/environment';

export type CardStyle = 'classic' | 'minimal' | 'luxury';

function loadCardStyle(): CardStyle {
	if (!browser) return 'classic';
	const saved = localStorage.getItem('tilt_card_style');
	if (saved === 'classic' || saved === 'minimal' || saved === 'luxury') return saved;
	return 'classic';
}

function loadBool(key: string, fallback: boolean): boolean {
	if (!browser) return fallback;
	const v = localStorage.getItem(key);
	if (v === null) return fallback;
	return v === 'true';
}

export const cardStyle = $state<{ value: CardStyle }>({ value: loadCardStyle() });
export const soundEnabled = $state<{ value: boolean }>({ value: loadBool('tilt_sound', true) });
export const hapticsEnabled = $state<{ value: boolean }>({ value: loadBool('tilt_haptics', true) });

export function setCardStyle(style: CardStyle): void {
	cardStyle.value = style;
	if (browser) localStorage.setItem('tilt_card_style', style);
}

export function toggleSound(): void {
	soundEnabled.value = !soundEnabled.value;
	if (browser) localStorage.setItem('tilt_sound', String(soundEnabled.value));
}

export function toggleHaptics(): void {
	hapticsEnabled.value = !hapticsEnabled.value;
	if (browser) localStorage.setItem('tilt_haptics', String(hapticsEnabled.value));
}
