<script lang="ts">
interface Props {
	active: boolean;
}

let { active }: Props = $props();

const colors = ['#ff5b48', '#e9b949', '#f5e9d4', '#ff8674'];
</script>

{#if active}
	<div
		style="position: absolute; inset: 0; pointer-events: none; overflow: hidden; z-index: 30;"
	>
		{#each { length: 28 } as _, i}
			{@const left = Math.random() * 100}
			{@const delay = Math.random() * 200}
			{@const dur = 1200 + Math.random() * 800}
			{@const rot = Math.random() * 720}
			{@const color = colors[i % colors.length]}
			<div
				class="confetti-piece"
				style="left: {left}%; top: -20px; background: {color}; animation: confetti-fall {dur}ms ease-out {delay}ms forwards; transform: rotate({rot}deg); border-radius: {i % 3 === 0
					? '50%'
					: '2px'};"
			></div>
		{/each}
	</div>
{/if}
