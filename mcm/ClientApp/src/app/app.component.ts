import { Component } from '@angular/core';
import { SpinnerService } from './shared/service/spinner.services';
import { DataSharedService } from './shared/service/data.service';
import { reference } from '@angular/core/src/render3';
import { Router } from '@angular/router';
import { NavMenuService } from './shared/nav-menu/nav-menu.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  loading: boolean = true;
  showRouteResult: boolean = false;
  hideNav = false;
  constructor(private spinnerService: SpinnerService,
    private dataService: DataSharedService,
    private route: Router,
    private navService: NavMenuService) {
    //this.Reference();
  }
  ngOnInit() {
    this.Spinner();
    this.HideNav();

  }
  Spinner(): void {
    this.spinnerService
      .onLoadingChanged
      .subscribe(isLoading => {
        setTimeout(() => {
          this.loading = !isLoading;
        });
      });
  }
  HideNav() {
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
  //ngAfterViewInit() {
  //  //this.CheckPermission();
  //}
  CheckPermission(url) {

    this.navService.user_level.subscribe(data => {
      
      if (data === 0) {
        this.hideNav = true;
        this.showRouteResult = true;
        this.route.navigate(['noPermission']);
      } else if(data > 1){
        this.hideNav = false;
        this.Reference(url)
        
      }
    })
  }
  Reference(url) {
    this.dataService.GetReference().subscribe(data => {
      if (data) {
        this.showRouteResult = true;
      }
      this.dataService.Reference(data);
      if (url === 'noPermission') {
        this.route.navigate(['']);
      } else {
        this.route.navigate([url]);
      }
      
    })
  }
}
