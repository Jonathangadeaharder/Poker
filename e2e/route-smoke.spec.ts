import { test, expect } from '@playwright/test';

const ROUTES = [
	{ path: '/', description: 'landing page' },
	{ path: '/login', description: 'login page' },
	{ path: '/register', description: 'register page' }
];

const AUTH_ROUTES = [
	{ path: '/home', description: 'home dashboard' },
	{ path: '/learn/ranges', description: 'ranges trainer' },
	{ path: '/learn/pushfold', description: 'push-fold trainer' },
	{ path: '/learn/exploits', description: 'exploits lesson' },
	{ path: '/learn/plan', description: 'training plan' },
	{ path: '/practice/quiz', description: 'quiz practice' },
	{ path: '/practice/srs', description: 'spaced repetition' },
	{ path: '/profile', description: 'user profile' }
];

test.describe('Unauthenticated route smoke', () => {
	for (const { path, description } of ROUTES) {
		test(`${description} (${path}) renders`, async ({ page }) => {
			await page.goto(path);
			await expect(page.locator('body')).toBeVisible();
		});
	}
});

test.describe('Authenticated route smoke', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/login');
		await page.getByRole('textbox', { name: 'EMAIL' }).fill('poker@example.com');
		await page.getByRole('textbox', { name: 'PASSWORD' }).fill('TestPassword123!');
		await page.getByRole('button', { name: 'Sign in' }).click();
		await page.waitForURL(/\/home/, { timeout: 15000 });
	});

	for (const { path, description } of AUTH_ROUTES) {
		test(`${description} (${path}) renders without error`, async ({ page }) => {
			const errors: string[] = [];
			page.on('pageerror', (err) => errors.push(err.message));
			await page.goto(path);
			await page.waitForLoadState('networkidle');
			await expect(page.locator('body')).toBeVisible();
			const realErrors = errors.filter(
				(e) =>
					!e.includes('Content Security Policy') &&
					!e.includes('style-src') &&
					!e.includes('PGRST116')
			);
			expect(realErrors).toHaveLength(0);
		});
	}
});
