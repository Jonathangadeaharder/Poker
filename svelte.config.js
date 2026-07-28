import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	compilerOptions: {
		// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
		runes: ({ filename }) => (filename.split(/[/\\]/).includes('node_modules') ? undefined : true)
	},
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			// SPA shell: dynamic routes (e.g. results/[sessionId]) aren't
			// prerendered, so unknown paths fall back to this shell and the
			// client router resolves them. nginx serves it with a 200.
			fallback: '200.html',
			precompress: false
		}),
		prerender: {
			entries: ['*']
		},
		paths: {
			base: '/Tilt'
		}
	}
};

export default config;
