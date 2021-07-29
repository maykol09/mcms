import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DataSharedService } from '../service/data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from "lodash";
import { UtilitiesService } from '../service/utilities.service';
import { NavMenuService } from './nav-menu.service';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements AfterViewInit {
  username: string = "";
  user: any;
  selectedItem: number;
  constructor(private route: Router, private service: NavMenuService) {
    this.initialLoad();
    //this.selectedLink()
  }

  initialLoad() {
    var sub = this.service.GetCurrentUser().subscribe(data => {
      this.user = data;
      this.username = this.user.user_name;
      this.service.UserChange(this.username);
      this.service.UserLevelChange(this.user.user_level);
    })

  }
  ngAfterViewInit() {
    var url = "";
    var currentRoute = "";
    var counter = 0;

    this.route.events.subscribe((data: object) => {
      counter++;
      if (counter === 1) {
        url = data["url"] === undefined ? "" : data["url"];
        currentRoute = url.split("/")[1];
        this.selectedItem = currentRoute === "staffList" ? 1 :
          currentRoute === "reports" ? 2 :
            currentRoute === "medicines" ? 3 :
              currentRoute === "receipts" ? 4 :
                currentRoute === "maintenance" ? 5 : 1;
      }
    })

  }
  routeLink(route) {

  }
  activeLink(route, navActive) {

    this.selectedItem = navActive;
    this.route.navigate([route]);
  }
  reportsActiveLink(route, navActive, tabNo) {
    this.selectedItem = navActive;
    this.route.navigate([route, tabNo]);
  }
  maintenanceActiveLink(route, navActive) {
    this.route.navigate([route]);

    this.selectedItem = navActive;
  }
}
