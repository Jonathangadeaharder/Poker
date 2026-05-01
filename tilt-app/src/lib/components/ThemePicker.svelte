<script lang="ts">
// biome-ignore lint/correctness/noUnusedImports: ThemeName used in template
import { applyTheme, type ThemeName, themes } from '$lib/stores/theme';

interface Props {
	value?: ThemeName;
	onChange?: (theme: ThemeName) => void;
}

let { value = 'felt', onChange }: Props = $props();

function select(theme: ThemeName) {
	value = theme;
	applyTheme(theme);
	onChange?.(theme);
}
</script>

<div style="display: flex; gap: 8px;">
	{#each Object.keys(themes) as name}
		{@const themeName = name as ThemeName}
		{@const t = themes[themeName]}
		<button
			type="button"
			onclick={() => select(themeName)}
			style="display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 8px 12px; background: {value === themeName
				? 'rgba(245,233,212,0.12)'
				: 'transparent'}; border: 1.5px solid {value === themeName
				? 'var(--coral)'
				: 'var(--hairline)'}; border-radius: 12px; cursor: pointer; color: var(--cream);"
		>
			<div
				style="width: 24px; height: 24px; border-radius: 50%; background: {t.felt}; border: 2px solid {t.coral};"
			></div>
			<span style="font-family: var(--mono); font-size: 10px; text-transform: capitalize;"
				>{themeName}</span
			>
		</button>
	{/each}
</div>
