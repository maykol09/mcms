import { NgModule } from "@angular/core";
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomDirectiveModule } from 'src/app/shared/directives/custom.directive.module';
import { AddConsultationComponent } from './addConsultation.component';
import { CommonModule } from '@angular/common';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { GridModule } from "@progress/kendo-angular-grid";
import { MedicationGridModule } from "./medGrid/medGrid.module";
import { CustomConfirmModalModule } from 'src/app/shared/modal/confirm/confirm.module';

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
    DateInputsModule,
    GridModule,
    MedicationGridModule,
    CustomConfirmModalModule
  ],
  declarations: [AddConsultationComponent],
  entryComponents: [AddConsultationComponent],
  bootstrap: [AddConsultationComponent]
})

export class AddConsultationModule {

}
