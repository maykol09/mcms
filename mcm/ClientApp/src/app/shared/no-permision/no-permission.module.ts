import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { NoPermissionComponent } from './no-permission.component';
const routes: Routes = [{
  path: 'noPermission',
  component: NoPermissionComponent
}];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    CommonModule,

  ],
  declarations: [NoPermissionComponent],
  bootstrap:[NoPermissionComponent]
})

export class NoPermissionModule {

}
