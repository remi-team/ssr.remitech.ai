/**
 * Form validation utilities — migrated from the legacy Vue `checkPassword`
 * helper. Pure functions so they're trivially reusable across PC + mobile
 * modal variants and unit-testable.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** 8–20 chars with at least one uppercase, one lowercase and one digit. */
export function checkPassword(password: string): boolean {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,20}$/.test(password);
}

export function validateEmail(email: string): string {
  if (!email) return "Email is required";
  if (!EMAIL_RE.test(email)) return "Please enter a valid email address";
  return "";
}

export function validatePassword(password: string): string {
  if (!password) return "Password is required";
  if (!checkPassword(password)) {
    return "Password must be 8-20 characters, including uppercase, lowercase letters and numbers";
  }
  return "";
}

export function validateRepeatPassword(
  repeatPassword: string,
  password: string
): string {
  if (!repeatPassword) return "Please confirm your password";
  if (repeatPassword !== password) return "Passwords do not match";
  return "";
}

export function validateRequired(value: string, fieldName: string): string {
  if (!value || value.trim() === "") return `${fieldName} is required`;
  return "";
}
