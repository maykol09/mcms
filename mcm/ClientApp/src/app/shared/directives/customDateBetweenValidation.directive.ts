import { Directive, forwardRef, Input } from '@angular/core';
import { NG_VALIDATORS, Validator } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { NotificationService } from '../service/notification.service';


@Directive({
  selector: '[customDateBetweenValidator][formControlName]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => CustomDateBetweenValidatorDirective),
      multi: true,

    }, NotificationService
  ],
  host: {
    '(focusout)': 'setInputFocusOut()',
  },

})
export class CustomDateBetweenValidatorDirective implements Validator {

  @Input('parameters') parameters;
  @Input('name') elemName;

  constructor(private notification: NotificationService) { }

  public setInputFocusOut(control: FormControl) {

    var from = this.parameters.from;
    var to = this.parameters.to;

    if ((from && to)) {
      if (from > to) {
        this.parameters.control.DateOfAssessmentFrom.status = "INVALID"
        this.parameters.control.DateOfAssessmentTo.status = "INVALID"
        this.notification.showError("Invalid date of assessment.")
        return {
          dateBetween: {
            error: true
          }
        }
      } else {

        this.parameters.control.DateOfAssessmentFrom.status = "VALID"
        this.parameters.control.DateOfAssessmentTo.status = "VALID"

      }
    }
    return null;
  }
  public validate(control: FormControl) {
    return null;
  }

}

