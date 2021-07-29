import { NgModule } from "@angular/core";
import { BrowserModule } from '@angular/platform-browser';
import { GridModule, ExcelModule } from '@progress/kendo-angular-grid';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { Routes, RouterModule } from '@angular/router';
import { ReportsComponent } from './reports.component';
import { CustomDirectiveModule } from 'src/app/shared/directives/custom.directive.module';
import { LayoutModule } from "@progress/kendo-angular-layout";
import { ConsultationRepModule } from "./consultationRep/consultationRep.module";
import { MedicationRepModule } from './medicationRep/medicationRep.module';
import { MedicineRepModule } from "./medicineRep/medicineRep.module";

const routes: Routes = [{
  path: "reports/:id",
  component: ReportsComponent
}]

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    GridModule,
    ExcelModule,
    DropDownsModule,
    CustomDirectiveModule,
    LayoutModule,
    ConsultationRepModule,
    MedicationRepModule,
    MedicineRepModule
  ],
  declarations: [ReportsComponent],
  bootstrap: [ReportsComponent]
})

export class ReportsModule {

}
