import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { DateInputsModule } from "@progress/kendo-angular-dateinputs";
import { PersonDetailsComponent } from "./personDetails.component";
import { CustomDirectiveModule } from 'src/app/shared/directives/custom.directive.module';
import { LayoutModule } from "@progress/kendo-angular-layout";
import { DropDownsModule } from "@progress/kendo-angular-dropdowns";

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    DateInputsModule,
    CustomDirectiveModule,
    DropDownsModule
  ],
  exports: [PersonDetailsComponent],
  declarations: [PersonDetailsComponent]
})

export class PersonDetailsModule {

}
