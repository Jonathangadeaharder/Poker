//#region src/lib/core/soundManager.ts
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
var SOUND_EVENTS = {
	XP_GAINED: "xp_gain",
	LEVEL_UP: "level_up",
	ACHIEVEMENT_UNLOCKED: "achievement",
	STREAK_MILESTONE: "streak_milestone",
	QUIZ_PERFECT: "perfect",
	CORRECT_ANSWER: "correct",
	CARD_FLIP: "card_flip",
	BUTTON_TAP: "tap",
	PAGE_TURN: "page_turn",
	WRONG_ANSWER: "wrong",
	STREAK_BROKEN: "streak_broken",
	SESSION_START: "session_start",
	SESSION_COMPLETE: "session_complete"
};
var HAPTIC_FEEDBACK = {
	LIGHT: "light",
	MEDIUM: "medium",
	HEAVY: "heavy",
	SUCCESS: "success",
	WARNING: "warning",
	ERROR: "error"
};
var SoundManager = class {
	sounds;
	enabled;
	volume;
	hapticsEnabled;
	audioCtx;
	initialized;
	constructor() {
		this.sounds = {};
		this.enabled = true;
		this.volume = .7;
		this.hapticsEnabled = true;
		this.audioCtx = null;
		this.initialized = false;
	}
	getContext() {
		if (!this.audioCtx) this.audioCtx = new AudioContext();
		return this.audioCtx;
	}
	/**
	* Generate a simple tone using Web Audio API
	* In production, replace with real audio file loading
	*/
	async loadSounds() {
		if (this.initialized) return;
		try {
			const ctx = this.getContext();
			this.sounds[SOUND_EVENTS.CORRECT_ANSWER] = this.generateTone(ctx, 800, .15, "sine");
			this.sounds[SOUND_EVENTS.WRONG_ANSWER] = this.generateTone(ctx, 300, .2, "sawtooth");
			this.sounds[SOUND_EVENTS.XP_GAINED] = this.generateTone(ctx, 1e3, .1, "sine");
			this.sounds[SOUND_EVENTS.LEVEL_UP] = this.generateChord(ctx, [
				523,
				659,
				784
			], .3);
			this.sounds[SOUND_EVENTS.ACHIEVEMENT_UNLOCKED] = this.generateChord(ctx, [
				440,
				554,
				659
			], .4);
			this.sounds[SOUND_EVENTS.QUIZ_PERFECT] = this.generateChord(ctx, [
				523,
				659,
				784,
				1047
			], .5);
			this.sounds[SOUND_EVENTS.CARD_FLIP] = this.generateNoise(ctx, .05);
			this.sounds[SOUND_EVENTS.BUTTON_TAP] = this.generateTone(ctx, 600, .05, "sine");
			this.sounds[SOUND_EVENTS.STREAK_BROKEN] = this.generateTone(ctx, 200, .3, "sawtooth");
			this.sounds[SOUND_EVENTS.SESSION_START] = this.generateChord(ctx, [
				330,
				440,
				554
			], .3);
			this.sounds[SOUND_EVENTS.SESSION_COMPLETE] = this.generateChord(ctx, [
				523,
				659,
				784,
				1047
			], .5);
			this.sounds[SOUND_EVENTS.STREAK_MILESTONE] = this.generateChord(ctx, [
				440,
				554,
				659,
				880
			], .4);
			this.sounds[SOUND_EVENTS.PAGE_TURN] = this.generateNoise(ctx, .03);
			this.initialized = true;
		} catch (error) {
			console.error("Failed to initialize sound manager:", error);
		}
	}
	generateTone(ctx, frequency, duration, type) {
		const sampleRate = ctx.sampleRate;
		const length = Math.floor(sampleRate * duration);
		const buffer = ctx.createBuffer(1, length, sampleRate);
		const data = buffer.getChannelData(0);
		for (let i = 0; i < length; i++) {
			const t = i / sampleRate;
			const envelope = 1 - i / length;
			let sample;
			if (type === "sine") sample = Math.sin(2 * Math.PI * frequency * t);
			else if (type === "sawtooth") sample = 2 * (frequency * t % 1) - 1;
			else sample = Math.sin(2 * Math.PI * frequency * t);
			data[i] = sample * envelope * .3;
		}
		return buffer;
	}
	generateChord(ctx, frequencies, duration) {
		const sampleRate = ctx.sampleRate;
		const length = Math.floor(sampleRate * duration);
		const buffer = ctx.createBuffer(1, length, sampleRate);
		const data = buffer.getChannelData(0);
		for (let i = 0; i < length; i++) {
			const t = i / sampleRate;
			const envelope = 1 - (i / length) ** 2;
			let sample = 0;
			for (const freq of frequencies) sample += Math.sin(2 * Math.PI * freq * t);
			data[i] = sample / frequencies.length * envelope * .3;
		}
		return buffer;
	}
	generateNoise(ctx, duration) {
		const sampleRate = ctx.sampleRate;
		const length = Math.floor(sampleRate * duration);
		const buffer = ctx.createBuffer(1, length, sampleRate);
		const data = buffer.getChannelData(0);
		for (let i = 0; i < length; i++) {
			const envelope = 1 - i / length;
			data[i] = (Math.random() * 2 - 1) * envelope * .1;
		}
		return buffer;
	}
	async playSound(eventType) {
		if (!this.enabled) return;
		try {
			await this.loadSounds();
			const buffer = this.sounds[eventType];
			if (!buffer) return;
			const ctx = this.getContext();
			if (ctx.state === "suspended") await ctx.resume();
			const source = ctx.createBufferSource();
			const gainNode = ctx.createGain();
			source.buffer = buffer;
			gainNode.gain.value = this.volume;
			source.connect(gainNode);
			gainNode.connect(ctx.destination);
			source.start();
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
				default: break;
			}
		} catch (error) {
			console.error("Error playing sound:", error);
		}
	}
	triggerHaptic(type) {
		if (!this.hapticsEnabled) return;
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
					navigator.vibrate([
						10,
						50,
						10
					]);
					break;
				case HAPTIC_FEEDBACK.WARNING:
					navigator.vibrate([
						20,
						30,
						20
					]);
					break;
				case HAPTIC_FEEDBACK.ERROR:
					navigator.vibrate([
						40,
						30,
						40
					]);
					break;
			}
		} catch {}
	}
	isEnabled() {
		return this.enabled;
	}
	setEnabled(enabled) {
		this.enabled = enabled;
	}
	setVolume(volume) {
		this.volume = Math.max(0, Math.min(1, volume));
	}
	setHapticsEnabled(enabled) {
		this.hapticsEnabled = enabled;
	}
	async cleanup() {
		this.sounds = {};
		if (this.audioCtx) {
			await this.audioCtx.close();
			this.audioCtx = null;
		}
		this.initialized = false;
	}
};
var soundManager = new SoundManager();
//#endregion
export { soundManager as t };
