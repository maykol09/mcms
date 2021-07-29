import { NgModule } from "@angular/core";
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomConfirmModalComponent } from './confirm.component';
import { CustomDirectiveModule } from 'src/app/shared/directives/custom.directive.module';


@NgModule({
  imports: [
    BrowserModule,
    NgbModule,
    BrowserAnimationsModule,
    DropDownsModule,
    FormsModule,
    ReactiveFormsModule,
    CustomDirectiveModule,

  ],
  declarations: [CustomConfirmModalComponent],
  entryComponents: [CustomConfirmModalComponent]
})

export class CustomConfirmModalModule {

}
