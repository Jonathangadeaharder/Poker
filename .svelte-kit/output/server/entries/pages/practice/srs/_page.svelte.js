import { B as attr, V as escape_html, a as ensure_array_like, i as derived, l as stringify, r as attr_style } from "../../../../chunks/dev.js";
import { t as goto } from "../../../../chunks/client.js";
import "../../../../chunks/navigation.js";
import { t as XP_REWARDS } from "../../../../chunks/gamification.js";
import { t as TopBar } from "../../../../chunks/TopBar.js";
import "../../../../chunks/soundManager.js";
//#region src/lib/core/spacedRepetition.ts
/**
* Spaced Repetition Engine
* Based on SM-2 Algorithm (SuperMemo 2)
*
* Research shows: 90% retention is optimal for long-term learning
* SM-2 is the gold standard for SRS (Spaced Repetition Systems)
*/
/**
* SM-2 Algorithm Implementation
*
* Three main properties:
* - n: Repetition number (how many times correctly repeated)
* - EF: Easiness Factor (2.5 start, 1.3 minimum)
* - I: Inter-repetition interval (in days)
*/
var DIFFICULTY_RATINGS = {
	AGAIN: 0,
	HARD: 1,
	GOOD: 2,
	EASY: 3
};
//#endregion
//#region src/routes/practice/srs/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const DECK_META = {
			"Preflop Ranges (6-Max)": {
				icon: "🃏",
				color: "var(--gold)"
			},
			"Push/Fold Charts (MTT)": {
				icon: "📊",
				color: "var(--coral)"
			},
			"Exploitative Strategies": {
				icon: "🎯",
				color: "#22c55e"
			},
			"Concepts & Theory": {
				icon: "🧠",
				color: "#7c6cf0"
			}
		};
		let decks = [];
		let session = null;
		derived(() => session?.getCurrentCard() ?? null);
		const sessionCards = derived(() => session?.cardsToday.length ?? 0);
		const currentIndex = derived(() => session?.currentIndex ?? 0);
		derived(() => sessionCards() > 0 ? currentIndex() / sessionCards() : 0);
		const deckStats = derived(() => decks.map((d) => ({
			deck: d,
			stats: d.getStats()
		})));
		DIFFICULTY_RATINGS.AGAIN, DIFFICULTY_RATINGS.HARD, XP_REWARDS.CARD_REVIEW_HARD, DIFFICULTY_RATINGS.GOOD, XP_REWARDS.CARD_REVIEW_GOOD, DIFFICULTY_RATINGS.EASY, XP_REWARDS.CARD_REVIEW_EASY;
		$$renderer.push(`<div class="screen felt-bg">`);
		{
			function center($$renderer) {
				$$renderer.push(`<!---->SRS Flashcards`);
			}
			TopBar($$renderer, {
				onBack: () => goto("/practice"),
				center,
				$$slots: { center: true }
			});
		}
		$$renderer.push(`<!----> <div class="scroll-content svelte-1mi2bql">`);
		{
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div class="deck-header svelte-1mi2bql"><h2 class="serif deck-title svelte-1mi2bql">Choose a Deck</h2> <p class="deck-sub svelte-1mi2bql">Spaced repetition for poker mastery</p></div> <div class="deck-list svelte-1mi2bql"><!--[-->`);
			const each_array_1 = ensure_array_like(deckStats());
			for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
				let { deck, stats } = each_array_1[$$index_1];
				const meta = DECK_META[deck.name] ?? {
					icon: "🃏",
					color: "var(--cream-dim)"
				};
				$$renderer.push(`<button type="button" class="deck-card svelte-1mi2bql"${attr("disabled", stats.total === 0, true)}><div class="deck-icon svelte-1mi2bql"${attr_style(`color: ${stringify(meta.color)};`)}>${escape_html(meta.icon)}</div> <div class="deck-info svelte-1mi2bql"><div class="deck-name svelte-1mi2bql">${escape_html(deck.name)}</div> <div class="deck-desc svelte-1mi2bql">${escape_html(deck.description)}</div> <div class="deck-stats-row svelte-1mi2bql"><span class="deck-stat svelte-1mi2bql"><span class="mono svelte-1mi2bql">${escape_html(stats.total)}</span> cards</span> <span class="deck-stat due svelte-1mi2bql"><span class="mono svelte-1mi2bql">${escape_html(stats.due)}</span> due</span> <span class="deck-stat new svelte-1mi2bql"><span class="mono svelte-1mi2bql">${escape_html(stats.newCards)}</span> new</span> <span class="deck-stat retention svelte-1mi2bql"><span class="mono svelte-1mi2bql">${escape_html(stats.avgRetention)}%</span> retention</span></div></div> <span class="deck-arrow svelte-1mi2bql">›</span></button>`);
			}
			$$renderer.push(`<!--]--></div>`);
		}
		$$renderer.push(`<!--]--></div></div>`);
	});
}
//#endregion
export { _page as default };
