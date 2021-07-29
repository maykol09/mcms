import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { GridModule, ExcelModule } from '@progress/kendo-angular-grid';
import { CustomDirectiveModule } from 'src/app/shared/directives/custom.directive.module';
import { ReceivedMedicineComponent } from './receivedMed.component';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    LayoutModule,
    GridModule,
    CustomDirectiveModule,
    
  ],
  exports: [ReceivedMedicineComponent],
  declarations: [ReceivedMedicineComponent],
})

export class ReceivedMedicineModule {

}
