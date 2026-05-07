# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: user-journeys.spec.ts >> Poker — Quiz Deep Interaction >> quiz answer click changes page state
- Location: e2e/user-journeys.spec.ts:363:2

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: true
Received: false
```

# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e2]:
    - generic [ref=e3]:
      - button "Back" [ref=e5] [cursor=pointer]: ‹
      - generic [ref=e6]: Quiz
    - generic [ref=e7]:
      - generic [ref=e10]:
        - generic [ref=e11]: 1 / 10
        - generic [ref=e12]: 0 correct
      - generic [ref=e13]:
        - generic [ref=e14]:
          - generic [ref=e15]: ranges
          - generic [ref=e16]: easy
        - paragraph [ref=e17]: Which RFI range is correct for BTN?
        - text: +10 XP
      - generic [ref=e18]:
        - button "A 33%" [ref=e19] [cursor=pointer]:
          - generic [ref=e20]: A
          - generic [ref=e21]: 33%
        - button "B 15%" [ref=e22] [cursor=pointer]:
          - generic [ref=e23]: B
          - generic [ref=e24]: 15%
        - button "C 45%" [ref=e25] [cursor=pointer]:
          - generic [ref=e26]: C
          - generic [ref=e27]: 45%
        - button "D 35%" [ref=e28] [cursor=pointer]:
          - generic [ref=e29]: D
          - generic [ref=e30]: 35%
  - navigation [ref=e31]:
    - button "📅 Today" [ref=e32] [cursor=pointer]:
      - generic [ref=e33]: 📅
      - generic [ref=e34]: Today
    - button "🎯 Practice" [ref=e35] [cursor=pointer]:
      - generic [ref=e36]: 🎯
      - generic [ref=e37]: Practice
    - button "🔄 Replay" [ref=e38] [cursor=pointer]:
      - generic [ref=e39]: 🔄
      - generic [ref=e40]: Replay
    - button "👤 You" [ref=e41] [cursor=pointer]:
      - generic [ref=e42]: 👤
      - generic [ref=e43]: You
```

# Test source

```ts
  266 | 		const hasBadges = /Badges|Achievements/i.test(pageText || '');
  267 | 		expect(hasLevel || hasXp || hasStreak || hasBadges).toBeTruthy();
  268 | 	});
  269 | });
  270 | 
  271 | test.describe('Poker — Console Errors (stricter)', () => {
  272 | 	test('no real console errors on major pages', async ({ page }) => {
  273 | 		const errors: string[] = [];
  274 | 		page.on('pageerror', (err) => errors.push(err.message));
  275 | 		page.on('console', (msg) => {
  276 | 			if (msg.type() === 'error') errors.push(msg.text());
  277 | 		});
  278 | 
  279 | 		await loginAsExistingUser(page);
  280 | 		await page.waitForTimeout(1000);
  281 | 
  282 | 		await page.goto('/practice/quiz');
  283 | 		await page.waitForTimeout(1000);
  284 | 
  285 | 		await page.goto('/profile');
  286 | 		await page.waitForTimeout(1000);
  287 | 
  288 | 		// Filter out known errors: CSP and profile-not-found (PGRST116)
  289 | 		const realErrors = errors.filter(
  290 | 			(e) => !e.includes('Content Security Policy') && !e.includes('style-src') && !e.includes('PGRST116') && !e.includes('406')
  291 | 		);
  292 | 		expect(realErrors).toHaveLength(0);
  293 | 	});
  294 | });
  295 | 
  296 | test.describe('Poker — Home Page Edge Cases', () => {
  297 | 	test.beforeEach(async ({ page }) => {
  298 | 		await loginAsExistingUser(page);
  299 | 	});
  300 | 
  301 | 	test('home mood picker buttons are visible', async ({ page }) => {
  302 | 		const just5min = page.getByRole('button', { name: /just 5 min|5.?min/i });
  303 | 		const feelSmart = page.getByRole('button', { name: /feel smart|smart/i });
  304 | 		const challenge = page.getByRole('button', { name: /challenge/i });
  305 | 		const replay = page.getByRole('button', { name: /replay/i });
  306 | 		const visibleButtons = (
  307 | 			await Promise.all([
  308 | 				just5min.isVisible().catch(() => false),
  309 | 				feelSmart.isVisible().catch(() => false),
  310 | 				challenge.isVisible().catch(() => false),
  311 | 				replay.isVisible().catch(() => false)
  312 | 			])
  313 | 		).filter(Boolean).length;
  314 | 		expect(visibleButtons).toBeGreaterThanOrEqual(2);
  315 | 	});
  316 | 
  317 | 	test('home hand of the day card is visible', async ({ page }) => {
  318 | 		await expect(page.getByText('HAND OF THE DAY')).toBeVisible();
  319 | 	});
  320 | 
  321 | 	test('home learning path shows modules', async ({ page }) => {
  322 | 		await expect(page.getByText(/Your path/i)).toBeVisible();
  323 | 		const modules = page.getByText(/module|lesson|chapter|level \d|beginner|intermediate|advanced|pre.?flop|flop|turn|river|hand|range|bluff|position|bet/i);
  324 | 		await expect(modules.first()).toBeVisible();
  325 | 	});
  326 | });
  327 | 
  328 | test.describe('Poker — Profile Creation Fallback', () => {
  329 | 	test.beforeEach(async ({ page }) => {
  330 | 		await loginAsExistingUser(page);
  331 | 	});
  332 | 
  333 | 	test('profile fetch does not throw PGRST116', async ({ page }) => {
  334 | 		const errors: string[] = [];
  335 | 		page.on('pageerror', (err) => errors.push(err.message));
  336 | 		page.on('console', (msg) => {
  337 | 			if (msg.type() === 'error') errors.push(msg.text());
  338 | 		});
  339 | 
  340 | 		await page.goto('/home');
  341 | 		await page.waitForTimeout(3000);
  342 | 
  343 | 		const hasPgrst116 = errors.some((e) => e.includes('PGRST116'));
  344 | 		expect(hasPgrst116).toBeFalsy();
  345 | 	});
  346 | 
  347 | 	test('home page shows dynamic username not hardcoded Player', async ({ page }) => {
  348 | 		await page.goto('/home');
  349 | 		await page.waitForTimeout(2000);
  350 | 		const bodyText = await page.textContent('body');
  351 | 		// Verify username is not the fallback 'Player' literal
  352 | 		expect(bodyText).not.toMatch(/\bPlayer\b/);
  353 | 	});
  354 | });
  355 | 
  356 | test.describe('Poker — Quiz Deep Interaction', () => {
  357 | 	test.beforeEach(async ({ page }) => {
  358 | 		await loginAsExistingUser(page);
  359 | 		await page.goto('/practice/quiz');
  360 | 		await page.waitForTimeout(3000);
  361 | 	});
  362 | 
  363 | 	test('quiz answer click changes page state', async ({ page }) => {
  364 | 		const firstAnswer = page.getByRole('button').filter({ hasText: /Yes|No|Only suited|Sometimes/i }).first();
  365 | 		const isVisible = await firstAnswer.isVisible().catch(() => false);
> 366 | 		expect(isVisible).toBe(true);
      |                     ^ Error: expect(received).toBe(expected) // Object.is equality
  367 | 		if (!isVisible) {
  368 | 			throw new Error('No matching answer button found - expected Yes/No/Only suited/Sometimes');
  369 | 		}
  370 | 		await firstAnswer.click();
  371 | 		await page.waitForTimeout(1000);
  372 | 		const newText = await page.textContent('body');
  373 | 		expect(newText).toBeTruthy();
  374 | 		expect(newText!.length).toBeGreaterThan(0);
  375 | 	});
  376 | 
  377 | 	test('quiz progress counter updates after answer', async ({ page }) => {
  378 | 		const firstAnswer = page.getByRole('button').filter({ hasText: /Yes|No|Only suited|Sometimes/i }).first();
  379 | 		if (await firstAnswer.isVisible().catch(() => false)) {
  380 | 			await firstAnswer.click();
  381 | 			await page.waitForTimeout(1000);
  382 | 			const newText = await page.textContent('body');
  383 | 			expect(newText?.length).toBeGreaterThan(0);
  384 | 		}
  385 | 	});
  386 | 
  387 | 	test('quiz page persists after refresh', async ({ page }) => {
  388 | 		await page.goto('/practice/quiz');
  389 | 		await page.waitForTimeout(3000);
  390 | 		await page.reload();
  391 | 		await page.waitForTimeout(3000);
  392 | 		const bodyText = await page.textContent('body');
  393 | 		const hasQuizContent = /\?|Yes|No|Suited|Sometimes/.test(bodyText || '');
  394 | 		expect(hasQuizContent).toBeTruthy();
  395 | 	});
  396 | });
  397 | 
  398 | test.describe('Poker — XP Progress Display', () => {
  399 | 	test.beforeEach(async ({ page }) => {
  400 | 		await loginAsExistingUser(page);
  401 | 	});
  402 | 
  403 | 	test('home page shows XP progress not NaN', async ({ page }) => {
  404 | 		await page.goto('/home');
  405 | 		await page.waitForTimeout(2000);
  406 | 		const bodyText = await page.textContent('body');
  407 | 		expect(bodyText).not.toContain('NaN');
  408 | 		expect(bodyText).not.toContain('Infinity');
  409 | 	});
  410 | 
  411 | 	test('profile page shows level info not NaN', async ({ page }) => {
  412 | 		await page.goto('/profile');
  413 | 		await page.waitForTimeout(2000);
  414 | 		const bodyText = await page.textContent('body');
  415 | 		expect(bodyText).not.toContain('NaN');
  416 | 		expect(bodyText).not.toContain('Infinity');
  417 | 	});
  418 | });
  419 | 
```