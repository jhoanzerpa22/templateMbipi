import { AbstractControl } from '@angular/forms';

export class ConfirmPasswordValidator {
  /**
   * Check matching password with confirm password
   * @param control AbstractControl
   */
  static MatchPassword(control: AbstractControl): void {
    const new_password = control.get('new_password')?.value;
    const confirm_password = control.get('confirm_password')?.value;

    if (new_password !== confirm_password) {
      control.get('confirm_password')?.setErrors({ ConfirmPassword: true });
    }
  }
}
