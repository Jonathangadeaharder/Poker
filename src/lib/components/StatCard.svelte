<script lang="ts">
interface Props {
	value: string | number;
	label: string;
}

let { value, label }: Props = $props();
</script>

<div class="stat-card">
	<span class="stat-value">{value}</span>
	<span class="stat-label">{label}</span>
</div>

<style>
	.stat-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
		padding: 16px 12px;
		background: rgba(245, 233, 212, 0.06);
		border: 1px solid var(--hairline);
		border-radius: 12px;
	}
	.stat-value {
		font-family: var(--serif);
		font-size: 28px;
		font-weight: 700;
		color: var(--cream);
		line-height: 1;
	}
	.stat-label {
		font-family: var(--mono);
		font-size: 11px;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--cream-dim, rgba(245, 233, 212, 0.5));
	}
</style>
