import { V as escape_html, i as derived, l as stringify, n as attr_class, r as attr_style } from "./dev.js";
//#region src/lib/components/PlayingCard.svelte
function PlayingCard($$renderer, $$props) {
	let { rank, suit, faceDown = false, treatment = "classic", size = "md", delay = 0, class: className = "" } = $$props;
	const isRed = derived(() => suit === "♥" || suit === "♦");
	const sizes = {
		sm: {
			w: 44,
			h: 62,
			rank: 18,
			suit: 14
		},
		md: {
			w: 64,
			h: 90,
			rank: 26,
			suit: 22
		},
		lg: {
			w: 88,
			h: 124,
			rank: 36,
			suit: 30
		},
		xl: {
			w: 120,
			h: 168,
			rank: 52,
			suit: 42
		}
	};
	const s = derived(() => sizes[size] ?? sizes.md);
	if (faceDown) {
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<div${attr_class(`card face-down anim-deal ${stringify(className)}`)}${attr_style(`width: ${stringify(s().w)}px; height: ${stringify(s().h)}px; animation-delay: ${stringify(delay)}ms;`)}></div>`);
	} else if (treatment === "minimal") {
		$$renderer.push("<!--[1-->");
		$$renderer.push(`<div${attr_class(`card ${stringify(isRed() ? "red" : "")} anim-deal ${stringify(className)}`)}${attr_style(`width: ${stringify(s().w)}px; height: ${stringify(s().h)}px; animation-delay: ${stringify(delay)}ms; padding: 0; justify-content: center; align-items: center;`)}><div style="display: flex; align-items: baseline; gap: 2px;"><span${attr_style(`font-size: ${stringify(s().rank * 1.1)}px; font-weight: 800; letter-spacing: -0.06em;`)}>${escape_html(rank)}</span> <span${attr_style(`font-size: ${stringify(s().suit * .7)}px;`)}>${escape_html(suit)}</span></div></div>`);
	} else if (treatment === "luxury") {
		$$renderer.push("<!--[2-->");
		$$renderer.push(`<div${attr_class(`card ${stringify(isRed() ? "red" : "")} anim-deal ${stringify(className)}`)}${attr_style(`width: ${stringify(s().w)}px; height: ${stringify(s().h)}px; animation-delay: ${stringify(delay)}ms; background: linear-gradient(135deg, #f5e9d4, #ede0c7); box-shadow: inset 0 0 0 1px rgba(0,0,0,0.15), inset 0 0 24px rgba(180,140,80,0.15), 0 8px 16px -4px rgba(0,0,0,0.5);`)}><div style="display: flex; flex-direction: column; align-items: flex-start;"><span${attr_style(`font-size: ${stringify(s().rank)}px; font-weight: 700; letter-spacing: -0.04em;`)}>${escape_html(rank)}</span> <span${attr_style(`font-size: ${stringify(s().suit)}px;`)}>${escape_html(suit)}</span></div> <div${attr_style(`align-self: center; font-size: ${stringify(s().rank * 1.5)}px; opacity: 0.18;`)}>${escape_html(suit)}</div> <div style="display: flex; flex-direction: column; align-items: flex-end; transform: rotate(180deg);"><span${attr_style(`font-size: ${stringify(s().rank)}px; font-weight: 700; letter-spacing: -0.04em;`)}>${escape_html(rank)}</span> <span${attr_style(`font-size: ${stringify(s().suit)}px;`)}>${escape_html(suit)}</span></div></div>`);
	} else {
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<div${attr_class(`card ${stringify(isRed() ? "red" : "")} anim-deal ${stringify(className)}`)}${attr_style(`width: ${stringify(s().w)}px; height: ${stringify(s().h)}px; animation-delay: ${stringify(delay)}ms;`)}><div style="display: flex; flex-direction: column; align-items: flex-start; line-height: 1;"><span class="rank"${attr_style(`font-size: ${stringify(s().rank)}px;`)}>${escape_html(rank)}</span> <span class="suit"${attr_style(`font-size: ${stringify(s().suit)}px; margin-top: 2px;`)}>${escape_html(suit)}</span></div> <div style="display: flex; flex-direction: column; align-items: flex-end; transform: rotate(180deg); line-height: 1;"><span class="rank"${attr_style(`font-size: ${stringify(s().rank)}px;`)}>${escape_html(rank)}</span> <span class="suit"${attr_style(`font-size: ${stringify(s().suit)}px; margin-top: 2px;`)}>${escape_html(suit)}</span></div></div>`);
	}
	$$renderer.push(`<!--]-->`);
}
//#endregion
export { PlayingCard as t };
