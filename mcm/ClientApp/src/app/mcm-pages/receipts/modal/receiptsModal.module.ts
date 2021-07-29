import { NgModule } from "@angular/core";
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomDirectiveModule } from 'src/app/shared/directives/custom.directive.module';
import { CommonModule } from '@angular/common';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { GridModule } from "@progress/kendo-angular-grid";
import { CustomConfirmModalModule } from 'src/app/shared/modal/confirm/confirm.module';
import { ReceiptsModalComponent } from "./receiptsModal.component";
import { ReceiptsGridModule } from "./grid/receiptsGrid.module";

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
    CustomConfirmModalModule,
    ReceiptsGridModule
  ],
  declarations: [ReceiptsModalComponent],
  entryComponents: [ReceiptsModalComponent],
  bootstrap: [ReceiptsModalComponent]
})

export class ReceiptsModalModule {

}
