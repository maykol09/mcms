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
import { InteractionType, IPublicClientApplication, PublicClientApplication } from '@azure/msal-browser';
import { loginRequest, msalConfig, protectedResources } from './auth-config';
import { MsalBroadcastService, MsalGuard, MsalGuardConfiguration, MsalInterceptor, MsalInterceptorConfiguration, MsalService, MSAL_GUARD_CONFIG, MSAL_INSTANCE, MSAL_INTERCEPTOR_CONFIG } from '@azure/msal-angular';
import { AppGuard } from './app.guard';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';

export function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication(msalConfig);
}

export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
  const protectedResourceMap: Map<string, Array<string>> = new Map([
    [
      protectedResources.ConsultationApi.endpoint, protectedResources.ConsultationApi.scopes
    ],
    [
      protectedResources.MaintenanceApi.endpoint, protectedResources.MaintenanceApi.scopes
    ],
    [
      protectedResources.MedicalApi.endpoint, protectedResources.MedicalApi.scopes
    ],
    [
      protectedResources.MedicationApi.endpoint, protectedResources.MedicationApi.scopes
    ],
    [
      protectedResources.MedicineApi.endpoint, protectedResources.MedicineApi.scopes
    ],
    [
      protectedResources.PersonDetailsApi.endpoint, protectedResources.PersonDetailsApi.scopes
    ],
    [
      protectedResources.ReceiptsApi.endpoint, protectedResources.ReceiptsApi.scopes
    ],
    [
      protectedResources.ReferenceApi.endpoint, protectedResources.ReferenceApi.scopes
    ],
    [
      protectedResources.ReportsApi.endpoint, protectedResources.ReportsApi.scopes
    ],
    [
      protectedResources.StaffListApi.endpoint, protectedResources.StaffListApi.scopes
    ]


  ]);
  return {
    interactionType: InteractionType.Redirect,
    protectedResourceMap
  };
}
export function MSALGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect,
    authRequest: loginRequest
  };
}

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
    }, {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    }, {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory
    }, {
      provide: MSAL_GUARD_CONFIG,
      useFactory: MSALGuardConfigFactory
    }, {
      provide: MSAL_INTERCEPTOR_CONFIG,
      useFactory: MSALInterceptorConfigFactory
    },
    MsalService,
    MsalGuard,
    MsalBroadcastService,
    AppGuard,

    { provide: LocationStrategy, useClass: PathLocationStrategy },
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
