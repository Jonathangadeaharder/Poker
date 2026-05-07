# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: user-journeys.spec.ts >> Poker — Profile Creation Fallback >> home page shows dynamic username not hardcoded Player
- Location: e2e/user-journeys.spec.ts:347:2

# Error details

```
Error: expect(received).not.toMatch(expected)

Expected pattern: not /\bPlayer\b/
Received string:      "
		 P Hey, Player Lvl 1 · Poker Novice  🔥 0  Today 0/100 xp Keep the streak hot 🔥  0%  Continue session · 100 xp left Hand of the Day Q ♥ Q ♥ J ♥ J ♥ WED · #284 QJ suited on a wet board. Hero or zero? 🟢🟢🟢🟡⚪ 3 MIN · +50 XP What's the mood? ⚡ Just 5 min Quick drill🧠 Feel smart Easy wins🔥 Challenge Hard mode🎬 Replay Last session Your path 3 / 18 MASTERED  Preflop ranges Mastered  Continuation betting In progress  River decisions Locked · Lvl 5  📅 Today🎯 Practice🔄 Replay👤 You 
			
			
				{
					__sveltekit_dev = {
						base: new URL(\".\", location).pathname.slice(0, -1),
						env: {\"PUBLIC_SUPABASE_ANON_KEY\":\"sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH\",\"PUBLIC_SUPABASE_URL\":\"http://127.0.0.1:54321\"}
					};

					const element = document.currentScript.parentElement;

					Promise.all([
						import(\"/node_modules/.pnpm/@sveltejs+kit@2.59.0_@sveltejs+vite-plugin-svelte@7.0.0_svelte@5.55.5_vite@8.0.10_@type_72ff1850efe0a9b28484ed03a4d12607/node_modules/@sveltejs/kit/src/runtime/client/entry.js\"),
						import(\"/@fs/Users/jonathangadeaharder/Documents/projects/games/Poker/.svelte-kit/generated/client/app.js\")
					]).then(([kit, app]) => {
						kit.start(app, element, {
							node_ids: [0, 6],
							data: [null,null],
							form: null,
							error: null
						});
					});
				}
			
		
	

"
```

# Page snapshot

```yaml
- generic [ref=e2]:
  - generic [ref=e3]:
    - generic [ref=e4]:
      - generic [ref=e6]:
        - generic [ref=e7]: P
        - generic [ref=e8]:
          - generic [ref=e9]: Hey, Player
          - generic [ref=e10]: Lvl 1 · Poker Novice
      - generic [ref=e12]:
        - generic [ref=e13]: 🔥
        - generic [ref=e14]: "0"
    - generic [ref=e15]:
      - generic [ref=e16]:
        - generic [ref=e18]: Today
        - generic [ref=e19]:
          - generic [ref=e20]:
            - generic [ref=e21]: 0/100 xp
            - generic [ref=e22]: Keep the streak hot 🔥
          - generic [ref=e23]:
            - img [ref=e24]
            - generic [ref=e28]: 0%
        - button "Continue session · 100 xp left" [ref=e29] [cursor=pointer]
      - generic [ref=e30]:
        - generic [ref=e32]: Hand of the Day
        - 'button "Q ♥ Q ♥ J ♥ J ♥ WED · #284 QJ suited on a wet board. Hero or zero? 🟢 🟢 🟢 🟡 ⚪ 3 MIN · +50 XP" [ref=e33] [cursor=pointer]':
          - generic [ref=e34]:
            - generic [ref=e36]:
              - generic [ref=e37]:
                - generic [ref=e38]: Q
                - generic [ref=e39]: ♥
              - generic [ref=e40]:
                - generic [ref=e41]: Q
                - generic [ref=e42]: ♥
            - generic [ref=e44]:
              - generic [ref=e45]:
                - generic [ref=e46]: J
                - generic [ref=e47]: ♥
              - generic [ref=e48]:
                - generic [ref=e49]: J
                - generic [ref=e50]: ♥
          - generic [ref=e51]: "WED · #284"
          - generic [ref=e52]: QJ suited on a wet board. Hero or zero?
          - generic [ref=e53]:
            - generic [ref=e54]:
              - generic [ref=e55]: 🟢
              - generic [ref=e56]: 🟢
              - generic [ref=e57]: 🟢
              - generic [ref=e58]: 🟡
              - generic [ref=e59]: ⚪
            - generic [ref=e60]: 3 MIN · +50 XP
      - generic [ref=e61]:
        - generic [ref=e62]: What's the mood?
        - generic [ref=e63]:
          - button "⚡ Just 5 min Quick drill" [ref=e64] [cursor=pointer]:
            - generic [ref=e65]: ⚡
            - generic [ref=e66]: Just 5 min
            - generic [ref=e67]: Quick drill
          - button "🧠 Feel smart Easy wins" [ref=e68] [cursor=pointer]:
            - generic [ref=e69]: 🧠
            - generic [ref=e70]: Feel smart
            - generic [ref=e71]: Easy wins
          - button "🔥 Challenge Hard mode" [ref=e72] [cursor=pointer]:
            - generic [ref=e73]: 🔥
            - generic [ref=e74]: Challenge
            - generic [ref=e75]: Hard mode
          - button "🎬 Replay Last session" [ref=e76] [cursor=pointer]:
            - generic [ref=e77]: 🎬
            - generic [ref=e78]: Replay
            - generic [ref=e79]: Last session
      - generic [ref=e80]:
        - generic [ref=e81]:
          - generic [ref=e82]: Your path
          - generic [ref=e83]: 3 / 18 MASTERED
        - generic [ref=e84]:
          - generic [ref=e87]:
            - generic [ref=e88]: Preflop ranges
            - generic [ref=e89]: Mastered
          - generic [ref=e94]:
            - generic [ref=e95]: Continuation betting
            - generic [ref=e96]: In progress
          - generic [ref=e101]:
            - generic [ref=e102]: River decisions
            - generic [ref=e103]: Locked · Lvl 5
  - navigation [ref=e105]:
    - button "📅 Today" [ref=e106] [cursor=pointer]:
      - generic [ref=e107]: 📅
      - generic [ref=e108]: Today
    - button "🎯 Practice" [ref=e109] [cursor=pointer]:
      - generic [ref=e110]: 🎯
      - generic [ref=e111]: Practice
    - button "🔄 Replay" [ref=e112] [cursor=pointer]:
      - generic [ref=e113]: 🔄
      - generic [ref=e114]: Replay
    - button "👤 You" [ref=e115] [cursor=pointer]:
      - generic [ref=e116]: 👤
      - generic [ref=e117]: You
```

# Test source

```ts
  252 | 	});
  253 | 
  254 | 	test('profile page shows username', async ({ page }) => {
  255 | 		const bodyText = await page.textContent('body');
  256 | 		expect(bodyText).toBeTruthy();
  257 | 		expect(bodyText!.length).toBeGreaterThan(0);
  258 | 	});
  259 | 
  260 | 	test('profile page shows stats section', async ({ page }) => {
  261 | 		await page.waitForTimeout(2000);
  262 | 		const pageText = await page.textContent('body');
  263 | 		const hasLevel = /Lvl|Level/i.test(pageText || '');
  264 | 		const hasXp = /XP|experience/i.test(pageText || '');
  265 | 		const hasStreak = /Streak|Day/i.test(pageText || '');
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
> 352 | 		expect(bodyText).not.toMatch(/\bPlayer\b/);
      |                        ^ Error: expect(received).not.toMatch(expected)
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
  366 | 		expect(isVisible).toBe(true);
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