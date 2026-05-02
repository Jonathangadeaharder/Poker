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
		const { data, error } = await supabase
			.from('profiles')
			.select('*')
			.eq('id', userId)
			.single();

		if (!error && data) {
			profile = data;
		}
		loading = false;
	}

	async function fetchDailyProgress(userId: string, date: string) {
		if (!supabase) return;
		const { data, error } = await supabase
			.from('daily_progress')
			.select('*')
			.eq('user_id', userId)
			.eq('date', date)
			.maybeSingle();

		if (!error) {
			dailyProgress = data;
		}
	}

	async function fetchTrainingProgress(userId: string) {
		if (!supabase) return;
		const { data, error } = await supabase
			.from('training_progress')
			.select('*')
			.eq('user_id', userId);

		if (!error && data) {
			trainingProgress = data;
		}
	}

	async function updateProfile(userId: string, updates: Partial<Profile>) {
		if (!supabase) return;
		const { error } = await supabase
			.from('profiles')
			.update(updates)
			.eq('id', userId);

		if (!error && profile) {
			profile = { ...profile, ...updates };
		}
	}

	async function addXP(userId: string, amount: number) {
		if (!supabase || !profile) return;

		const newXP = profile.xp + amount;
		await updateProfile(userId, { xp: newXP });

		const today = new Date().toISOString().split('T')[0];
		if (dailyProgress && dailyProgress.date === today) {
			const newDailyXP = dailyProgress.xp_earned + amount;
			await supabase
				.from('daily_progress')
				.update({ xp_earned: newDailyXP })
				.eq('id', dailyProgress.id);
			dailyProgress = { ...dailyProgress, xp_earned: newDailyXP };
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
