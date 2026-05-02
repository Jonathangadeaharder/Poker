import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit(),
		SvelteKitPWA({
			manifest: {
				name: 'Tilt Poker Training',
				short_name: 'Tilt',
				theme_color: '#0e2a20',
				background_color: '#0e2a20',
				display: 'standalone'
			},
			workbox: {
				globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}']
			}
		})
	]
});
