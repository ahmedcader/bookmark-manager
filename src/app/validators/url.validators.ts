import { AbstractControl, ValidationErrors } from '@angular/forms';
import {isURL} from 'validator';

/**
 * Synchronous validator to check if the URL is valid using validator.js's isURL method.
 * @param control - The form control containing the URL.
 * @return A validation error object if invalid; otherwise, null.
 */
export function isValidURL(control: AbstractControl): ValidationErrors | null {
  if (!control.value) {
    return null;
  }
  return isURL(control.value)
    ? null
    : { invalidUrl: true };
}
