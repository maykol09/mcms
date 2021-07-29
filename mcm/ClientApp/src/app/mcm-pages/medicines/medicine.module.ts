
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { GridModule, ExcelModule } from '@progress/kendo-angular-grid';
import { CustomDirectiveModule } from 'src/app/shared/directives/custom.directive.module';

import { BrowserModule } from '@angular/platform-browser';
import { MedicineComponent } from './medicine.component';
import { MedicineDetailsModule } from "./medicineDetails/medicineDetails.module";
import { ReceivedMedicineModule } from './receivedMed/receivedMed.module';
import { IssuedMedicineModule } from './issuedMed/issuedMed.module';
import { CustomConfirmDeleteModalModule } from 'src/app/shared/modal/confirmDelete/confirmDelete.module';
import { TooltipModule } from "@progress/kendo-angular-tooltip";
import { TabStocksModule } from './tabStocks/tabStocks.module';

const routes: Routes = [{
  path: 'medicines',
  component: MedicineComponent
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
    MedicineDetailsModule,
    ReceivedMedicineModule,
    IssuedMedicineModule,
    CustomConfirmDeleteModalModule,
    TooltipModule,
    TabStocksModule

  ],
  declarations: [MedicineComponent]
})

export class MedicineModule {

}
