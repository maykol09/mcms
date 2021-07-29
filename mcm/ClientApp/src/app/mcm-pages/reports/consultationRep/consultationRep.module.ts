import { NgModule } from "@angular/core";
import { GridModule, ExcelModule } from "@progress/kendo-angular-grid";
import { DropDownsModule } from "@progress/kendo-angular-dropdowns";
import { CustomConfirmDeleteModalModule } from 'src/app/shared/modal/confirmDelete/confirmDelete.module';
import { ConsultationRepComponent } from "./consultationRep.component";
import { CustomDirectiveModule } from 'src/app/shared/directives/custom.directive.module';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@NgModule({
  imports: [
    GridModule,
    ExcelModule,
    DropDownsModule,
    CustomConfirmDeleteModalModule,
    CustomDirectiveModule,
    DateInputsModule,
    CommonModule,
    FormsModule
  ],
  declarations: [ConsultationRepComponent],
  exports: [ConsultationRepComponent]
})

export class ConsultationRepModule {

}
