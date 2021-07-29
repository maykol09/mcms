import { Component } from "@angular/core";
import { State, CompositeFilterDescriptor, process, SortDescriptor, orderBy } from '@progress/kendo-data-query';
import { GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';
import { UtilitiesService } from 'src/app/shared/service/utilities.service';
import * as _ from "lodash";
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-reports',
  styleUrls: ["./reports.component.css"],
  templateUrl: "./reports.component.html"
})

export class ReportsComponent {

  selectedTab: number = 0;
  tabNo: number = 1;
  constructor(private util: UtilitiesService, private activeRoute: ActivatedRoute) {
    this.tabNo = parseInt(this.activeRoute.snapshot.paramMap.get('id'));
    this.selectedTab = this.tabNo;
  }
  onTabSelect(event) { }
  
}
