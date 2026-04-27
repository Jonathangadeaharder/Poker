/**
 * Accessibility Utilities
 * Helper functions for improving app accessibility
 */

/**
 * Create accessibility props for buttons
 */
export function createButtonA11y(label, hint = '', disabled = false) {
  return {
    accessible: true,
    accessibilityRole: 'button',
    accessibilityLabel: label,
    accessibilityHint: hint || undefined,
    accessibilityState: { disabled },
  };
}

/**
 * Create accessibility props for text inputs
 */
export function createTextInputA11y(label, hint = '', value = '') {
  return {
    accessible: true,
    accessibilityRole: 'none', // React Native Paper handles this
    accessibilityLabel: label,
    accessibilityHint: hint || undefined,
    accessibilityValue: value ? { text: value } : undefined,
  };
}

/**
 * Create accessibility props for images
 */
export function createImageA11y(label, isDecorative = false) {
  if (isDecorative) {
    return {
      accessible: false,
      importantForAccessibility: 'no',
    };
  }

  return {
    accessible: true,
    accessibilityRole: 'image',
    accessibilityLabel: label,
  };
}

/**
 * Create accessibility props for links
 */
export function createLinkA11y(label, hint = '') {
  return {
    accessible: true,
    accessibilityRole: 'link',
    accessibilityLabel: label,
    accessibilityHint: hint || undefined,
  };
}

/**
 * Create accessibility props for headers
 */
export function createHeaderA11y(label, level = 1) {
  return {
    accessible: true,
    accessibilityRole: 'header',
    accessibilityLabel: label,
    accessibilityLevel: level,
  };
}

/**
 * Create accessibility props for progress bars
 */
export function createProgressA11y(current, max, label = '') {
  const percentage = Math.round((current / max) * 100);

  return {
    accessible: true,
    accessibilityRole: 'progressbar',
    accessibilityLabel: label || `Progress: ${percentage}%`,
    accessibilityValue: {
      min: 0,
      max,
      now: current,
      text: `${percentage}%`,
    },
  };
}

/**
 * Create accessibility props for checkboxes
 */
export function createCheckboxA11y(label, checked, hint = '') {
  return {
    accessible: true,
    accessibilityRole: 'checkbox',
    accessibilityLabel: label,
    accessibilityHint: hint || undefined,
    accessibilityState: { checked },
  };
}

/**
 * Create accessibility props for radio buttons
 */
export function createRadioA11y(label, selected, hint = '') {
  return {
    accessible: true,
    accessibilityRole: 'radio',
    accessibilityLabel: label,
    accessibilityHint: hint || undefined,
    accessibilityState: { selected },
  };
}

/**
 * Create accessibility props for switches
 */
export function createSwitchA11y(label, value, hint = '') {
  return {
    accessible: true,
    accessibilityRole: 'switch',
    accessibilityLabel: label,
    accessibilityHint: hint || undefined,
    accessibilityState: { checked: value },
  };
}

/**
 * Create accessibility props for tabs
 */
export function createTabA11y(label, selected, index, total) {
  return {
    accessible: true,
    accessibilityRole: 'tab',
    accessibilityLabel: `${label}, tab ${index + 1} of ${total}`,
    accessibilityState: { selected },
  };
}

/**
 * Create accessibility props for alerts
 */
export function createAlertA11y(message, type = 'info') {
  return {
    accessible: true,
    accessibilityRole: 'alert',
    accessibilityLabel: `${type}: ${message}`,
    accessibilityLiveRegion: 'polite',
  };
}

/**
 * Create accessibility props for cards/containers
 */
export function createCardA11y(title, description = '') {
  return {
    accessible: true,
    accessibilityLabel: description ? `${title}. ${description}` : title,
  };
}

/**
 * Announce message to screen reader
 */
export function announceForAccessibility(message) {
  if (typeof AccessibilityInfo !== 'undefined') {
    AccessibilityInfo.announceForAccessibility(message);
  }
}

/**
 * Check if screen reader is enabled
 */
export async function isScreenReaderEnabled() {
  if (typeof AccessibilityInfo !== 'undefined') {
    return await AccessibilityInfo.isScreenReaderEnabled();
  }
  return false;
}

/**
 * Focus accessibility on an element
 */
export function setAccessibilityFocus(reactTag) {
  if (typeof AccessibilityInfo !== 'undefined' && reactTag) {
    AccessibilityInfo.setAccessibilityFocus(reactTag);
  }
}

/**
 * Accessibility constants
 */
export const A11Y_TRAITS = {
  BUTTON: 'button',
  LINK: 'link',
  IMAGE: 'image',
  HEADER: 'header',
  SEARCH: 'search',
  TEXT: 'text',
  ADJUSTABLE: 'adjustable',
  SUMMARY: 'summary',
  NONE: 'none',
};

export const A11Y_STATES = {
  SELECTED: 'selected',
  DISABLED: 'disabled',
  CHECKED: 'checked',
  BUSY: 'busy',
  EXPANDED: 'expanded',
};

export const A11Y_LIVE_REGION = {
  NONE: 'none',
  POLITE: 'polite',
  ASSERTIVE: 'assertive',
};

/**
 * Helper to create accessible list item
 */
export function createListItemA11y(title, subtitle = '', index, total) {
  const label = subtitle ? `${title}, ${subtitle}` : title;
  return {
    accessible: true,
    accessibilityLabel: `${label}. Item ${index + 1} of ${total}`,
  };
}

/**
 * Helper for form validation errors
 */
export function createErrorA11y(field, error) {
  return {
    accessible: true,
    accessibilityRole: 'alert',
    accessibilityLabel: `${field} error: ${error}`,
    accessibilityLiveRegion: 'assertive',
  };
}

/**
 * Helper for success messages
 */
export function createSuccessA11y(message) {
  return {
    accessible: true,
    accessibilityRole: 'alert',
    accessibilityLabel: `Success: ${message}`,
    accessibilityLiveRegion: 'polite',
  };
}

export default {
  createButtonA11y,
  createTextInputA11y,
  createImageA11y,
  createLinkA11y,
  createHeaderA11y,
  createProgressA11y,
  createCheckboxA11y,
  createRadioA11y,
  createSwitchA11y,
  createTabA11y,
  createAlertA11y,
  createCardA11y,
  createListItemA11y,
  createErrorA11y,
  createSuccessA11y,
  announceForAccessibility,
  isScreenReaderEnabled,
  setAccessibilityFocus,
  A11Y_TRAITS,
  A11Y_STATES,
  A11Y_LIVE_REGION,
};
