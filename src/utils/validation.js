/**
 * Validation Utilities
 * Input validation for forms and user data
 */

/**
 * Validate email address
 */
export function validateEmail(email) {
  if (!email) {
    return { valid: false, error: 'Email is required' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Invalid email format' };
  }

  return { valid: true };
}

/**
 * Validate password strength
 */
export function validatePassword(password) {
  if (!password) {
    return { valid: false, error: 'Password is required' };
  }

  if (password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters' };
  }

  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: 'Password must contain an uppercase letter' };
  }

  if (!/[a-z]/.test(password)) {
    return { valid: false, error: 'Password must contain a lowercase letter' };
  }

  if (!/[0-9]/.test(password)) {
    return { valid: false, error: 'Password must contain a number' };
  }

  return { valid: true };
}

/**
 * Validate username
 */
export function validateUsername(username) {
  if (!username) {
    return { valid: false, error: 'Username is required' };
  }

  if (username.length < 3) {
    return { valid: false, error: 'Username must be at least 3 characters' };
  }

  if (username.length > 20) {
    return { valid: false, error: 'Username must be less than 20 characters' };
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return { valid: false, error: 'Username can only contain letters, numbers, and underscores' };
  }

  return { valid: true };
}

/**
 * Validate required field
 */
export function validateRequired(value, fieldName = 'This field') {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return { valid: false, error: `${fieldName} is required` };
  }

  return { valid: true };
}

/**
 * Validate minimum length
 */
export function validateMinLength(value, minLength, fieldName = 'This field') {
  if (!value || value.length < minLength) {
    return {
      valid: false,
      error: `${fieldName} must be at least ${minLength} characters`,
    };
  }

  return { valid: true };
}

/**
 * Validate maximum length
 */
export function validateMaxLength(value, maxLength, fieldName = 'This field') {
  if (value && value.length > maxLength) {
    return {
      valid: false,
      error: `${fieldName} must be less than ${maxLength} characters`,
    };
  }

  return { valid: true };
}

/**
 * Validate numeric value
 */
export function validateNumeric(value, fieldName = 'This field') {
  if (isNaN(Number(value))) {
    return { valid: false, error: `${fieldName} must be a number` };
  }

  return { valid: true };
}

/**
 * Validate range
 */
export function validateRange(value, min, max, fieldName = 'This field') {
  const num = Number(value);

  if (isNaN(num)) {
    return { valid: false, error: `${fieldName} must be a number` };
  }

  if (num < min || num > max) {
    return {
      valid: false,
      error: `${fieldName} must be between ${min} and ${max}`,
    };
  }

  return { valid: true };
}

/**
 * Validate form with multiple fields
 */
export function validateForm(fields) {
  const errors = {};
  let isValid = true;

  Object.entries(fields).forEach(([fieldName, { value, validators }]) => {
    for (const validator of validators) {
      const result = validator(value);
      if (!result.valid) {
        errors[fieldName] = result.error;
        isValid = false;
        break;
      }
    }
  });

  return { valid: isValid, errors };
}

export default {
  validateEmail,
  validatePassword,
  validateUsername,
  validateRequired,
  validateMinLength,
  validateMaxLength,
  validateNumeric,
  validateRange,
  validateForm,
};
