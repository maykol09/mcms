import { NgModule } from "@angular/core";
import { GridModule } from '@progress/kendo-angular-grid';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { UserComponent } from './user/user.component';
import { Routes, RouterModule } from '@angular/router';
import { ReferenceComponent } from './reference/reference.component';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { CustomDirectiveModule } from 'src/app/shared/directives/custom.directive.module';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { AppGuard } from "../../app.guard";

const routes: Routes = [
  {
    path: 'maintenance/user',
    component: UserComponent,
    canActivate: [AppGuard]
  }, {
    path: 'maintenance/reference',
    component: ReferenceComponent,
    canActivate: [AppGuard]
  }]

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    GridModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    LayoutModule,
    DateInputsModule,
    CustomDirectiveModule,
    DropDownsModule
  ],
  declarations: [
    UserComponent,
    ReferenceComponent
  ],
  bootstrap: [UserComponent, ReferenceComponent]
})

export class MaintenanceModule {

}
