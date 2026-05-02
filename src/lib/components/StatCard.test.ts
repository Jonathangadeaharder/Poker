// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import StatCard from './StatCard.svelte';

describe('StatCard', () => {
	it('renders value and label', () => {
		render(StatCard, { props: { value: 42, label: 'Sessions' } });
		expect(screen.getByText('42')).toBeTruthy();
		expect(screen.getByText('Sessions')).toBeTruthy();
	});

	it('renders string values', () => {
		render(StatCard, { props: { value: '12h', label: 'Time' } });
		expect(screen.getByText('12h')).toBeTruthy();
	});
});
