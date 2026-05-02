<script lang="ts">
interface Tab {
	id: string;
	label: string;
	icon: string;
}

interface Props {
	tabs?: Tab[];
	active?: string;
	onNavigate?: (id: string) => void;
}

let {
	tabs = [
		{ id: 'today', label: 'Today', icon: '📅' },
		{ id: 'practice', label: 'Practice', icon: '🎯' },
		{ id: 'replay', label: 'Replay', icon: '🔄' },
		{ id: 'you', label: 'You', icon: '👤' }
	],
	active = 'today',
	onNavigate
}: Props = $props();
</script>

<nav
	style="position: fixed; bottom: 0; left: 0; right: 0; display: flex; align-items: center; justify-content: space-around; padding: 8px 0 calc(8px + env(safe-area-inset-bottom)); background: var(--ink); border-top: 1px solid var(--hairline); z-index: 20;"
>
	{#each tabs as tab}
		{@const isActive = tab.id === active}
		<button
			type="button"
			onclick={() => onNavigate?.(tab.id)}
			style="display: flex; flex-direction: column; align-items: center; gap: 2px; padding: 4px 16px; background: none; border: none; cursor: pointer; color: {isActive
				? 'var(--coral)'
				: 'var(--cream-dim)'}; font-family: var(--mono); font-size: 10px; letter-spacing: 0.06em; text-transform: uppercase;"
		>
			<span style="font-size: 20px;">{tab.icon}</span>
			<span>{tab.label}</span>
		</button>
	{/each}
</nav>
