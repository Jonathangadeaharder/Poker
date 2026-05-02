<script lang="ts">
interface Props {
	label?: string;
	class?: string;
}

let { label = '', class: className = '' }: Props = $props();
</script>

<span class="chip {className}">
	{label}
</span>
