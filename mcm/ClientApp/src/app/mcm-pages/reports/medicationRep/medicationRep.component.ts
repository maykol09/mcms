import { Component } from "@angular/core";
import { State, CompositeFilterDescriptor, process, SortDescriptor, orderBy } from '@progress/kendo-data-query';
import { GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';
import * as _ from 'lodash';
import { UtilitiesService } from 'src/app/shared/service/utilities.service';
import { ReportsService } from '../reports.service';
import { DataSharedService } from 'src/app/shared/service/data.service';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';

@Component({
  selector: 'reports-medication',
  styleUrls: ['../reports.component.css'],
  templateUrl: './medicationRep.component.html'
})

export class MedicationRepComponent {
  public state: State = {
    filter: {
      logic: 'and',
      filters: []
    }
  };
  public mySelection: number[] = [];
  public data: any[] = [];
  public data_unchanged: any;
  public gridData: GridDataResult = process(this.data, this.state);
  public filter: CompositeFilterDescriptor;
  public multiple = true;
  public allowUnsort = true;
  public showFilter = false;
  public context: string = "";
  public sort: SortDescriptor[] = [{ field: 'Created', dir: 'desc' }];
  public skip = 0;
  public pageSize = 20;

  from: Date;
  to: Date;
  status = 1;
  constructor(private util: UtilitiesService, private service: ReportsService, private dataService: DataSharedService, ) {
    this.SetDate();
    this.allData = this.allData.bind(this);
  }
  SetDate() {
    var yearNow = new Date().getFullYear()
    var dateFrom = new Date("1/1/" + yearNow);
    var dateTo = new Date("12/31/" + yearNow);
    this.from = dateFrom;
    this.to = dateTo;
    
    this.GetMedicationReports()
  }
  onButtonGroupClick($event) {
    let clickedElement = $event.target || $event.srcElement;
    if (clickedElement.nodeName === "LABEL") {
      let isCertainButtonAlreadyActive = clickedElement.parentElement.querySelector(".active");
      // if a Button already has Class: .active
      if (isCertainButtonAlreadyActive) {
        isCertainButtonAlreadyActive.classList.remove("active");
      }
      clickedElement.className += " active";
    }

  }
  FilterByStatus(data, _status) {
    var newStatus = parseInt(_status);
    if (newStatus !== 2) {
      var status = _.filter(data, { 'is_active': newStatus });
      this.processGridData(status, "");
      this.data = status;
    } else {
      this.processGridData(data, "");
      this.data = this.data_unchanged;
    }
    this.loadPages();
  }
  GetMedicationReports() {

    var newFrom = this.util.FormatDate(this.from);
    var newTo = this.util.FormatDate(this.to);
    var sub = this.service.GetMedicationReports(newFrom, newTo).subscribe(data => {
      this.data_unchanged = data;
      this.FilterByStatus(data, this.status);
      //this.processGridData(data, "onload");
     
     
      this.showFilter = true;
      sub.unsubscribe();
    })
  }
  processGridData(data, call) {
    var util = this.util;
    _.forEach(data, function (s) {
      s.date_given = util.FormatDate(new Date(s.date_given));
    })

    this.mySelection = [];
    this.gridData = process(data, this.state);
  }

  private loadPages(): void {
    this.gridData = {
      data: this.data.slice(this.skip, this.skip + this.pageSize),
      total: this.data.length
    };
  }
  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    this.pageSize = isNaN(event.take) ? this.data.length : event.take;
    this.gridData = process(this.data, this.state);
    //this.loadPages();
  }
  public filterChange(state): void {
    this.state = state;
    this.gridData = process(this.data, this.state);
  }

  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.gridData = {
      data: orderBy(this.data, this.sort),
      total: this.data.length
    };
  }

  public showHideFilter() {
    this.showFilter = this.showFilter ? false : true;
  }
  public allData(): ExcelExportData {
    this.state.take = this.gridData.total;
    var withFilterdata = process(this.data, this.state);
    const result: ExcelExportData = {
      data: process(withFilterdata.data, { sort: [{ field: 'date_consulted', dir: 'desc' }] }).data,
    };
    this.state.take = this.pageSize;
    return result;
  }
}
