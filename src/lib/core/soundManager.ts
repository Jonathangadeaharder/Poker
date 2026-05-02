/**
 * Sound & Haptic Feedback Manager
 * Based on Google Material Design & Apple WWDC Best Practices
 *
 * Uses Web Audio API + Vibration API (web equivalents of expo-av + expo-haptics)
 *
 * Principles:
 * - Not every interaction needs sound (only meaningful moments)
 * - Multi-sensory coherence (looks + sounds + feels together)
 * - Success sounds: pleasant chimes
 * - Error sounds: short, sharp alerts
 * - Haptic feedback for important actions
 */

export const SOUND_EVENTS = {
	// Success Sounds
	XP_GAINED: 'xp_gain',
	LEVEL_UP: 'level_up',
	ACHIEVEMENT_UNLOCKED: 'achievement',
	STREAK_MILESTONE: 'streak_milestone',
	QUIZ_PERFECT: 'perfect',
	CORRECT_ANSWER: 'correct',

	// Neutral Sounds
	CARD_FLIP: 'card_flip',
	BUTTON_TAP: 'tap',
	PAGE_TURN: 'page_turn',

	// Negative Sounds
	WRONG_ANSWER: 'wrong',
	STREAK_BROKEN: 'streak_broken',

	// Ambience
	SESSION_START: 'session_start',
	SESSION_COMPLETE: 'session_complete'
} as const;

export type SoundEvent = (typeof SOUND_EVENTS)[keyof typeof SOUND_EVENTS];

export const HAPTIC_FEEDBACK = {
	LIGHT: 'light',
	MEDIUM: 'medium',
	HEAVY: 'heavy',
	SUCCESS: 'success',
	WARNING: 'warning',
	ERROR: 'error'
} as const;

export type HapticType = (typeof HAPTIC_FEEDBACK)[keyof typeof HAPTIC_FEEDBACK];

type SoundMap = Record<string, AudioBuffer>;

class SoundManager {
	private sounds: SoundMap;
	private enabled: boolean;
	private volume: number;
	private hapticsEnabled: boolean;
	private audioCtx: AudioContext | null;
	private initialized: boolean;

	constructor() {
		this.sounds = {};
		this.enabled = true;
		this.volume = 0.7;
		this.hapticsEnabled = true;
		this.audioCtx = null;
		this.initialized = false;
	}

	private getContext(): AudioContext {
		if (!this.audioCtx) {
			this.audioCtx = new AudioContext();
		}
		return this.audioCtx;
	}

	/**
	 * Generate a simple tone using Web Audio API
	 * In production, replace with real audio file loading
	 */
	async loadSounds(): Promise<void> {
		if (this.initialized) return;

		try {
			const ctx = this.getContext();

			// Generate simple tone buffers for key events
			this.sounds[SOUND_EVENTS.CORRECT_ANSWER] = this.generateTone(ctx, 800, 0.15, 'sine');
			this.sounds[SOUND_EVENTS.WRONG_ANSWER] = this.generateTone(ctx, 300, 0.2, 'sawtooth');
			this.sounds[SOUND_EVENTS.XP_GAINED] = this.generateTone(ctx, 1000, 0.1, 'sine');
			this.sounds[SOUND_EVENTS.LEVEL_UP] = this.generateChord(ctx, [523, 659, 784], 0.3);
			this.sounds[SOUND_EVENTS.ACHIEVEMENT_UNLOCKED] = this.generateChord(
				ctx,
				[440, 554, 659],
				0.4
			);
			this.sounds[SOUND_EVENTS.QUIZ_PERFECT] = this.generateChord(ctx, [523, 659, 784, 1047], 0.5);
			this.sounds[SOUND_EVENTS.CARD_FLIP] = this.generateNoise(ctx, 0.05);
			this.sounds[SOUND_EVENTS.BUTTON_TAP] = this.generateTone(ctx, 600, 0.05, 'sine');
			this.sounds[SOUND_EVENTS.STREAK_BROKEN] = this.generateTone(ctx, 200, 0.3, 'sawtooth');
			this.sounds[SOUND_EVENTS.SESSION_START] = this.generateChord(ctx, [330, 440, 554], 0.3);
			this.sounds[SOUND_EVENTS.SESSION_COMPLETE] = this.generateChord(
				ctx,
				[523, 659, 784, 1047],
				0.5
			);
			this.sounds[SOUND_EVENTS.STREAK_MILESTONE] = this.generateChord(ctx, [440, 554, 659, 880], 0.4);
			this.sounds[SOUND_EVENTS.PAGE_TURN] = this.generateNoise(ctx, 0.03);

			this.initialized = true;
		} catch (error) {
			console.error('Failed to initialize sound manager:', error);
		}
	}

	private generateTone(
		ctx: AudioContext,
		frequency: number,
		duration: number,
		type: OscillatorType
	): AudioBuffer {
		const sampleRate = ctx.sampleRate;
		const length = Math.floor(sampleRate * duration);
		const buffer = ctx.createBuffer(1, length, sampleRate);
		const data = buffer.getChannelData(0);

		for (let i = 0; i < length; i++) {
			const t = i / sampleRate;
			const envelope = 1 - i / length; // Linear fade out
			let sample: number;

			if (type === 'sine') {
				sample = Math.sin(2 * Math.PI * frequency * t);
			} else if (type === 'sawtooth') {
				sample = 2 * ((frequency * t) % 1) - 1;
			} else {
				sample = Math.sin(2 * Math.PI * frequency * t);
			}

			data[i] = sample * envelope * 0.3;
		}

		return buffer;
	}

	private generateChord(ctx: AudioContext, frequencies: number[], duration: number): AudioBuffer {
		const sampleRate = ctx.sampleRate;
		const length = Math.floor(sampleRate * duration);
		const buffer = ctx.createBuffer(1, length, sampleRate);
		const data = buffer.getChannelData(0);

		for (let i = 0; i < length; i++) {
			const t = i / sampleRate;
			const envelope = 1 - (i / length) ** 2; // Quadratic fade out
			let sample = 0;

			for (const freq of frequencies) {
				sample += Math.sin(2 * Math.PI * freq * t);
			}

			data[i] = (sample / frequencies.length) * envelope * 0.3;
		}

		return buffer;
	}

	private generateNoise(ctx: AudioContext, duration: number): AudioBuffer {
		const sampleRate = ctx.sampleRate;
		const length = Math.floor(sampleRate * duration);
		const buffer = ctx.createBuffer(1, length, sampleRate);
		const data = buffer.getChannelData(0);

		for (let i = 0; i < length; i++) {
			const envelope = 1 - i / length;
			data[i] = (Math.random() * 2 - 1) * envelope * 0.1;
		}

		return buffer;
	}

	async playSound(eventType: SoundEvent): Promise<void> {
		if (!this.enabled) return;

		try {
			await this.loadSounds();

			const buffer = this.sounds[eventType];
			if (!buffer) return;

			const ctx = this.getContext();
			if (ctx.state === 'suspended') {
				await ctx.resume();
			}

			const source = ctx.createBufferSource();
			const gainNode = ctx.createGain();

			source.buffer = buffer;
			gainNode.gain.value = this.volume;

			source.connect(gainNode);
			gainNode.connect(ctx.destination);

			source.start();

			// Trigger haptic based on sound type
			switch (eventType) {
				case SOUND_EVENTS.XP_GAINED:
				case SOUND_EVENTS.CORRECT_ANSWER:
					this.triggerHaptic(HAPTIC_FEEDBACK.LIGHT);
					break;

				case SOUND_EVENTS.LEVEL_UP:
				case SOUND_EVENTS.ACHIEVEMENT_UNLOCKED:
				case SOUND_EVENTS.QUIZ_PERFECT:
					this.triggerHaptic(HAPTIC_FEEDBACK.SUCCESS);
					break;

				case SOUND_EVENTS.WRONG_ANSWER:
					this.triggerHaptic(HAPTIC_FEEDBACK.WARNING);
					break;

				case SOUND_EVENTS.STREAK_BROKEN:
					this.triggerHaptic(HAPTIC_FEEDBACK.ERROR);
					break;

				default:
					break;
			}
		} catch (error) {
			console.error('Error playing sound:', error);
		}
	}

	triggerHaptic(type: HapticType): void {
		if (!this.hapticsEnabled) return;

		// Use Vibration API (web equivalent of expo-haptics)
		if (typeof navigator === "undefined" || !navigator.vibrate) return;

		try {
			switch (type) {
				case HAPTIC_FEEDBACK.LIGHT:
					navigator.vibrate(10);
					break;
				case HAPTIC_FEEDBACK.MEDIUM:
					navigator.vibrate(20);
					break;
				case HAPTIC_FEEDBACK.HEAVY:
					navigator.vibrate(40);
					break;
				case HAPTIC_FEEDBACK.SUCCESS:
					navigator.vibrate([10, 50, 10]);
					break;
				case HAPTIC_FEEDBACK.WARNING:
					navigator.vibrate([20, 30, 20]);
					break;
				case HAPTIC_FEEDBACK.ERROR:
					navigator.vibrate([40, 30, 40]);
					break;
			}
		} catch {
			// Haptics not available on this device
		}
	}

	isEnabled(): boolean {
		return this.enabled;
	}

	setEnabled(enabled: boolean): void {
		this.enabled = enabled;
	}

	setVolume(volume: number): void {
		this.volume = Math.max(0, Math.min(1, volume));
	}

	setHapticsEnabled(enabled: boolean): void {
		this.hapticsEnabled = enabled;
	}

	async cleanup(): Promise<void> {
		this.sounds = {};
		if (this.audioCtx) {
			await this.audioCtx.close();
			this.audioCtx = null;
		}
		this.initialized = false;
	}
}

// Singleton instance
const soundManager = new SoundManager();

export default soundManager;

/**
 * Helper functions for common usage
 */
export async function playSuccessSound(): Promise<void> {
	await soundManager.playSound(SOUND_EVENTS.CORRECT_ANSWER);
}

export async function playErrorSound(): Promise<void> {
	await soundManager.playSound(SOUND_EVENTS.WRONG_ANSWER);
}

export async function playXPSound(): Promise<void> {
	await soundManager.playSound(SOUND_EVENTS.XP_GAINED);
}

export async function playLevelUpSound(): Promise<void> {
	await soundManager.playSound(SOUND_EVENTS.LEVEL_UP);
}

export async function playAchievementSound(): Promise<void> {
	await soundManager.playSound(SOUND_EVENTS.ACHIEVEMENT_UNLOCKED);
}

export function hapticLight(): void {
	soundManager.triggerHaptic(HAPTIC_FEEDBACK.LIGHT);
}

export function hapticSuccess(): void {
	soundManager.triggerHaptic(HAPTIC_FEEDBACK.SUCCESS);
}

export function hapticError(): void {
	soundManager.triggerHaptic(HAPTIC_FEEDBACK.ERROR);
}
