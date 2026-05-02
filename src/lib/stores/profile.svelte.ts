import { browser } from '$app/environment';
import { createClient } from '$lib/supabase';

export interface Profile {
	id: string;
	username: string | null;
	avatar_url: string | null;
	level: number;
	xp: number;
	streak_count: number;
	last_session_date: string | null;
	onboarding_completed: boolean;
	onboarding_goal: string | null;
	onboarding_level: string | null;
	onboarding_time: number | null;
	created_at: string;
	updated_at: string;
}

export interface DailyProgress {
	id: string;
	user_id: string;
	date: string;
	xp_earned: number;
	sessions_completed: number;
	time_spent_seconds: number;
	streak_maintained: boolean;
}

export interface TrainingProgress {
	id: string;
	user_id: string;
	module_type: string;
	module_id: string;
	progress_percent: number;
	completed_at: string | null;
}

function createProfileStore() {
	let profile = $state<Profile | null>(null);
	let dailyProgress = $state<DailyProgress | null>(null);
	let trainingProgress = $state<TrainingProgress[]>([]);
	let loading = $state(true);

	const supabase = browser ? createClient() : null;

	async function fetchProfile(userId: string) {
		if (!supabase) return;
		loading = true;
		try {
			const { data, error } = await supabase
				.from('profiles')
				.select('*')
				.eq('id', userId)
				.single();

			if (error) {
				console.error('Failed to fetch profile:', error);
			} else if (data) {
				profile = data;
			}
		} catch (e) {
			console.error('Failed to fetch profile:', e);
		} finally {
			loading = false;
		}
	}

	async function fetchDailyProgress(userId: string, date: string) {
		if (!supabase) return;
		try {
			const { data, error } = await supabase
				.from('daily_progress')
				.select('*')
				.eq('user_id', userId)
				.eq('date', date)
				.maybeSingle();

			if (error) {
				console.error('Failed to fetch daily progress:', error);
			} else {
				dailyProgress = data;
			}
		} catch (e) {
			console.error('Failed to fetch daily progress:', e);
		}
	}

	async function fetchTrainingProgress(userId: string) {
		if (!supabase) return;
		try {
			const { data, error } = await supabase
				.from('training_progress')
				.select('*')
				.eq('user_id', userId);

			if (error) {
				console.error('Failed to fetch training progress:', error);
			} else if (data) {
				trainingProgress = data;
			}
		} catch (e) {
			console.error('Failed to fetch training progress:', e);
		}
	}

	async function updateProfile(userId: string, updates: Partial<Profile>) {
		if (!supabase) return;
		try {
			const { error } = await supabase
				.from('profiles')
				.update(updates)
				.eq('id', userId);

			if (error) {
				console.error('Failed to update profile:', error);
				return;
			}
			if (profile) {
				profile = { ...profile, ...updates };
			}
		} catch (e) {
			console.error('Failed to update profile:', e);
		}
	}

	function getLocalDate(): string {
		const d = new Date();
		const y = d.getFullYear();
		const m = String(d.getMonth() + 1).padStart(2, '0');
		const day = String(d.getDate()).padStart(2, '0');
		return `${y}-${m}-${day}`;
	}

	async function addXP(userId: string, amount: number) {
		if (!supabase || !profile) return;

		const today = getLocalDate();

		const { data: updatedProfile, error: profileErr } = await supabase
			.from('profiles')
			.update({ xp: profile.xp + amount })
			.eq('id', userId)
			.select()
			.single();

		if (profileErr) {
			console.error('Failed to update profile XP:', profileErr);
			return;
		}
		if (updatedProfile) {
			profile = updatedProfile;
		}

		if (dailyProgress && dailyProgress.date === today) {
			const { data: updatedDaily, error: dailyErr } = await supabase
				.from('daily_progress')
				.update({ xp_earned: dailyProgress.xp_earned + amount })
				.eq('id', dailyProgress.id)
				.select()
				.single();

			if (dailyErr) {
				console.error('Failed to update daily progress XP:', dailyErr);
				return;
			}
			if (updatedDaily) {
				dailyProgress = updatedDaily;
			}
		} else {
			const { data: newDaily, error: insertErr } = await supabase
				.from('daily_progress')
				.upsert(
					{ user_id: userId, date: today, xp_earned: amount },
					{ onConflict: 'user_id,date' }
				)
				.select()
				.single();

			if (insertErr) {
				console.error('Failed to create daily progress:', insertErr);
				return;
			}
			if (newDaily) {
				dailyProgress = newDaily;
			}
		}
	}

	return {
		get profile() {
			return profile;
		},
		get dailyProgress() {
			return dailyProgress;
		},
		get trainingProgress() {
			return trainingProgress;
		},
		get loading() {
			return loading;
		},
		fetchProfile,
		fetchDailyProgress,
		fetchTrainingProgress,
		updateProfile,
		addXP
	};
}

export const profileStore = createProfileStore();
