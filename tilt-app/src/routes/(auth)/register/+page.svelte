<script lang="ts">
import { auth } from '$lib/stores/auth.svelte';

let email = $state('');
let password = $state('');
let confirmPassword = $state('');
let error = $state('');
let loading = $state(false);
let success = $state(false);

async function handleSubmit(e: Event) {
	e.preventDefault();
	loading = true;
	error = '';

	if (password !== confirmPassword) {
		error = 'Passwords do not match';
		loading = false;
		return;
	}

	if (password.length < 6) {
		error = 'Password must be at least 6 characters';
		loading = false;
		return;
	}

	try {
		const result = await auth.signUp(email, password);
		if (result.error) {
			error = result.error.message;
		} else {
			success = true;
		}
	} finally {
		loading = false;
	}
}
</script>

<div class="auth-screen">
	<div class="auth-header">
		<div class="eyebrow">◆ Tilt</div>
		<h1 class="h-display">Create account</h1>
		<p class="subtitle">Start your poker training journey.</p>
	</div>

	{#if success}
		<div class="success-card">
			<div class="success-icon">✉️</div>
			<h2>Check your email</h2>
			<p>We sent a confirmation link to <strong>{email}</strong></p>
			<a href="/login" class="btn btn-ghost" style="margin-top: 16px">Back to login</a>
		</div>
	{:else}
		<form class="auth-form" onsubmit={handleSubmit}>
			{#if error}
				<div class="error-message" role="alert" aria-live="assertive">{error}</div>
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

			<label class="field">
				<span class="field-label">Confirm password</span>
				<input
					type="password"
					bind:value={confirmPassword}
					placeholder="••••••••"
					required
					disabled={loading}
				/>
			</label>

			<button type="submit" class="btn btn-primary" disabled={loading}>
				{loading ? 'Creating account...' : 'Create account'}
			</button>
		</form>

		<div class="auth-footer">
			<span>Already have an account?</span>
			<a href="/login">Sign in</a>
		</div>
	{/if}
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

	.success-card {
		background: rgba(76, 175, 80, 0.12);
		border: 1px solid rgba(76, 175, 80, 0.3);
		border-radius: 22px;
		padding: 32px 24px;
		text-align: center;
	}

	.success-icon {
		font-size: 48px;
		margin-bottom: 16px;
	}

	.success-card h2 {
		font-size: 22px;
		margin-bottom: 8px;
	}

	.success-card p {
		font-size: 14px;
		color: var(--cream-dim);
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
