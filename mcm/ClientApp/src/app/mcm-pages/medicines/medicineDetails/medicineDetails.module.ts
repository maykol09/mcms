import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { DateInputsModule } from "@progress/kendo-angular-dateinputs";
import { MedicineDetailsComponent } from "./medicineDetails.component";
import { CustomDirectiveModule } from 'src/app/shared/directives/custom.directive.module';
import { InputsModule } from '@progress/kendo-angular-inputs';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    DateInputsModule,
    CustomDirectiveModule,
    InputsModule
  ],
  exports: [MedicineDetailsComponent],
  declarations: [MedicineDetailsComponent]
})

export class MedicineDetailsModule {

}
