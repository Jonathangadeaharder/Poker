// @vitest-environment jsdom

import { fireEvent, render, screen } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';
import CardStylePicker from './CardStylePicker.svelte';

describe('CardStylePicker', () => {
	it('renders all three style options', () => {
		render(CardStylePicker, { props: { value: 'classic' } });
		expect(screen.getByText('Classic')).toBeTruthy();
		expect(screen.getByText('Minimal')).toBeTruthy();
		expect(screen.getByText('Luxury')).toBeTruthy();
	});

	it('highlights the active option', () => {
		const { container } = render(CardStylePicker, { props: { value: 'minimal' } });
		const buttons = container.querySelectorAll('button');
		const minimalBtn = Array.from(buttons).find((b) => b.textContent?.includes('Minimal'));
		expect(minimalBtn?.classList.contains('active')).toBe(true);
	});

	it('calls onchange when selecting a different style', async () => {
		const onchange = vi.fn();
		render(CardStylePicker, { props: { value: 'classic', onchange } });
		const luxuryBtn = screen.getByText('Luxury');
		await fireEvent.click(luxuryBtn);
		expect(onchange).toHaveBeenCalledWith('luxury');
	});
});
