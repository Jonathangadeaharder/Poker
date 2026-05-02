// @vitest-environment jsdom

import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import AchievementBadge from './AchievementBadge.svelte';

const mockAchievement = {
	id: 'first_session',
	title: 'First Steps',
	description: 'Complete your first training session',
	icon: '🎯',
	xpReward: 50,
	requirement: { type: 'sessions' as const, count: 1 }
};

describe('AchievementBadge', () => {
	it('renders achievement icon and title when unlocked', () => {
		render(AchievementBadge, {
			props: { achievement: mockAchievement, unlocked: true }
		});
		expect(screen.getByText('🎯')).toBeTruthy();
		expect(screen.getByText('First Steps')).toBeTruthy();
	});

	it('shows lock overlay when locked', () => {
		render(AchievementBadge, {
			props: { achievement: mockAchievement, unlocked: false }
		});
		expect(screen.getByText('🔒')).toBeTruthy();
		expect(screen.getByText('First Steps')).toBeTruthy();
	});

	it('applies greyed style when locked', () => {
		const { container } = render(AchievementBadge, {
			props: { achievement: mockAchievement, unlocked: false }
		});
		const badge = container.querySelector('.achievement-badge');
		expect(badge?.classList.contains('locked')).toBe(true);
	});

	it('shows description on hover', async () => {
		render(AchievementBadge, {
			props: { achievement: mockAchievement, unlocked: true }
		});
		const badge = screen.getByText('First Steps').closest('.achievement-badge');
		expect(badge).toBeTruthy();
		// CSS-only tooltip — description exists in DOM
		expect(screen.getByText('Complete your first training session')).toBeTruthy();
	});
});
