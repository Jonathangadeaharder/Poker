import { a as ensure_array_like, c as stringify, i as derived, o as head, r as attr_style, z as escape_html } from "../../chunks/dev.js";
import { t as goto } from "../../chunks/client.js";
import "../../chunks/navigation.js";
import { t as page } from "../../chunks/state.js";
import { t as auth } from "../../chunks/auth.svelte.js";
//#region src/lib/components/BottomNav.svelte
function BottomNav($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { tabs = [
			{
				id: "today",
				label: "Today",
				icon: "📅"
			},
			{
				id: "practice",
				label: "Practice",
				icon: "🎯"
			},
			{
				id: "replay",
				label: "Replay",
				icon: "🔄"
			},
			{
				id: "you",
				label: "You",
				icon: "👤"
			}
		], active = "today", onNavigate } = $$props;
		$$renderer.push(`<nav style="position: fixed; bottom: 0; left: 0; right: 0; display: flex; align-items: center; justify-content: space-around; padding: 8px 0 calc(8px + env(safe-area-inset-bottom)); background: var(--ink); border-top: 1px solid var(--hairline); z-index: 20;"><!--[-->`);
		const each_array = ensure_array_like(tabs);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let tab = each_array[$$index];
			const isActive = tab.id === active;
			$$renderer.push(`<button type="button"${attr_style(`display: flex; flex-direction: column; align-items: center; gap: 2px; padding: 4px 16px; background: none; border: none; cursor: pointer; color: ${stringify(isActive ? "var(--coral)" : "var(--cream-dim)")}; font-family: var(--mono); font-size: 10px; letter-spacing: 0.06em; text-transform: uppercase;`)}><span style="font-size: 20px;">${escape_html(tab.icon)}</span> <span>${escape_html(tab.label)}</span></button>`);
		}
		$$renderer.push(`<!--]--></nav>`);
	});
}
//#endregion
//#region src/routes/+layout.svelte
function _layout($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { children } = $$props;
		const isAuthRoute = derived(() => page.url.pathname.startsWith("/login") || page.url.pathname.startsWith("/register") || page.url.pathname.startsWith("/onboarding"));
		const showBottomNav = derived(() => !isAuthRoute() && auth.isAuthenticated);
		const activeTab = derived(() => () => {
			const path = page.url.pathname;
			if (path.startsWith("/home") || path === "/") return "today";
			if (path.startsWith("/practice")) return "practice";
			if (path.startsWith("/replay")) return "replay";
			if (path.startsWith("/you") || path.startsWith("/profile")) return "you";
			return "today";
		});
		function handleNav(id) {
			goto({
				today: "/home",
				practice: "/practice",
				replay: "/replay",
				you: "/profile"
			}[id] ?? "/home");
		}
		head("12qhfyh", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Tilt — Poker Training</title>`);
			});
			$$renderer.push(`<meta name="description" content="Poker training app with GTO principles"/> <meta name="theme-color" content="#0e2a20"/> <link rel="manifest" href="/manifest.json"/>`);
		});
		if (auth.loading) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="loading-screen svelte-12qhfyh"><div class="spinner svelte-12qhfyh"></div></div>`);
		} else if (isAuthRoute() || auth.isAuthenticated) {
			$$renderer.push("<!--[1-->");
			children($$renderer);
			$$renderer.push(`<!----> `);
			if (showBottomNav()) {
				$$renderer.push("<!--[0-->");
				BottomNav($$renderer, {
					active: activeTab()(),
					onNavigate: handleNav
				});
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]-->`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
	});
}
//#endregion
export { _layout as default };
