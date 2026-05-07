# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: user-journeys.spec.ts >> Poker — Quiz Interaction >> clicking an answer registers interaction
- Location: e2e/user-journeys.spec.ts:226:2

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
          - generic [ref=e15]: push_fold
          - generic [ref=e16]: medium
        - paragraph [ref=e17]: 76s from CO with 10bb? Open-shove or fold?
        - text: +15 XP
      - generic [ref=e18]:
        - button "A Shove" [ref=e19] [cursor=pointer]:
          - generic [ref=e20]: A
          - generic [ref=e21]: Shove
        - button "B Min-Raise" [ref=e22] [cursor=pointer]:
          - generic [ref=e23]: B
          - generic [ref=e24]: Min-Raise
        - button "C Limp" [ref=e25] [cursor=pointer]:
          - generic [ref=e26]: C
          - generic [ref=e27]: Limp
        - button "D Fold" [ref=e28] [cursor=pointer]:
          - generic [ref=e29]: D
          - generic [ref=e30]: Fold
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
  129 | 		page.on('console', (msg) => {
  130 | 			if (msg.type() === 'error') errors.push(msg.text());
  131 | 		});
  132 | 
  133 | 		const email = `test+${Date.now()}@example.com`;
  134 | 		await registerUser(page, email, 'TestPassword123!');
  135 | 		await page.waitForTimeout(2000);
  136 | 
  137 | 		// Filter out known CSP errors
  138 | 		const realErrors = errors.filter(
  139 | 			(e) => !e.includes('Content Security Policy') && !e.includes('style-src')
  140 | 		);
  141 | 		// Log but don't fail — documenting current state
  142 | 		if (realErrors.length > 0) {
  143 | 			console.log('Console errors on home:', realErrors);
  144 | 		}
  145 | 	});
  146 | });
  147 | 
  148 | // ─── NEW TEST SUITES ─────────────────────────────────────────────
  149 | 
  150 | const EXISTING_EMAIL = 'poker@example.com';
  151 | const EXISTING_PASSWORD = 'TestPassword123!';
  152 | 
  153 | async function loginUser(page: import('@playwright/test').Page, email: string, password: string) {
  154 | 	await page.goto('/login');
  155 | 	await page.getByRole('textbox', { name: 'EMAIL' }).fill(email);
  156 | 	await page.getByRole('textbox', { name: 'PASSWORD' }).fill(password);
  157 | 	await page.getByRole('button', { name: 'Sign in' }).click();
  158 | 	await page.waitForURL(/\/home/, { timeout: 15000 }).catch(async () => {
  159 | 		const currentUrl = page.url();
  160 | 		throw new Error(`Login failed: expected redirect to /home but got ${currentUrl}`);
  161 | 	});
  162 | }
  163 | 
  164 | async function loginAsExistingUser(page: import('@playwright/test').Page) {
  165 | 	await loginUser(page, EXISTING_EMAIL, EXISTING_PASSWORD);
  166 | }
  167 | 
  168 | test.describe('Poker — Login Flow', () => {
  169 | 	test('login with existing user redirects to home', async ({ page }) => {
  170 | 		await loginAsExistingUser(page);
  171 | 		await expect(page).toHaveURL(/\/home/);
  172 | 	});
  173 | 
  174 | 	test('login with wrong password shows error', async ({ page }) => {
  175 | 		await page.goto('/login');
  176 | 		await page.getByRole('textbox', { name: 'EMAIL' }).fill('poker@example.com');
  177 | 		await page.getByRole('textbox', { name: 'PASSWORD' }).fill('WrongPassword999!');
  178 | 		await page.getByRole('button', { name: 'Sign in' }).click();
  179 | 		await page.waitForTimeout(2000);
  180 | 		await expect(page).toHaveURL(/\/login/);
  181 | 		await expect(page.getByText(/error|invalid|incorrect|wrong|failed/i)).toBeVisible();
  182 | 	});
  183 | });
  184 | 
  185 | test.describe('Poker — Navigation Edge Cases', () => {
  186 | 	test.beforeEach(async ({ page }) => {
  187 | 		await loginAsExistingUser(page);
  188 | 	});
  189 | 
  190 | 	test('nav TODAY is visible on home page', async ({ page }) => {
  191 | 		await expect(page.getByRole('button', { name: /TODAY/i })).toBeVisible();
  192 | 	});
  193 | 
  194 | 	test('nav PRACTICE quiz page loads with quiz interface', async ({ page }) => {
  195 | 		await page.goto('/practice/quiz');
  196 | 		await page.waitForTimeout(3000);
  197 | 		const pageText = await page.textContent('body');
  198 | 		const hasQuestion = pageText?.includes('?');
  199 | 		const hasAnswerButtons = /Yes|No|Suited|Sometimes/.test(pageText || '');
  200 | 		const hasProgress = /\d+\s*\/\s*\d+/.test(pageText || '');
  201 | 		expect(hasQuestion || hasAnswerButtons || hasProgress).toBeTruthy();
  202 | 	});
  203 | 
  204 | 	test('nav PROFILE shows stats', async ({ page }) => {
  205 | 		await page.goto('/profile');
  206 | 		const bodyText = await page.textContent('body');
  207 | 		const hasStat = /level|xp|games?|win|loss|streak|achievement|hand/i.test(bodyText ?? '');
  208 | 		expect(hasStat).toBeTruthy();
  209 | 	});
  210 | });
  211 | 
  212 | test.describe('Poker — Quiz Interaction', () => {
  213 | 	test.beforeEach(async ({ page }) => {
  214 | 		await loginAsExistingUser(page);
  215 | 		await page.goto('/practice/quiz');
  216 | 		await page.waitForTimeout(3000); // Quiz fetches questions async
  217 | 	});
  218 | 
  219 | 	test('quiz page shows a question and answer options', async ({ page }) => {
  220 | 		const pageText = await page.textContent('body');
  221 | 		const hasQuestion = pageText?.includes('?');
  222 | 		const hasAnswers = /Yes|No|Suited|Sometimes/.test(pageText || '');
  223 | 		expect(hasQuestion || hasAnswers).toBeTruthy();
  224 | 	});
  225 | 
  226 | 	test('clicking an answer registers interaction', async ({ page }) => {
  227 | 		const firstAnswer = page.getByRole('button').filter({ hasText: /Yes|No|Only suited|Sometimes/i }).first();
  228 | 		const isVisible = await firstAnswer.isVisible().catch(() => false);
> 229 | 		expect(isVisible).toBe(true);
      |                     ^ Error: expect(received).toBe(expected) // Object.is equality
  230 | 		if (!isVisible) {
  231 | 			throw new Error('No matching answer button found - expected Yes/No/Only suited/Sometimes');
  232 | 		}
  233 | 		await firstAnswer.click();
  234 | 		await page.waitForTimeout(1000);
  235 | 		const afterText = await page.textContent('body');
  236 | 		expect(afterText).toBeTruthy();
  237 | 		expect(afterText?.length).toBeGreaterThan(0);
  238 | 	});
  239 | 
  240 | 	test('quiz shows progress counter', async ({ page }) => {
  241 | 		const pageText = await page.textContent('body');
  242 | 		const hasProgress = /\d+\s*\/\s*\d+/.test(pageText || '');
  243 | 		expect(hasProgress).toBeTruthy();
  244 | 	});
  245 | });
  246 | 
  247 | test.describe('Poker — Profile/You Page (enhanced)', () => {
  248 | 	test.beforeEach(async ({ page }) => {
  249 | 		await loginAsExistingUser(page);
  250 | 		await page.goto('/profile');
  251 | 		await page.waitForTimeout(2000); // Hydrate
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
```