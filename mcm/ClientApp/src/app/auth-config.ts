

import { LogLevel, Configuration, BrowserCacheLocation } from '@azure/msal-browser';
import { environment } from '../environments/environment';


const isIE = window.navigator.userAgent.indexOf("MSIE ") > -1 || window.navigator.userAgent.indexOf("Trident/") > -1;

export const msalConfig: Configuration = {
  auth: {
    clientId: environment.azureAd.clientId,
    authority: 'https://login.microsoftonline.com/' + environment.azureAd.tenantId,
    redirectUri: environment.redirectUri
  },
  cache: {
    cacheLocation: BrowserCacheLocation.LocalStorage, // Configures cache location. "sessionStorage" is more secure, but "localStorage" gives you SSO between tabs.
    storeAuthStateInCookie: isIE, // Set this to "true" if you are having issues on IE11 or Edge
  },
  system: {
    loggerOptions: {
      loggerCallback(logLevel: LogLevel, message: string) {
      },
      logLevel: LogLevel.Verbose,
      piiLoggingEnabled: false
    }
  }
}

export const protectedResources = {
  ConsultationApi: {
    endpoint:  environment.redirectUri + "api/Consultation/",
    scopes: ["api://" + environment.azureAd.clientId + "/ReadWrite"],
  },

  MaintenanceApi: {
    endpoint:  environment.redirectUri + "api/Maintenance/",
    scopes: ["api://" + environment.azureAd.clientId + "/ReadWrite"],
  },
  MedicalApi: {
    endpoint: environment.redirectUri + "api/Medical/",
    scopes: ["api://" + environment.azureAd.clientId + "/ReadWrite"],
  },
  MedicationApi: {
    endpoint: environment.redirectUri + "api/Medication/",
    scopes: ["api://" + environment.azureAd.clientId + "/ReadWrite"],
  },
  MedicineApi: {
    endpoint: environment.redirectUri + "api/Medicine/",
    scopes: ["api://" + environment.azureAd.clientId + "/ReadWrite"],
  },
  PersonDetailsApi: {
    endpoint: environment.redirectUri + "api/PersonDetails/",
    scopes: ["api://" + environment.azureAd.clientId + "/ReadWrite"],
  },
  ReceiptsApi: {
    endpoint: environment.redirectUri + "api/Receipts/",
    scopes: ["api://" + environment.azureAd.clientId + "/ReadWrite"],
  },
  ReferenceApi: {
    endpoint: environment.redirectUri + "api/Reference/",
    scopes: ["api://" + environment.azureAd.clientId + "/ReadWrite"],
  },
  ReportsApi: {
    endpoint: environment.redirectUri + "api/Reports/",
    scopes: ["api://" + environment.azureAd.clientId + "/ReadWrite"],
  },
  StaffListApi: {
    endpoint: environment.redirectUri + "api/StaffList/",
    scopes: ["api://" + environment.azureAd.clientId + "/ReadWrite"],
  },
}
export const loginRequest = {
  scopes: []
};
