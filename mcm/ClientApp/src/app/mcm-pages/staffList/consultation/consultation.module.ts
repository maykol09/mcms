import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { GridModule, ExcelModule } from '@progress/kendo-angular-grid';
import { CustomDirectiveModule } from 'src/app/shared/directives/custom.directive.module';
import { ConsultationComponent } from './consultation.component';
import { AddConsultationModule } from './modal/addConsultation.module';
import { CustomConfirmDeleteModalModule } from 'src/app/shared/modal/confirmDelete/confirmDelete.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    LayoutModule,
    GridModule,
    CustomDirectiveModule,
    AddConsultationModule,
    CustomConfirmDeleteModalModule
  ],
  exports: [ConsultationComponent],
  declarations: [ConsultationComponent],
})

export class ConsultationModule {

}
