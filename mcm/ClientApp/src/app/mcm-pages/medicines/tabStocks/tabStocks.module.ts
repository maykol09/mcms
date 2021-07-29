import { NgModule } from "@angular/core";

import { LayoutModule } from '@progress/kendo-angular-layout';
import { CommonModule } from '@angular/common';
import { ReceivedMedicineModule } from '../receivedMed/receivedMed.module';
import { IssuedMedicineModule } from '../issuedMed/issuedMed.module';
import { TabStocksComponent } from './tabStocks.component';


@NgModule({
  imports: [
    LayoutModule,
    CommonModule,
    ReceivedMedicineModule,
    IssuedMedicineModule,
  ],
  exports: [TabStocksComponent],
  declarations: [TabStocksComponent]
})

export class TabStocksModule {

}
