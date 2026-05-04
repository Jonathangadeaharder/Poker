import { R as attr, a as ensure_array_like, c as stringify, i as derived, n as attr_class, r as attr_style, z as escape_html } from "../../../../chunks/dev.js";
import { t as goto } from "../../../../chunks/client.js";
import "../../../../chunks/navigation.js";
import { t as TopBar } from "../../../../chunks/TopBar.js";
import { r as COMMON_LEAKS } from "../../../../chunks/exploitativeStrategies.js";
import { n as PUSH_FOLD_CHARTS } from "../../../../chunks/pushFoldCharts.js";
import { n as RFI_RANGES } from "../../../../chunks/pokerRanges.js";
import { t as Confetti } from "../../../../chunks/Confetti.js";
import "../../../../chunks/soundManager.js";
//#region src/lib/data/miniGames.ts
/**
* Mini-Games for interactive poker training
* Inspired by Duolingo's bite-sized lessons
*
* Types:
* 1. Range Quiz (Multiple Choice)
* 2. Speed Drills (fast yes/no decisions)
* 3. Push/Fold Trainer (Interactive scenarios)
* 4. Hand Evaluation (Evaluate hands)
*/
function generateRangeQuiz(position, difficulty = "easy") {
	const range = RFI_RANGES[position];
	const allPositions = Object.keys(RFI_RANGES);
	const questionTypes = [{
		question: `Which RFI range is correct for ${range.position}?`,
		correct: range.percentage,
		wrong: [
			RFI_RANGES[allPositions[Math.floor(Math.random() * allPositions.length)]].percentage,
			RFI_RANGES[allPositions[Math.floor(Math.random() * allPositions.length)]].percentage,
			`${Math.floor(Math.random() * 30 + 10)}%`
		]
	}, {
		question: `Should KQo be played as RFI from ${position}?`,
		correct: range.hands.includes("KQo") ? "Yes" : "No",
		wrong: range.hands.includes("KQo") ? [
			"No",
			"Sometimes",
			"Only suited"
		] : [
			"Yes",
			"Always",
			"Mostly"
		]
	}];
	const selectedType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
	const uniqueWrong = [...new Set(selectedType.wrong)].filter((a) => a !== selectedType.correct);
	while (uniqueWrong.length < 3) {
		const candidate = `${Math.floor(Math.random() * 30 + 10)}%`;
		if (candidate !== selectedType.correct && !uniqueWrong.includes(candidate)) uniqueWrong.push(candidate);
	}
	const allAnswers = [selectedType.correct, ...uniqueWrong.slice(0, 3)].sort(() => Math.random() - .5);
	return {
		id: `range_${position}_${Math.random().toString(36).slice(2, 9)}`,
		category: "ranges",
		difficulty,
		question: selectedType.question,
		answers: allAnswers,
		correctAnswer: selectedType.correct,
		explanation: range.description,
		points: difficulty === "easy" ? 10 : difficulty === "medium" ? 15 : 20
	};
}
function generatePushFoldQuiz(stackSize, difficulty = "medium") {
	const chart = PUSH_FOLD_CHARTS[stackSize];
	const positions = Object.keys(chart.openShove);
	const selectedPos = positions[Math.floor(Math.random() * positions.length)];
	const posData = chart.openShove[selectedPos];
	const testHands = [
		"AA",
		"22",
		"AKo",
		"A2s",
		"KQo",
		"76s",
		"J9o",
		"T8s"
	];
	const selectedHand = testHands[Math.floor(Math.random() * testHands.length)];
	const isInRange = Array.isArray(posData.hands) ? posData.hands.includes(selectedHand) : Math.random() > .5;
	return {
		id: `pushfold_${stackSize}_${selectedPos}_${Math.random().toString(36).slice(2, 9)}`,
		category: "push_fold",
		difficulty,
		question: `${selectedHand} from ${selectedPos} with ${chart.stackSize}?\nOpen-shove or fold?`,
		answers: [
			"Shove",
			"Fold",
			"Min-Raise",
			"Limp"
		].sort(() => Math.random() - .5),
		correctAnswer: isInRange ? "Shove" : "Fold",
		explanation: `${posData.position}: ${posData.range} range\n${posData.description}`,
		points: 15,
		context: {
			stackSize: chart.stackSize,
			position: selectedPos,
			hand: selectedHand
		}
	};
}
function generateExploitQuiz(difficulty = "hard") {
	const leakKeys = Object.keys(COMMON_LEAKS);
	const selectedKey = leakKeys[Math.floor(Math.random() * leakKeys.length)];
	const leak = COMMON_LEAKS[selectedKey];
	return {
		id: `exploit_${selectedKey}_${Math.random().toString(36).slice(2, 9)}`,
		category: "exploits",
		difficulty,
		question: `Opponent shows this leak:\n"${leak.leak}"\n\nWhich adjustment is optimal?`,
		answers: [...new Set([
			leak.exploit.action,
			"Play GTO",
			"Bluff more",
			"Fold more"
		])].sort(() => Math.random() - .5),
		correctAnswer: leak.exploit.action,
		explanation: `${leak.exploit.action}\n\n${leak.exploit.postflop || leak.exploit.range || ""}\n\nExpected: ${leak.exploit.expectedWinRate}`,
		points: 20,
		context: {
			leak: selectedKey,
			severity: leak.severity
		}
	};
}
function generateMixedQuiz(count = 10, difficulty = "mixed") {
	const quiz = [];
	const types = [
		"range",
		"pushfold",
		"exploit"
	];
	for (let i = 0; i < count; i++) {
		const type = types[Math.floor(Math.random() * types.length)];
		const diff = difficulty === "mixed" ? [
			"easy",
			"medium",
			"hard"
		][Math.floor(Math.random() * 3)] : difficulty;
		let question;
		switch (type) {
			case "range": {
				const positions = Object.keys(RFI_RANGES);
				const pos = positions[Math.floor(Math.random() * positions.length)];
				question = generateRangeQuiz(pos, diff);
				break;
			}
			case "pushfold": {
				const stacks = Object.keys(PUSH_FOLD_CHARTS);
				const stack = stacks[Math.floor(Math.random() * stacks.length)];
				question = generatePushFoldQuiz(stack, diff);
				break;
			}
			default:
				question = generateExploitQuiz(diff);
				break;
		}
		quiz.push(question);
	}
	return quiz;
}
//#endregion
//#region src/routes/practice/quiz/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let quiz = generateMixedQuiz(10, "mixed");
		let currentIndex = 0;
		let showFeedback = false;
		let score = 0;
		let totalXP = 0;
		let showConfetti = false;
		let answerRevealed = false;
		const currentQuestion = derived(() => quiz[currentIndex] ?? null);
		const progress = derived(() => quiz.length > 0 ? (currentIndex + 1) / quiz.length : 0);
		const accuracy = derived(() => quiz.length > 0 ? Math.round(score / quiz.length * 100) : 0);
		const isPerfect = derived(() => score === quiz.length && quiz.length > 0);
		$$renderer.push(`<div class="screen felt-bg">`);
		Confetti($$renderer, { active: showConfetti });
		$$renderer.push(`<!----> `);
		{
			function center($$renderer) {
				$$renderer.push(`<!---->Quiz`);
			}
			TopBar($$renderer, {
				onBack: () => goto("/practice"),
				center,
				$$slots: { center: true }
			});
		}
		$$renderer.push(`<!----> <div class="scroll-content svelte-6gkzig">`);
		if (currentQuestion()) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="progress-wrap svelte-6gkzig"><div class="progress-bar svelte-6gkzig"${attr_style(`width: ${stringify(progress() * 100)}%`)}></div></div> <div class="progress-label svelte-6gkzig"><span class="eyebrow">${escape_html(currentIndex + 1)} / ${escape_html(quiz.length)}</span> <span class="eyebrow">${escape_html(score)} correct</span></div> <div class="question-card anim-float svelte-6gkzig"><div class="question-meta svelte-6gkzig"><span class="category-chip svelte-6gkzig">${escape_html(currentQuestion().category)}</span> <span${attr_class("difficulty-chip svelte-6gkzig", void 0, {
				"easy": currentQuestion().difficulty === "easy",
				"medium": currentQuestion().difficulty === "medium",
				"hard": currentQuestion().difficulty === "hard"
			})}>${escape_html(currentQuestion().difficulty)}</span></div> <p class="question-text svelte-6gkzig">${escape_html(currentQuestion().question)}</p> <span class="points-label svelte-6gkzig">+${escape_html(currentQuestion().points)} XP</span></div> <div class="answers svelte-6gkzig"><!--[-->`);
			const each_array = ensure_array_like(currentQuestion().answers);
			for (let i = 0, $$length = each_array.length; i < $$length; i++) {
				let answer = each_array[i];
				currentQuestion().correctAnswer;
				$$renderer.push(`<button${attr_class("answer-btn svelte-6gkzig", void 0, {
					"correct": answerRevealed,
					"wrong": answerRevealed,
					"dimmed": answerRevealed,
					"anim-shake": answerRevealed
				})}${attr("disabled", showFeedback, true)}><span class="answer-letter svelte-6gkzig">${escape_html(String.fromCharCode(65 + i))}</span> <span class="answer-text svelte-6gkzig">${escape_html(answer)}</span></button>`);
			}
			$$renderer.push(`<!--]--></div> `);
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]-->`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div class="results-wrap anim-float svelte-6gkzig"><div class="results-emoji svelte-6gkzig">`);
			if (isPerfect()) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`🏆`);
			} else if (accuracy() >= 70) {
				$$renderer.push("<!--[1-->");
				$$renderer.push(`🎉`);
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`🎯`);
			}
			$$renderer.push(`<!--]--></div> <h2 class="results-title serif svelte-6gkzig">`);
			if (isPerfect()) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`Perfect Score!`);
			} else if (accuracy() >= 70) {
				$$renderer.push("<!--[1-->");
				$$renderer.push(`Great Job!`);
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`Quiz Complete`);
			}
			$$renderer.push(`<!--]--></h2> <p class="results-sub svelte-6gkzig">`);
			if (isPerfect()) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`You answered every question correctly!`);
			} else if (accuracy() >= 70) {
				$$renderer.push("<!--[1-->");
				$$renderer.push(`Strong performance. Keep studying!`);
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`Practice makes perfect. Try again!`);
			}
			$$renderer.push(`<!--]--></p> <div class="stats-grid svelte-6gkzig"><div class="stat-card svelte-6gkzig"><span class="stat-value mono svelte-6gkzig">${escape_html(score)}/${escape_html(quiz.length)}</span> <span class="stat-label eyebrow svelte-6gkzig">Score</span></div> <div class="stat-card svelte-6gkzig"><span class="stat-value mono svelte-6gkzig">${escape_html(accuracy())}%</span> <span class="stat-label eyebrow svelte-6gkzig">Accuracy</span></div> <div class="stat-card svelte-6gkzig"><span class="stat-value mono svelte-6gkzig">+${escape_html(totalXP)}</span> <span class="stat-label eyebrow svelte-6gkzig">XP Earned</span></div></div> <div class="results-actions svelte-6gkzig"><button class="btn btn-primary">Play Again</button> <button class="btn btn-ghost">Done</button></div></div>`);
		}
		$$renderer.push(`<!--]--></div></div>`);
	});
}
//#endregion
export { _page as default };
