
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { StaffListComponent } from "./staffList.component";
import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { GridModule, ExcelModule } from '@progress/kendo-angular-grid';
import { CustomDirectiveModule } from 'src/app/shared/directives/custom.directive.module';
import { PersonDetailsModule } from "./personDetails/personDetails.module";
import { TabDetailsModule } from './tabDetails/tabDetails.module';
import { ConsultationModule } from './consultation/consultation.module';
import { BrowserModule } from '@angular/platform-browser';
import { MedicalModule } from './medical/medical.module';
import { MedicationModule } from './medication/medication.module';
import { CustomConfirmDeleteModalModule } from 'src/app/shared/modal/confirmDelete/confirmDelete.module';
import { AppGuard } from "../../app.guard";

const routes: Routes = [{
  path: 'staffList',
  component: StaffListComponent,
  canActivate: [AppGuard]
}]

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    BrowserModule,
    LayoutModule,
    GridModule,
    CustomDirectiveModule,
    PersonDetailsModule,
    TabDetailsModule,
    ConsultationModule,
    MedicationModule,
    MedicalModule,
    CustomConfirmDeleteModalModule

  ],
  declarations: [StaffListComponent]
})

export class StaffListModule {

}
