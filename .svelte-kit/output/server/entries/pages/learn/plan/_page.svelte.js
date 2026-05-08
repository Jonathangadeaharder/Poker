import { a as ensure_array_like, c as stringify, i as derived, n as attr_class, r as attr_style, z as escape_html } from "../../../../chunks/dev.js";
import { t as goto } from "../../../../chunks/client.js";
import "../../../../chunks/navigation.js";
import { t as TopBar } from "../../../../chunks/TopBar.js";
//#region src/lib/data/trainingPlan.ts
var TRAINING_PATHS = {
	CASH_GAME: {
		id: "cash",
		name: "Path A: 6-Max Cash Game Specialist",
		subtitle: "100bb Deep Stack",
		difficulty: "Harder, broader skill set",
		target: "2-5bb/100 win rate at NL5/NL10",
		description: "Most complex form of NLHE. Most robust foundation for future learning.",
		color: "#2d5f3f"
	},
	MTT: {
		id: "mtt",
		name: "Path B: MTT Specialist",
		subtitle: "Variable stack depths",
		difficulty: "Easier, faster learning curve",
		target: "Profitable in $1-$5 tournaments",
		description: "Focus on stack depth strategy and push/fold mastery.",
		color: "#c41e3a"
	}
};
var TRAINING_SCHEDULE = {
	CASH_GAME: [
		{
			day: 1,
			title: "Day 1-2: Fundamentals",
			totalHours: 13,
			modules: [
				{
					hours: 2,
					type: "drill",
					title: "GTO Trainer: RFI Ranges",
					description: "Open-raising ranges from all 6 positions (UTG to BB)",
					objectives: [
						"UTG (15%) memorize",
						"MP (18%) memorize",
						"CO (25%) memorize",
						"BTN (45%) memorize",
						"SB/BB ranges understand"
					],
					tools: "GTO Wizard / DTO Poker",
					completed: false
				},
				{
					hours: 1,
					type: "video",
					title: "Video: Postflop Fundamentals",
					description: "Range advantage & C-betting (HU vs MW)",
					objectives: [
						"What is range advantage?",
						"When does PFR have range advantage?",
						"HU C-Bet: 80% @ 33% pot",
						"MW C-Bet: 40% @ 50% pot"
					],
					resources: [
						"Run It Once (Free)",
						"PokerCoaching.com",
						"YouTube: Poker Strategy Channels"
					],
					completed: false
				},
				{
					hours: 2,
					type: "play",
					title: "Live Play: NL5 6-Max",
					description: "2 tables, 200-300 hands",
					objectives: [
						"Apply RFI ranges consistently",
						"Mark difficult spots",
						"Note all limper spots"
					],
					stakes: "NL5 (2c/5c)",
					tables: 2,
					completed: false
				},
				{
					hours: 1.5,
					type: "review",
					title: "Hand Review",
					description: "Analyze all hands in GTO tool",
					objectives: [
						"Upload hands to GTO Wizard",
						"Identify all RFI errors",
						"Note EV losses",
						"Create learning cards for errors"
					],
					completed: false
				}
			]
		},
		{
			day: 2,
			title: "Day 1-2: Fundamentals (Continued)",
			totalHours: 6.5,
			modules: [
				{
					hours: 2,
					type: "drill",
					title: "GTO Trainer: RFI Ranges (Repeat)",
					description: "Deepening and speed training",
					completed: false
				},
				{
					hours: 1,
					type: "video",
					title: "Video: Board Textures",
					description: "Dry vs wet boards, equity distribution",
					completed: false
				},
				{
					hours: 2,
					type: "play",
					title: "Live Play: NL5 6-Max",
					description: "2 tables, focus on C-Bet decisions",
					completed: false
				},
				{
					hours: 1.5,
					type: "review",
					title: "Hand Review",
					description: "Focus: C-Bet spots (HU vs MW)",
					completed: false
				}
			]
		},
		{
			day: 3,
			title: "Day 3-4: Core Strategy - Exploits",
			totalHours: 13,
			modules: [
				{
					hours: 2,
					type: "drill",
					title: "GTO Trainer: 3-Bet Defense",
					description: "When to call/fold vs 3-Bet",
					objectives: [
						"Calling range vs 3-Bet",
						"4-Bet range (value)",
						"Fold range",
						"Position adjustments"
					],
					completed: false
				},
				{
					hours: 1,
					type: "video",
					title: "Exploitative Module 1: Limper Destruction",
					description: "The #1 micro-stakes leak",
					objectives: [
						"Isolation raise sizing (4x-7x)",
						"Linear range construction",
						"Postflop ABC vs limper",
						"Expected win rate: +15-25bb/100"
					],
					completed: false
				},
				{
					hours: 2,
					type: "play",
					title: "Live Play: NL5 6-Max",
					description: "HUNTING for limper spots",
					completed: false
				},
				{
					hours: 1.5,
					type: "review",
					title: "Hand Review",
					description: "Focus: 3-Bet defense & limper exploits",
					objectives: [
						"Were all limpers isolated?",
						"Was sizing correct? (4x-7x)",
						"Postflop bluff frequency vs limper?",
						"Were calling stations identified?"
					],
					completed: false
				}
			]
		},
		{
			day: 4,
			title: "Day 3-4: Core Strategy (Continued)",
			totalHours: 6.5,
			modules: [
				{
					hours: 2,
					type: "drill",
					title: "Review: 3-Bet Defense + RFI",
					completed: false
				},
				{
					hours: 1,
					type: "video",
					title: "Exploitative Module 2: Calling Stations & Fit-or-Fold",
					completed: false
				},
				{
					hours: 2.5,
					type: "play",
					title: "Live play with active exploit tracking",
					completed: false
				},
				{
					hours: 1,
					type: "review",
					title: "Hand Review: Exploit application",
					completed: false
				}
			]
		},
		{
			day: 5,
			title: "Day 5-6: Advanced",
			totalHours: 13,
			modules: [
				{
					hours: 2,
					type: "drill",
					title: "3-Bet Ranges (Linear vs Polar)",
					description: "When to merged 3-bet, when polarized",
					objectives: [
						"Linear range: vs passive (no 4-bet)",
						"Polar range: vs aggressive (4-bet frequent)",
						"Blocker concept: A5s, K5s"
					],
					completed: false
				},
				{
					hours: 1,
					type: "theory",
					title: "Theory: Blockers & Implied Odds",
					description: "The \"why\" behind advanced concepts",
					objectives: [
						"Blocker math (A5s blocks AA/AK)",
						"10x Rule for set mining",
						"Range morphology understanding"
					],
					completed: false
				},
				{
					hours: 2,
					type: "play",
					title: "Live Play: NL5 6-Max",
					description: "Integration of all concepts",
					completed: false
				},
				{
					hours: 1.5,
					type: "review",
					title: "Deep Review",
					description: "Were exploits correctly applied?",
					objectives: [
						"Exploit Matrix check (all 5 leaks)",
						"Set mining: 10x Rule followed?",
						"Linear vs polar 3-bet correct?"
					],
					completed: false
				}
			]
		},
		{
			day: 6,
			title: "Day 5-6: Advanced (Continued)",
			totalHours: 6.5,
			modules: [
				{
					hours: 2,
					type: "drill",
					title: "Weakness training",
					description: "Focus on weakest areas of the week",
					completed: false
				},
				{
					hours: 1,
					type: "theory",
					title: "Range vs Range Analysis",
					completed: false
				},
				{
					hours: 2.5,
					type: "play",
					title: "Live play with meta-awareness",
					completed: false
				},
				{
					hours: 1,
					type: "review",
					title: "Weekly statistics analysis",
					completed: false
				}
			]
		},
		{
			day: 7,
			title: "Day 7: Integration & Assessment",
			totalHours: 7.5,
			modules: [
				{
					hours: 2,
					type: "drill",
					title: "Final Drill: Weakest spots",
					description: "Identify and train top 3 leaks",
					completed: false
				},
				{
					hours: 4,
					type: "play",
					title: "Long live session",
					description: "4 tables NL5, 600+ hands",
					objectives: [
						"Consistent RFI application",
						"All exploits actively used",
						"Mental game stay focused",
						"Track win rate live"
					],
					completed: false
				},
				{
					hours: 1.5,
					type: "assessment",
					title: "Weekly analysis & week 2 plan",
					description: "Identify 5 most expensive errors",
					objectives: [
						"Review: Total win rate",
						"EV loss per category",
						"Top 5 leaks for week 2",
						"Create focused learning plan"
					],
					completed: false
				}
			]
		}
	],
	MTT: [
		{
			day: 1,
			title: "Day 1-2: Fundamentals - Deep Stack",
			totalHours: 13,
			modules: [
				{
					hours: 2,
					type: "drill",
					title: "RFI Ranges (100bb, 60bb, 40bb)",
					description: "Multi-stack RFI training",
					objectives: [
						"100bb: Same as cash game",
						"60bb: Slightly tighter",
						"40bb: Significantly tighter"
					],
					completed: false
				},
				{
					hours: 1,
					type: "video",
					title: "The Stack Depth Triumvirate",
					description: "Deep (75bb+) / Medium (30-60bb) / Short (<25bb)",
					objectives: [
						"75bb+: Cash-game-style",
						"30-60bb: Re-steal & 3-bet shove phase",
						"<25bb: Pure push/fold"
					],
					completed: false
				},
				{
					hours: 2,
					type: "play",
					title: "Live Play: $1-$3 MTTs",
					description: "4 tables, focus on early stages",
					completed: false
				},
				{
					hours: 1.5,
					type: "review",
					title: "Hand Review",
					description: "RFI errors at various stacks",
					completed: false
				}
			]
		},
		{
			day: 2,
			title: "Day 1-2: Fundamentals (Continued)",
			totalHours: 6.5,
			modules: [
				{
					hours: 2,
					type: "drill",
					title: "RFI Deep Dive + Ante adjustments",
					completed: false
				},
				{
					hours: 1,
					type: "video",
					title: "MTT-specific concepts",
					description: "Antes, bubble, pay jumps",
					completed: false
				},
				{
					hours: 2.5,
					type: "play",
					title: "Live MTT Play",
					completed: false
				},
				{
					hours: 1,
					type: "review",
					title: "Review with stack focus",
					completed: false
				}
			]
		},
		{
			day: 3,
			title: "Day 3-4: Push/Fold Mastery (20bb)",
			totalHours: 13,
			modules: [
				{
					hours: 2,
					type: "drill",
					title: "Push/Fold Charts (20bb)",
					description: "Open-shove & re-shove ranges",
					objectives: [
						"BTN 20bb open-shove: 52%",
						"CO 20bb open-shove: 38%",
						"MP 20bb open-shove: 22%",
						"UTG 20bb open-shove: 15%",
						"Re-shove vs BTN: 28%",
						"Re-shove vs CO: 20%"
					],
					tools: "DTO Poker / ICMizer",
					completed: false
				},
				{
					hours: 1,
					type: "video",
					title: "Medium Stack Strategy (30-60bb)",
					description: "Re-steal & 3-bet shoving",
					objectives: [
						"When to 3-bet shove instead of call?",
						"Re-steal vs late position opens",
						"Stack-preservation vs aggression"
					],
					completed: false
				},
				{
					hours: 2.5,
					type: "play",
					title: "MTT Play - Short Stack Focus",
					description: "Play until <25bb, then late-reg new tournaments",
					completed: false
				},
				{
					hours: 1,
					type: "review",
					title: "Push/Fold error analysis",
					description: "Every <25bb error is critical",
					completed: false
				}
			]
		},
		{
			day: 4,
			title: "Day 3-4: Push/Fold (Continued)",
			totalHours: 6.5,
			modules: [
				{
					hours: 2,
					type: "drill",
					title: "Push/Fold speed training",
					description: "Fast decision making",
					completed: false
				},
				{
					hours: 1,
					type: "video",
					title: "Common short-stack mistakes",
					completed: false
				},
				{
					hours: 2.5,
					type: "play",
					title: "MTT Grind",
					completed: false
				},
				{
					hours: 1,
					type: "review",
					title: "Deep review of all <30bb spots",
					completed: false
				}
			]
		},
		{
			day: 5,
			title: "Day 5-6: Ultra-Short Stacks + ICM",
			totalHours: 13,
			modules: [
				{
					hours: 2,
					type: "drill",
					title: "Push/Fold (15bb & 10bb)",
					description: "Extreme short-stack situations",
					objectives: [
						"BTN 15bb: 58%",
						"BTN 10bb: 68%",
						"Defense ranges extremely wide"
					],
					completed: false
				},
				{
					hours: 1,
					type: "theory",
					title: "ICM Fundamentals",
					description: "Why folding can be +EV",
					objectives: [
						"ICM basics: Non-linear chip value",
						"Bubble play: Maximize fold equity",
						"Final table ICM",
						"When to return to chip-EV?"
					],
					completed: false
				},
				{
					hours: 2.5,
					type: "play",
					title: "MTT Play - ICM awareness",
					description: "Identify bubble & final table spots",
					completed: false
				},
				{
					hours: 1,
					type: "review",
					title: "ICM spot identification",
					completed: false
				}
			]
		},
		{
			day: 6,
			title: "Day 5-6: Advanced (Continued)",
			totalHours: 6.5,
			modules: [
				{
					hours: 2,
					type: "drill",
					title: "Weakest push/fold spots",
					completed: false
				},
				{
					hours: 1,
					type: "theory",
					title: "Advanced ICM situations",
					completed: false
				},
				{
					hours: 2.5,
					type: "play",
					title: "MTT Grind",
					completed: false
				},
				{
					hours: 1,
					type: "review",
					title: "Weekly ROI analysis",
					completed: false
				}
			]
		},
		{
			day: 7,
			title: "Day 7: Integration & Tournament Play",
			totalHours: 7.5,
			modules: [
				{
					hours: 2,
					type: "drill",
					title: "Final push/fold drilling",
					description: "Random stack sizes (8-25bb)",
					completed: false
				},
				{
					hours: 4,
					type: "play",
					title: "Tournament marathon",
					description: "4-6 tournaments simultaneously",
					objectives: [
						"Consistent stack strategy",
						"ICM awareness at bubble",
						"Push/fold perfectly executed",
						"Aim for deep run"
					],
					completed: false
				},
				{
					hours: 1.5,
					type: "assessment",
					title: "Weekly analysis",
					description: "ROI, ITM%, Average finish",
					objectives: [
						"Calculate total ROI",
						"ITM% (target: >15%)",
						"Bubble performance",
						"Top 5 errors for week 2"
					],
					completed: false
				}
			]
		}
	]
};
//#endregion
//#region src/routes/learn/plan/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let selectedPath = "CASH_GAME";
		let expandedDay = null;
		let completedModules = {};
		const schedule = derived(() => TRAINING_SCHEDULE[selectedPath]);
		const currentPath = derived(() => TRAINING_PATHS[selectedPath]);
		const totalModules = derived(() => schedule().reduce((sum, day) => sum + day.modules.length, 0));
		const completedCount = derived(() => Object.values(completedModules).filter(Boolean).length);
		const progress = derived(() => totalModules() > 0 ? completedCount() / totalModules() : 0);
		const totalHours = derived(() => schedule().reduce((sum, day) => sum + day.totalHours, 0));
		const completedHours = derived(() => schedule().reduce((sum, day, di) => sum + day.modules.reduce((dSum, _, mi) => dSum + (completedModules[`${di}-${mi}`] ? day.totalHours / day.modules.length : 0), 0), 0));
		function dayCompleted(dayIndex, day) {
			return day.modules.filter((_, mi) => completedModules[`${dayIndex}-${mi}`]).length;
		}
		const moduleIcons = {
			drill: "🎯",
			video: "▶️",
			play: "🃏",
			review: "📊",
			theory: "📖",
			assessment: "📋"
		};
		const moduleColors = {
			drill: "var(--coral)",
			video: "#4a9eff",
			play: "var(--gold)",
			review: "#ff9f43",
			theory: "#a855f7",
			assessment: "#22c55e"
		};
		$$renderer.push(`<div class="screen felt-bg svelte-m3sfm5">`);
		{
			function center($$renderer) {
				$$renderer.push(`<!---->Training Plan`);
			}
			TopBar($$renderer, {
				onBack: () => goto("/home"),
				center,
				$$slots: { center: true }
			});
		}
		$$renderer.push(`<!----> <div class="scroll-content svelte-m3sfm5"><div class="path-selector svelte-m3sfm5"><!--[-->`);
		const each_array = ensure_array_like(Object.entries(TRAINING_PATHS));
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let [key, path] = each_array[$$index];
			$$renderer.push(`<button${attr_class("path-btn svelte-m3sfm5", void 0, { "active": selectedPath === key })}${attr_style(selectedPath === key ? `background: ${path.color}; border-color: ${path.color};` : "")}><div class="path-btn-title svelte-m3sfm5">${escape_html(key === "CASH_GAME" ? "Cash Game" : "MTT")}</div> <div class="path-btn-sub svelte-m3sfm5">${escape_html(path.subtitle)}</div></button>`);
		}
		$$renderer.push(`<!--]--></div> <p class="path-desc svelte-m3sfm5">${escape_html(currentPath().description)}</p> <div class="progress-card svelte-m3sfm5"><div class="progress-header svelte-m3sfm5"><span class="eyebrow">Progress</span> <span class="mono progress-pct svelte-m3sfm5">${escape_html(Math.round(progress() * 100))}%</span></div> <div class="progress-track svelte-m3sfm5"><div class="progress-fill svelte-m3sfm5"${attr_style(`width: ${stringify(progress() * 100)}%; background: ${stringify(currentPath().color)};`)}></div></div> <div class="stats-row svelte-m3sfm5"><div class="stat svelte-m3sfm5"><div class="stat-value svelte-m3sfm5">${escape_html(Math.round(totalHours()))}h</div> <div class="stat-label svelte-m3sfm5">Total</div></div> <div class="stat svelte-m3sfm5"><div class="stat-value svelte-m3sfm5">${escape_html(Math.round(completedHours()))}h</div> <div class="stat-label svelte-m3sfm5">Done</div></div> <div class="stat svelte-m3sfm5"><div class="stat-value svelte-m3sfm5">${escape_html(Math.max(0, Math.round(totalHours() - completedHours())))}h</div> <div class="stat-label svelte-m3sfm5">Left</div></div></div> <button class="btn btn-ghost reset-btn svelte-m3sfm5">Reset progress</button></div> <div class="section-title svelte-m3sfm5">7-Day Plan</div> <!--[-->`);
		const each_array_1 = ensure_array_like(schedule());
		for (let di = 0, $$length = each_array_1.length; di < $$length; di++) {
			let day = each_array_1[di];
			const isOpen = expandedDay === di;
			const done = dayCompleted(di, day);
			$$renderer.push(`<button type="button" class="day-card svelte-m3sfm5"><div class="day-header svelte-m3sfm5"><div class="day-info"><div class="day-title svelte-m3sfm5">${escape_html(day.title)}</div> <div class="day-hours mono svelte-m3sfm5">${escape_html(day.totalHours)}h</div></div> <div class="day-right svelte-m3sfm5"><span class="mono day-count svelte-m3sfm5">${escape_html(done)}/${escape_html(day.modules.length)}</span> <span class="day-chevron svelte-m3sfm5">${escape_html(isOpen ? "▲" : "▼")}</span></div></div></button> `);
			if (isOpen) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="day-modules svelte-m3sfm5"><!--[-->`);
				const each_array_2 = ensure_array_like(day.modules);
				for (let mi = 0, $$length = each_array_2.length; mi < $$length; mi++) {
					let mod = each_array_2[mi];
					const isDone = completedModules[`${di}-${mi}`];
					$$renderer.push(`<div${attr_class("module-row svelte-m3sfm5", void 0, { "module-done": isDone })}><button type="button" class="module-check svelte-m3sfm5">${escape_html(isDone ? "✅" : "⬜")}</button> <div class="module-info svelte-m3sfm5"><div class="module-title svelte-m3sfm5"><span class="module-icon svelte-m3sfm5"${attr_style(`color: ${stringify(moduleColors[mod.type] || "#666")}`)}>${escape_html(moduleIcons[mod.type] || "●")}</span> ${escape_html(mod.title)}</div> <div class="module-meta mono svelte-m3sfm5">${escape_html(mod.hours)}h${escape_html(mod.description ? ` · ${mod.description}` : "")}</div></div></div>`);
				}
				$$renderer.push(`<!--]--></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]-->`);
		}
		$$renderer.push(`<!--]--></div></div>`);
	});
}
//#endregion
export { _page as default };
