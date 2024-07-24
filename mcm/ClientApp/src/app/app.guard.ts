import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

import { MsalBroadcastService, MsalGuard, MsalService } from '@azure/msal-angular';

import { Observable } from 'rxjs';
import { EventMessage, EventType, InteractionStatus } from '@azure/msal-browser';
import { filter, } from 'rxjs/operators';
import * as _ from 'lodash';
import { DataSharedService } from './shared/service/data.service';
import { NavMenuService } from './shared/nav-menu/nav-menu.service';

/*import { AppProviderService } from './shared/services/utilities/appProvider.service';*/
//import { UtilitiesService } from './shared/services/utilities/utilities.service';
//import { AppProviderService } from './shared/services/utilities/appProvider.service';




@Injectable()
export class AppGuard implements CanActivate {

  constructor(private authService: MsalService,
    private broadcastService: MsalBroadcastService,
    private activatedRoute: ActivatedRoute,
    private dataService: DataSharedService,
    private route: Router,
    private navService: NavMenuService,
    private msalGuard: MsalGuard) {
  }
  Reference(url) {
    this.dataService.GetReference().subscribe(data => {
      if (data) {
        this.dataService.GetShowRouteResult(true);
      }
      this.dataService.Reference(data);
      if (url === 'noPermission') {
        this.route.navigate(['']);
      } else {
        this.route.navigate([url]);
      }

    })
  }
  CheckPermission(url) {
    this.navService.user_level.subscribe(data => {

      if (data === 0) {
        this.dataService.GetHideNav(true);
        this.dataService.GetShowRouteResult(true);

        this.route.navigate(['noPermission']);
      } else if (data > 1) {
        this.dataService.GetHideNav(false);
        this.Reference(url);

      }
    })
  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return new Observable((resolve) => {

      let guard = this.msalGuard.canActivate(route, state).subscribe(result => {
        var account = this.authService.instance.getAllAccounts();
        var user = account === null || account.length == 0 ? null : account[0].username;
        if (user != null) {
          //this.appProviderService.isLoaded.subscribe(data => {
          //  if (!data) {
          //    this.appProviderService.load().then(result => {
          //      this.appProviderService.updateIsLoaded(true);
          //      if (result) {
          //        resolve.next(true);
          //      } else {
          //        resolve.next(false);
          //      }
          //    })
          //  } else {
          //    resolve.next(true);
          //  }
           
          //});
       
            var counter = 0;
            this.route.events.subscribe((data: object) => {
              counter++;
              if (counter === 1) {
                var url = data["url"] === undefined ? "" : data["url"];
                var currentRoute = url.split("/")[1];
                this.CheckPermission(currentRoute)
              }
            })
        }
        else {
          resolve.next(false);
        }
        guard.unsubscribe();

      });
    })

  }

}

function jwt_decode(token: string) {
  throw new Error('Function not implemented.');
}
