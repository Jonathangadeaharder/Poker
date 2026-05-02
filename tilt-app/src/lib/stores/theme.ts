export interface ThemeColors {
	felt: string;
	felt2: string;
	felt3: string;
	cream: string;
	coral: string;
	gold: string;
}

export type ThemeName = 'felt' | 'midnight' | 'clay' | 'paper';

export const themes: Record<ThemeName, ThemeColors> = {
	felt: {
		felt: '#0e2a20',
		felt2: '#143628',
		felt3: '#1d4a36',
		cream: '#f5e9d4',
		coral: '#ff5b48',
		gold: '#e9b949'
	},
	midnight: {
		felt: '#0a0e27',
		felt2: '#141a3a',
		felt3: '#1d2752',
		cream: '#e8eaff',
		coral: '#a78bfa',
		gold: '#22d3ee'
	},
	clay: {
		felt: '#2a1810',
		felt2: '#3a2418',
		felt3: '#4a3020',
		cream: '#f4ede0',
		coral: '#ff7849',
		gold: '#e9b949'
	},
	paper: {
		felt: '#f4ede0',
		felt2: '#ede4d2',
		felt3: '#e2d5b8',
		cream: '#1a1a1a',
		coral: '#dc2626',
		gold: '#b8860b'
	}
};

export function applyTheme(theme: ThemeName): void {
	const t = themes[theme];
	if (!t) return;
	const root = document.documentElement;
	root.style.setProperty('--felt', t.felt);
	root.style.setProperty('--felt-2', t.felt2);
	root.style.setProperty('--felt-3', t.felt3);
	root.style.setProperty('--cream', t.cream);
	root.style.setProperty('--coral', t.coral);
	root.style.setProperty('--gold', t.gold);
}
