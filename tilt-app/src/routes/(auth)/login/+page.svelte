<script lang="ts">
import { goto } from '$app/navigation';
import { auth } from '$lib/stores/auth.svelte';

let email = $state('');
let password = $state('');
let error = $state('');
let loading = $state(false);

async function handleSubmit(e: Event) {
	e.preventDefault();
	loading = true;
	error = '';

	const result = await auth.signInWithPassword(email, password);
	if (result.error) {
		error = result.error.message;
		loading = false;
	} else {
		goto('/');
	}
}
</script>

<div class="auth-screen">
	<div class="auth-header">
		<div class="eyebrow">◆ Tilt</div>
		<h1 class="h-display">Welcome back</h1>
		<p class="subtitle">Pick up where you left off.</p>
	</div>

	<form class="auth-form" onsubmit={handleSubmit}>
		{#if error}
			<div class="error-message">{error}</div>
		{/if}

		<label class="field">
			<span class="field-label">Email</span>
			<input
				type="email"
				bind:value={email}
				placeholder="you@example.com"
				required
				disabled={loading}
			/>
		</label>

		<label class="field">
			<span class="field-label">Password</span>
			<input
				type="password"
				bind:value={password}
				placeholder="••••••••"
				required
				disabled={loading}
			/>
		</label>

		<button type="submit" class="btn btn-primary" disabled={loading}>
			{loading ? 'Signing in...' : 'Sign in'}
		</button>
	</form>

	<div class="auth-footer">
		<span>Don't have an account?</span>
		<a href="/register">Create one</a>
	</div>
</div>

<style>
	.auth-screen {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		background: var(--felt);
		padding: 60px 28px 40px;
	}

	.auth-header {
		margin-bottom: 40px;
	}

	.auth-header h1 {
		font-size: 36px;
		margin-top: 8px;
	}

	.subtitle {
		font-size: 16px;
		color: var(--cream-dim);
		margin-top: 8px;
	}

	.auth-form {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.field-label {
		font-size: 13px;
		font-weight: 600;
		color: var(--cream-dim);
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.field input {
		background: rgba(245, 233, 212, 0.05);
		border: 1.5px solid var(--hairline-strong);
		border-radius: 12px;
		padding: 14px 16px;
		font-size: 16px;
		color: var(--cream);
		font-family: var(--sans);
		transition: border-color 180ms ease;
	}

	.field input:focus {
		outline: none;
		border-color: var(--coral);
	}

	.field input::placeholder {
		color: var(--cream-dim);
		opacity: 0.5;
	}

	.error-message {
		background: rgba(255, 91, 72, 0.12);
		border: 1px solid rgba(255, 91, 72, 0.3);
		border-radius: 12px;
		padding: 12px 16px;
		font-size: 14px;
		color: var(--coral);
	}

	.auth-footer {
		margin-top: 32px;
		text-align: center;
		font-size: 14px;
		color: var(--cream-dim);
	}

	.auth-footer a {
		color: var(--coral);
		text-decoration: none;
		font-weight: 600;
		margin-left: 4px;
	}

	.auth-footer a:hover {
		text-decoration: underline;
	}
</style>
