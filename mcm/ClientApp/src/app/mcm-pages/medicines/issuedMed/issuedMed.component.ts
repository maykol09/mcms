import { Component, Input, SimpleChanges, HostListener, ViewChild, ElementRef, AfterViewInit, OnDestroy, OnChanges } from "@angular/core";
import { State, CompositeFilterDescriptor, SortDescriptor, process, orderBy } from '@progress/kendo-data-query';
import { GridDataResult, PageChangeEvent, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import * as _ from 'lodash';
import { UtilitiesService } from 'src/app/shared/service/utilities.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { NotificationService } from 'src/app/shared/service/notification.service';
import { CustomConfirmDeleteModalComponent } from 'src/app/shared/modal/confirmDelete/confirmDelete.component';
import { DataSharedService } from 'src/app/shared/service/data.service';
import { IssuedMedicineService } from './issuedMed.service';


const MODALS = {
  confirm: CustomConfirmDeleteModalComponent
}

@Component({
  selector: 'medicine-issued',
  templateUrl: './issuedMed.component.html',
  styleUrls: ['../medicine.component.css']
})

export class IssuedMedicineComponent implements OnChanges, AfterViewInit {
  public state: State = {
    filter: {
      logic: 'and',
      filters: []
    }
  };
  public mySelection: number[] = [];
  public data: any[] = [];
  public gridData: GridDataResult = process(this.data, this.state);
  public filter: CompositeFilterDescriptor;
  public multiple = true;
  public allowUnsort = true;
  public showFilter = false;
  public context: string = "";
  public sort: SortDescriptor[] = [{ field: 'Created', dir: 'desc' }];
  public skip = 0;
  public pageSize = 20;
  selectedConsult = [];
  styleHeight: any = {};
  heightSub: any;
  @Input() med_id: any;


  constructor(private util: UtilitiesService,
    private service: IssuedMedicineService,
    private _modal: NgbModal,
    private notification: NotificationService,
    private dataService: DataSharedService) {

  }
  ngAfterViewInit() {

    this.heightSub = this.dataService.heightFromReceived.subscribe(data => {
      if (data !== "") {
        this.styleHeight = { height: ((parseInt(data) - 42.5)).toString() + "px" };
      }
    })
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.med_id.currentValue !== undefined) {
      if (changes.med_id.currentValue === "") {
        this.gridData.data = [];
        this.data = [];
      } else {
        this.GetIssuedMed(changes.med_id.currentValue);
      }
    }
  }
  TotalRecords() {
    return this.gridData.data.length;
  }
  medication_id() {

  }
  TotalQuantity() {
    return _.sumBy(this.gridData.data, 'quantity');
  }
  GetIssuedMed(med_id) {
    var sub = this.service.GetIssuedMed(med_id).subscribe(data => {
      this.processGridData(data, "onload");
      this.loadPages();
      var dateYear = new Date().getFullYear();
      this.state.filter.filters.push({ field: 'date_consulted', operator: 'contains', value: dateYear.toString() });
      this.filterChange(this.state);
      this.showFilter = true;
      sub.unsubscribe();
    })
  }
  processGridData(data, call) {
    var util = this.util;
    if (call === "onload") {
      var sortData = _.sortBy(data, ['date_consulted']).reverse();

      _.forEach(sortData, function (s) {
        s.date_consulted = util.FormatDate(s.date_consulted);
      })
      this.data = sortData;
    } else {
      _.forEach(data, function (s) {
        s.date_consulted = util.FormatDate(new Date(s.date_consulted));
      })

      this.data = data;
    }
    this.mySelection = [];
    this.gridData = process(this.data, this.state);
  }

  private loadPages(): void {
    this.gridData = {
      //data: this.data.slice(this.skip, this.skip + this.pageSize),
      data: this.data.slice(),
      total: this.data.length
    };
  }
  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    this.pageSize = isNaN(event.take) ? this.data.length : event.take;
    //this.loadPages();
    this.gridData = process(this.data, this.state);
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
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.responsiveHeight();
  }
  responsiveHeight() {
    //var height = window.innerHeight - this.gridHeight.nativeElement.offsetHeight;
    //this.gridHeight.nativeElement.setAttribute('style', "height:" + height + "px");
  }
}
