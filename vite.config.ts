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
				description: 'Poker training app with GTO principles',
				theme_color: '#0e2a20',
				background_color: '#0e2a20',
				display: 'standalone',
				orientation: 'portrait',
				// Relative so they resolve against paths.base ('/Tilt') wherever
				// the app is hosted. vite-plugin-pwa rewrites these against base.
				scope: './',
				start_url: './',
				id: './',
				icons: [
					{ src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
					{ src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
					{
						src: 'maskable-512x512.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'maskable'
					}
				]
			},
			workbox: {
				globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}']
			}
		})
	]
});
