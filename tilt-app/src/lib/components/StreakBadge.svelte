<script lang="ts">
interface Props {
	count: number;
}

let { count }: Props = $props();
</script>

<div
	style="display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; background: rgba(255,91,72,0.12); border: 1px solid rgba(255,91,72,0.3); border-radius: 999px;"
>
	<span style="font-size: 14px;">🔥</span>
	<span class="mono" style="font-size: 13px; font-weight: 700; color: var(--coral-soft);"
		>{count}</span
	>
</div>
