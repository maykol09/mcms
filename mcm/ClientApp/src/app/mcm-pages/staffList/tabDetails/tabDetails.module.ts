import { NgModule } from "@angular/core";
import { TabDetailsComponent } from './tabDetails.component';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { CommonModule } from '@angular/common';
import { ConsultationModule } from '../consultation/consultation.module';
import { MedicationModule } from '../medication/medication.module';
import { MedicalModule } from '../medical/medical.module';

@NgModule({
  imports: [
    LayoutModule,
    CommonModule,
    ConsultationModule,
    MedicationModule,
    MedicalModule
  ],
  exports: [TabDetailsComponent],
  declarations: [TabDetailsComponent]
})

export class TabDetailsModule {

}
