import { execSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const ROOT = resolve(__dirname, "../..");
const BUILD_DIR = join(ROOT, "build");

const PLACEHOLDER_ENV = {
	PUBLIC_SUPABASE_URL: "https://placeholder.supabase.co",
	PUBLIC_SUPABASE_ANON_KEY:
		"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDYzNjEwMTMsImV4cCI6MTk2MTkzNzAxM30.placeholder",
	PUBLIC_POSTHOG_HOST: "https://eu.i.posthog.com",
	PUBLIC_POSTHOG_PROJECT_TOKEN: "phc_placeholder0000000000000000000000000000",
	NODE_ENV: "production",
};

function envPrefix(env: Record<string, string>): string {
	return Object.entries(env)
		.map(([k, v]) => `${k}=${v}`)
		.join(" ");
}

function collectSourceFiles(dir: string, exts: string[]): string[] {
	const results: string[] = [];
	if (!existsSync(dir)) return results;
	for (const entry of readdirSync(dir)) {
		const full = join(dir, entry);
		const stat = statSync(full);
		if (stat.isDirectory()) {
			results.push(...collectSourceFiles(full, exts));
		} else if (exts.some((ext) => entry.endsWith(ext))) {
			results.push(full);
		}
	}
	return results;
}

const EXTERNAL_IMPORT_RE =
	/import\s+.*?from\s+['"]([a-z@][a-z0-9_.\-@/]*?)(?:\/[^'"]*)?['"]/g;

const SVELTE_ALIAS_RE = /^\$/;
const BUILTIN_RE = /^node:/;
const VITE_PREFIX_RE = /^vite:/;

function extractExternalPackages(files: string[]): Set<string> {
	const packages = new Set<string>();
	for (const file of files) {
		const content = readFileSync(file, "utf-8");
		let match: RegExpExecArray | null;
		EXTERNAL_IMPORT_RE.lastIndex = 0;
		while ((match = EXTERNAL_IMPORT_RE.exec(content)) !== null) {
			const spec = match[1];
			if (SVELTE_ALIAS_RE.test(spec)) continue;
			if (BUILTIN_RE.test(spec)) continue;
			if (VITE_PREFIX_RE.test(spec)) continue;
			const pkg = spec.startsWith("@")
				? spec.split("/").slice(0, 2).join("/")
				: spec.split("/")[0];
			packages.add(pkg);
		}
	}
	return packages;
}

function getPackageJsonDeps(): {
	dependencies: Set<string>;
	devDependencies: Set<string>;
	all: Set<string>;
} {
	const pkg = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf-8"));
	const dependencies = new Set(Object.keys(pkg.dependencies ?? {}));
	const devDependencies = new Set(Object.keys(pkg.devDependencies ?? {}));
	return {
		dependencies,
		devDependencies,
		all: new Set([...dependencies, ...devDependencies]),
	};
}

const ENV_STATIC_PUBLIC_RE =
	/import\s+\{([^}]+)\}\s+from\s+['"]\$env\/static\/public['"]/g;

function extractEnvStaticPublicImports(files: string[]): Map<string, string[]> {
	const imports = new Map<string, string[]>();
	for (const file of files) {
		const content = readFileSync(file, "utf-8");
		let match: RegExpExecArray | null;
		ENV_STATIC_PUBLIC_RE.lastIndex = 0;
		while ((match = ENV_STATIC_PUBLIC_RE.exec(content)) !== null) {
			const vars = match[1].split(",").map((v) => v.trim());
			const relative = file.replace(ROOT + "/", "");
			imports.set(relative, vars);
		}
	}
	return imports;
}

describe("deploy smoke tests", () => {
	describe("pnpm build with placeholder envs", () => {
		it("succeeds with exit code 0", () => {
			const cmd = `${envPrefix(PLACEHOLDER_ENV)} pnpm build`;
			expect(() => execSync(cmd, { cwd: ROOT, stdio: "pipe" })).not.toThrow();
		});
	});

	describe("build output", () => {
		it("contains build/index.html", () => {
			expect(existsSync(join(BUILD_DIR, "index.html"))).toBe(true);
		});
	});

	describe("adapter-static compatibility", () => {
		it("has no hooks.server.ts", () => {
			const hooksPath = join(ROOT, "src/hooks.server.ts");
			expect(
				existsSync(hooksPath),
				`hooks.server.ts exists at ${hooksPath} — incompatible with adapter-static`,
			).toBe(false);
		});

		it("has no src/lib/server/ directory", () => {
			const serverDir = join(ROOT, "src/lib/server");
			expect(
				existsSync(serverDir),
				`src/lib/server/ exists — server-only code incompatible with adapter-static`,
			).toBe(false);
		});
	});

	describe("external imports match package.json deps", () => {
		const { all: allDeps } = getPackageJsonDeps();

		it("every external import has a matching package.json entry", () => {
			const srcFiles = collectSourceFiles(join(ROOT, "src"), [
				".ts",
				".svelte",
				".js",
			]);
			const externals = extractExternalPackages(srcFiles);

			const missing: string[] = [];
			for (const pkg of externals) {
				if (!allDeps.has(pkg)) {
					missing.push(pkg);
				}
			}

			expect(missing, `missing from package.json: ${missing.join(", ")}`).toEqual([]);
		});
	});

	describe("posthog packages declared in package.json", () => {
		it("posthog-js is in package.json dependencies", () => {
			const { all: allDeps } = getPackageJsonDeps();
			expect(allDeps.has("posthog-js")).toBe(true);
		});

		it("posthog-node is in package.json dependencies", () => {
			const { all: allDeps } = getPackageJsonDeps();
			expect(allDeps.has("posthog-node")).toBe(true);
		});
	});

	describe("$env/static/public imports have fallbacks", () => {
		it("every PUBLIC_ env var has a fallback in PLACEHOLDER_ENV", () => {
			const srcFiles = collectSourceFiles(join(ROOT, "src"), [
				".ts",
				".svelte",
				".js",
			]);
			const imports = extractEnvStaticPublicImports(srcFiles);

			const allVars = new Set<string>();
			for (const vars of imports.values()) {
				for (const v of vars) {
					allVars.add(v);
				}
			}

			const missing: string[] = [];
			for (const envVar of allVars) {
				if (!(envVar in PLACEHOLDER_ENV)) {
					missing.push(envVar);
				}
			}

			expect(
				missing,
				`env vars without fallbacks: ${missing.join(", ")}`,
			).toEqual([]);
		});
	});

	afterAll(() => {
		if (existsSync(BUILD_DIR)) {
			execSync(`rm -rf ${BUILD_DIR}`, { cwd: ROOT });
		}
	});
});
