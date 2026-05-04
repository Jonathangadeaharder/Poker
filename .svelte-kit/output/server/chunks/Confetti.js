import { a as ensure_array_like, c as stringify, r as attr_style } from "./dev.js";
//#region src/lib/components/Confetti.svelte
function Confetti($$renderer, $$props) {
	let { active } = $$props;
	const colors = [
		"#ff5b48",
		"#e9b949",
		"#f5e9d4",
		"#ff8674"
	];
	if (active) {
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<div style="position: absolute; inset: 0; pointer-events: none; overflow: hidden; z-index: 30;"><!--[-->`);
		const each_array = ensure_array_like({ length: 28 });
		for (let i = 0, $$length = each_array.length; i < $$length; i++) {
			each_array[i];
			const left = Math.random() * 100;
			const delay = Math.random() * 200;
			const dur = 1200 + Math.random() * 800;
			const rot = Math.random() * 720;
			const color = colors[i % colors.length];
			$$renderer.push(`<div class="confetti-piece"${attr_style(`left: ${stringify(left)}%; top: -20px; background: ${stringify(color)}; animation: confetti-fall ${stringify(dur)}ms ease-out ${stringify(delay)}ms forwards; transform: rotate(${stringify(rot)}deg); border-radius: ${stringify(i % 3 === 0 ? "50%" : "2px")};`)}></div>`);
		}
		$$renderer.push(`<!--]--></div>`);
	} else $$renderer.push("<!--[-1-->");
	$$renderer.push(`<!--]-->`);
}
//#endregion
export { Confetti as t };
