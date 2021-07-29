import { NgModule } from "@angular/core";
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomDirectiveModule } from 'src/app/shared/directives/custom.directive.module';
import { AddMedicationComponent } from './addMedication.component';
import { CommonModule } from '@angular/common';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';

@NgModule({
  imports: [
    BrowserModule,
    NgbModule,
    BrowserAnimationsModule,
    DropDownsModule,
    FormsModule,
    ReactiveFormsModule,
    CustomDirectiveModule,
    CommonModule,
    DateInputsModule

  ],
  declarations: [AddMedicationComponent],
  entryComponents: [AddMedicationComponent]
})

export class AddMedicationModule {

}
