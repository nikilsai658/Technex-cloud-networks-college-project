import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

// Builds a validator that tests the trimmed string value against a regex.
// Empty values pass, so each field decides separately whether it is required.
function patternRule(regex: RegExp, errorKey: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (value === null || value === undefined || value === '') return null;
    return regex.test(String(value).trim()) ? null : { [errorKey]: true };
  };
}

export class AppValidators {

  /** Exactly 10 digits, starting with 6-9 (Indian mobile number). */
  static phone = patternRule(/^[6-9]\d{9}$/, 'phone');

  /** Stricter than Validators.email: requires a domain with a TLD (a@b.com). */
  static email = patternRule(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, 'email');

  /** Letters, spaces, dots, apostrophes and hyphens only. */
  static personName = patternRule(/^[A-Za-z][A-Za-z .'-]*$/, 'personName');

  /** Letters, numbers, spaces and common punctuation (for titles / entity names). */
  static title = patternRule(/^[A-Za-z0-9][A-Za-z0-9 .,&()'/:+#-]*$/, 'title');

  /** Codes: letters, numbers, underscore and hyphen, no spaces. */
  static code = patternRule(/^[A-Za-z0-9_-]+$/, 'code');

  /** Register / roll number: letters and numbers only. */
  static registerNumber = patternRule(/^[A-Za-z0-9]+$/, 'registerNumber');

  /** Whole numbers only (no decimals, no sign). */
  static integer = patternRule(/^\d+$/, 'integer');

  /** http(s) URL. */
  static url = patternRule(/^https?:\/\/[^\s]+\.[^\s]+$/, 'url');

  /** Email or plain username (letters, numbers, . _ -). */
  static usernameOrEmail = patternRule(
    /^([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}|[A-Za-z0-9._-]{3,})$/,
    'usernameOrEmail'
  );

  /** Min 8 chars with at least one uppercase, lowercase, digit and special character. */
  static strongPassword = patternRule(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
    'strongPassword'
  );

  /** Rejects values that are only whitespace. */
  static noWhitespace: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (typeof value !== 'string' || value.length === 0) return null;
    return value.trim().length === 0 ? { whitespace: true } : null;
  };

  /** Required + not blank. */
  static requiredText: ValidatorFn[] = [Validators.required, AppValidators.noWhitespace];

  /** Group validator: the two named controls must hold the same value. */
  static match(controlName: string, matchingName: string): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const a = group.get(controlName)?.value;
      const b = group.get(matchingName)?.value;
      if (!a || !b) return null;
      return a === b ? null : { passwordMismatch: true };
    };
  }

  /** Group validator: from <= to. */
  static range(fromName: string, toName: string): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const from = Number(group.get(fromName)?.value);
      const to = Number(group.get(toName)?.value);
      if (!from || !to) return null;
      return from <= to ? null : { rangeInvalid: true };
    };
  }
}

/** Human-readable message for the first error on a control. */
export function validationMessage(control: AbstractControl | null | undefined, label: string): string {
  const errors = control?.errors;
  if (!errors) return '';

  if (errors['required'] || errors['whitespace']) return `${label} is required`;
  if (errors['phone']) return `${label} must be a valid 10-digit mobile number`;
  if (errors['email']) return 'Enter a valid email address (e.g. name@example.com)';
  if (errors['personName']) return `${label} can contain only letters and spaces`;
  if (errors['title']) return `${label} contains invalid characters`;
  if (errors['code']) return `${label} can contain only letters, numbers, - and _ (no spaces)`;
  if (errors['registerNumber']) return `${label} can contain only letters and numbers`;
  if (errors['integer']) return `${label} must be a whole number`;
  if (errors['url']) return 'Enter a valid URL starting with http:// or https://';
  if (errors['usernameOrEmail']) return 'Enter a valid username or email';
  if (errors['strongPassword']) {
    return 'Password must be at least 8 characters with uppercase, lowercase, number and special character';
  }
  if (errors['minlength']) return `${label} must be at least ${errors['minlength'].requiredLength} characters`;
  if (errors['maxlength']) return `${label} cannot exceed ${errors['maxlength'].requiredLength} characters`;
  if (errors['min']) return `${label} must be at least ${errors['min'].min}`;
  if (errors['max']) return `${label} cannot be more than ${errors['max'].max}`;
  if (errors['pattern']) return `${label} is invalid`;

  return `${label} is invalid`;
}
