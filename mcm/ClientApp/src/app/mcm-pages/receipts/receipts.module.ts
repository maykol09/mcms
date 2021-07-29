import { NgModule } from "@angular/core";
import { GridModule, ExcelModule } from "@progress/kendo-angular-grid";
import { DropDownsModule } from "@progress/kendo-angular-dropdowns";
import { CustomConfirmDeleteModalModule } from 'src/app/shared/modal/confirmDelete/confirmDelete.module';
import { ReceiptsComponent } from "./receipts.component";
import { CustomDirectiveModule } from 'src/app/shared/directives/custom.directive.module';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { ReceiptsModalModule } from "./modal/receiptsModal.module";

const routes: Routes = [{
  path: "receipts",
  component: ReceiptsComponent
}]

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    GridModule,
    ExcelModule,
    DropDownsModule,
    CustomConfirmDeleteModalModule,
    CustomDirectiveModule,
    DateInputsModule,
    CommonModule,
    FormsModule,
    ReceiptsModalModule
  ],
  declarations: [ReceiptsComponent],
  exports: [ReceiptsComponent]
})

export class ReceiptsModule {

}
