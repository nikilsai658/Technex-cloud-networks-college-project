import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { validationMessage } from './app-validators';

/**
 * Usage: {{ form.get('phoneNumber') | fieldError:'Phone number' }}
 * Impure so it re-evaluates when the control's errors change.
 */
@Pipe({ name: 'fieldError', standalone: true, pure: false })
export class FieldErrorPipe implements PipeTransform {
  transform(control: AbstractControl | null | undefined, label: string): string {
    return validationMessage(control, label);
  }
}
