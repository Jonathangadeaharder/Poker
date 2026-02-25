/**
 * Sound & Haptic Feedback Manager
 * Basierend auf Google Material Design & Apple WWDC Best Practices
 *
 * Prinzipien:
 * - Nicht jede Interaktion braucht Sound (nur meaningful moments)
 * - Multi-sensory coherence (looks + sounds + feels zusammen)
 * - Success sounds: pleasant chimes
 * - Error sounds: short, sharp alerts
 * - Haptic feedback für wichtige Aktionen
 */

import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';

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
  SESSION_COMPLETE: 'session_complete',
};

export const HAPTIC_FEEDBACK = {
  LIGHT: 'light',
  MEDIUM: 'medium',
  HEAVY: 'heavy',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
};

class SoundManager {
  constructor() {
    this.sounds = {};
    this.enabled = true;
    this.volume = 0.7;
    this.hapticsEnabled = true;
  }

  /**
   * In einer echten App würden wir Audio-Files laden
   * Für diese Demo verwenden wir Expo AV mit generierten Sounds
   * oder Web Audio API
   */
  async loadSounds() {
    // In production würden Sie hier echte Audio-Files laden:
    // const { sound } = await Audio.Sound.createAsync(
    //   require('../assets/sounds/success.mp3')
    // );
    // this.sounds[SOUND_EVENTS.CORRECT_ANSWER] = sound;

    console.log('Sounds loaded (mock)');
  }

  async playSound(eventType) {
    if (!this.enabled) return;

    try {
      // Mock implementation - in real app würde hier Audio.Sound.playAsync() aufgerufen
      console.log(`🔊 Playing sound: ${eventType}`);

      // Haptic feedback basierend auf Sound-Typ
      switch (eventType) {
        case SOUND_EVENTS.XP_GAINED:
        case SOUND_EVENTS.CORRECT_ANSWER:
          await this.triggerHaptic(HAPTIC_FEEDBACK.LIGHT);
          break;

        case SOUND_EVENTS.LEVEL_UP:
        case SOUND_EVENTS.ACHIEVEMENT_UNLOCKED:
        case SOUND_EVENTS.QUIZ_PERFECT:
          await this.triggerHaptic(HAPTIC_FEEDBACK.SUCCESS);
          break;

        case SOUND_EVENTS.WRONG_ANSWER:
          await this.triggerHaptic(HAPTIC_FEEDBACK.WARNING);
          break;

        case SOUND_EVENTS.STREAK_BROKEN:
          await this.triggerHaptic(HAPTIC_FEEDBACK.ERROR);
          break;

        default:
          // Kein Haptic für neutrale Sounds
          break;
      }
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  }

  async triggerHaptic(type) {
    if (!this.hapticsEnabled) return;

    try {
      switch (type) {
        case HAPTIC_FEEDBACK.LIGHT:
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          break;
        case HAPTIC_FEEDBACK.MEDIUM:
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          break;
        case HAPTIC_FEEDBACK.HEAVY:
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          break;
        case HAPTIC_FEEDBACK.SUCCESS:
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          break;
        case HAPTIC_FEEDBACK.WARNING:
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          break;
        case HAPTIC_FEEDBACK.ERROR:
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          break;
      }
    } catch (error) {
      // Haptics nicht verfügbar auf diesem Device
      console.log('Haptics not available');
    }
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
    // Unload alle Sounds
    for (const sound of Object.values(this.sounds)) {
      if (sound && sound.unloadAsync) {
        await sound.unloadAsync();
      }
    }
    this.sounds = {};
  }
}

// Singleton instance
const soundManager = new SoundManager();

export default soundManager;

/**
 * Helper Funktionen für häufige Verwendung
 */
export async function playSuccessSound() {
  await soundManager.playSound(SOUND_EVENTS.CORRECT_ANSWER);
}

export async function playErrorSound() {
  await soundManager.playSound(SOUND_EVENTS.WRONG_ANSWER);
}

export async function playXPSound() {
  await soundManager.playSound(SOUND_EVENTS.XP_GAINED);
}

export async function playLevelUpSound() {
  await soundManager.playSound(SOUND_EVENTS.LEVEL_UP);
}

export async function playAchievementSound() {
  await soundManager.playSound(SOUND_EVENTS.ACHIEVEMENT_UNLOCKED);
}

export async function hapticLight() {
  await soundManager.triggerHaptic(HAPTIC_FEEDBACK.LIGHT);
}

export async function hapticSuccess() {
  await soundManager.triggerHaptic(HAPTIC_FEEDBACK.SUCCESS);
}

export async function hapticError() {
  await soundManager.triggerHaptic(HAPTIC_FEEDBACK.ERROR);
}
