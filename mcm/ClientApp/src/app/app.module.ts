import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { StaffListComponent } from './mcm-pages/staffList/staffList.component';
import { StaffListModule } from './mcm-pages/staffList/staffList.module';
import { NavMenuModule } from './shared/nav-menu/nav-menu.module';
import { FooterModule } from './shared/footer/footer.module';
import { ToastrModule } from 'ngx-toastr';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SpinnerService } from './shared/service/spinner.services';
import { HttpSpinnerInterceptor } from './shared/interceptor/http.spinner.interceptor';
import { MedicineModule } from './mcm-pages/medicines/medicine.module';
import { ReportsModule } from './mcm-pages/reports/reports.module';
import { ReceiptsModule } from './mcm-pages/receipts/receipts.module';
import { MaintenanceModule } from './mcm-pages/maintenance/maintenance.module';
import { NoPermissionModule } from './shared/no-permision/no-permission.module';
import { RequestOptions } from '@angular/http';
import { CustomRequestOptions } from './shared/service/CustomRequestOptions';

@NgModule({
  declarations: [
    AppComponent,
   
  ],
  imports: [
    BrowserModule,
    ToastrModule.forRoot(),
    NgbModule.forRoot(),
    HttpClientModule,
    FormsModule,
    
    NavMenuModule,
    FooterModule,
    RouterModule.forRoot([
     { path: '', component: StaffListComponent, pathMatch: 'full' },
     { path: 'staffList', component: StaffListComponent },
    ]),
    StaffListModule,
    MedicineModule,
    ReportsModule,
    ReceiptsModule,
    MaintenanceModule,
    NoPermissionModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: CustomRequestOptions, multi: true },
    SpinnerService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpSpinnerInterceptor,
      multi: true,
      deps: [SpinnerService]
    },
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
