import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Pipe({
  name: 'controlError',
  pure: false
})
export class ControlErrorPipe implements PipeTransform {

  transform(control: AbstractControl, defaultMessage = ''): string {
    if (control.errors) {
      if (control.errors['required']) {
        return 'This field is mandatory';
      } else if ((control.errors['email'])) {
        return 'Email is not in correct format';
      } else if ((control.errors['pattern'])) {
        return 'Only positive numbers are allowed';
      } else if ((control.errors['matTimepickerParse'])) {
        return 'Input value is not valid';
      } else if ((control.errors['minlength'])) {
        return 'Input value must be at least 3 characters';
      }
    }
    return defaultMessage;
  }

}