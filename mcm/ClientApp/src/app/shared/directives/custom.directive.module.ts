import { NgModule } from "@angular/core";
import { ResponsiveHeightDirective } from './responsive.height.directive';
import { NumberDirective } from './numbers-only.directive';
import { CustomDateBetweenValidatorDirective } from './customDateBetweenValidation.directive';


@NgModule({
  exports: [
    ResponsiveHeightDirective,
    NumberDirective,
    CustomDateBetweenValidatorDirective
  ],
  declarations: [
    ResponsiveHeightDirective,
    NumberDirective,
    CustomDateBetweenValidatorDirective
  ],
})

export class CustomDirectiveModule {}
