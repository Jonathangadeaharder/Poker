
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	type MatcherParam<M> = M extends (param : string) => param is (infer U extends string) ? U : string;

	export interface AppTypes {
		RouteId(): "/(auth)" | "/" | "/home" | "/learn" | "/learn/exploits" | "/learn/plan" | "/learn/pushfold" | "/learn/ranges" | "/lesson" | "/(auth)/login" | "/onboarding" | "/practice" | "/practice/quiz" | "/practice/srs" | "/profile" | "/(auth)/register" | "/results" | "/results/[sessionId]" | "/you";
		RouteParams(): {
			"/results/[sessionId]": { sessionId: string }
		};
		LayoutParams(): {
			"/(auth)": Record<string, never>;
			"/": { sessionId?: string };
			"/home": Record<string, never>;
			"/learn": Record<string, never>;
			"/learn/exploits": Record<string, never>;
			"/learn/plan": Record<string, never>;
			"/learn/pushfold": Record<string, never>;
			"/learn/ranges": Record<string, never>;
			"/lesson": Record<string, never>;
			"/(auth)/login": Record<string, never>;
			"/onboarding": Record<string, never>;
			"/practice": Record<string, never>;
			"/practice/quiz": Record<string, never>;
			"/practice/srs": Record<string, never>;
			"/profile": Record<string, never>;
			"/(auth)/register": Record<string, never>;
			"/results": { sessionId?: string };
			"/results/[sessionId]": { sessionId: string };
			"/you": Record<string, never>
		};
		Pathname(): "/" | "/home" | "/learn/exploits" | "/learn/plan" | "/learn/pushfold" | "/learn/ranges" | "/lesson" | "/login" | "/onboarding" | "/practice/quiz" | "/practice/srs" | "/profile" | "/register" | `/results/${string}` & {} | "/you";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/icon-192.svg" | "/icon-512.svg" | "/manifest.json" | "/robots.txt" | string & {};
	}
}