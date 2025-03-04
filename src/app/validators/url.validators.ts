import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable, of, timer } from 'rxjs';
import { catchError, switchMap, map } from 'rxjs/operators';
import isURL from 'validator/lib/isURL';

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
