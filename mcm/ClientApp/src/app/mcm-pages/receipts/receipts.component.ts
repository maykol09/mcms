import { Component } from "@angular/core";
import { State, CompositeFilterDescriptor, process, SortDescriptor, orderBy } from '@progress/kendo-data-query';
import { GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';
import * as _ from 'lodash';
import { UtilitiesService } from 'src/app/shared/service/utilities.service';
import { DataSharedService } from 'src/app/shared/service/data.service';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { ReceiptsService } from './receipts.service';
import { ReceiptsModalComponent } from "./modal/receiptsModal.component";
import { NgbModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import { CustomConfirmDeleteModalComponent } from 'src/app/shared/modal/confirmDelete/confirmDelete.component';
import { NotificationService } from 'src/app/shared/service/notification.service';

const MODALS = {
  receiptsModal: ReceiptsModalComponent,
  confirmDelModal: CustomConfirmDeleteModalComponent
}

@Component({
  selector: 'reports-receipts',
  styleUrls: ['./receipts.component.css'],
  templateUrl: './receipts.component.html'
})

export class ReceiptsComponent {
  public state: State = {
    filter: {
      logic: 'and',
      filters: []
    }
  };
  public mySelection: number[] = [];
  public data: any[] = [];
  public _data: any;
  public data_unchanged: any[] = [];
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
  constructor(private util: UtilitiesService,
    private service: ReceiptsService,
    private dataService: DataSharedService,
    private _modal: NgbModal, 
    private notification: NotificationService) {
    this.SetDate();
    
  }

  SetDate() {
    var yearNow = new Date().getFullYear()
    var dateFrom = new Date("1/1/2019");
    var dateTo = new Date("12/31/" + yearNow);
    this.from = dateFrom;
    this.to = dateTo;
    this.GetReceipts()
  }
  DeleteSelected(si_id) {
    var modalRef = this._modal.open(MODALS['confirmDelModal'],
      {
        backdrop: 'static',
        keyboard: false,
        size: 'lg',
      });
    modalRef.result.then(data => {
      if (data === 'save') {
        this.service.DeleteReceipts(si_id).subscribe(data => {
          _.remove(this.data, { 'si_id': si_id })
          _.remove(this.data_unchanged, { 'si_id': si_id })
          this.processGridData(this.data_unchanged);
          this.notification.showSuccess('Record deleted successfully.');
        })
      }
    })
  }
  AddReceipts(si_id, action) {

    var modalRef = this._modal.open(MODALS['receiptsModal'],
      {
        backdrop: 'static',
        keyboard: false,
        size: 'lg',

      });
    var filterData = _.filter(this.data_unchanged, {'si_id': si_id})
    
    if (si_id === 0) {
      var maxSI_NO = _.maxBy(this.data, 'stock_in_no');
      filterData = {
        si_id: 0,
        stock_in_no: this.GenerateStockInNo(maxSI_NO.stock_in_no),
        status: 'Draft',
        action: action
      }

      modalRef.componentInstance.info = filterData;
    } else {
      filterData[0].action = action;
      modalRef.componentInstance.info = filterData[0];
    }
    modalRef.result.then(data => {
      if (data !== "cancel") {
        var newData = _.cloneDeep(this.data_unchanged);
        if (data.action === 'I') {
          newData.push(data);
          this.data_unchanged.push(data);
          //this.data.push(data);
        } else {
          //for IE begin
          var convert = this.convertDate;
          _.forEach(newData, function (d) {
            if (d.si_id === data.si_id) {
              d.date_received = convert(data.date_received);
              //d.stock_in_no = data.stock_in_no;
              d.invoice_no = data.invoice_no;
              //d.supplier = data.supplier;
              //d.status = data.status;
              d.remarks = data.remarks;
              return;
            }
          })
          _.forEach(this.data_unchanged, function (d) {
            if (d.si_id === data.si_id) {
              d.date_received = convert(data.date_received);
              //d.stock_in_no = data.stock_in_no;
              d.invoice_no = data.invoice_no;
              //d.supplier = data.supplier;
              //d.status = data.status;
              d.remarks = data.remarks;
              return;
            }
          })
          //end 
          //_.forEach(this.data, function (d) {
          //  if (d.si_id === data.si_id) {
          //    d.date_received = data.date_received;
          //    d.stock_in_no = data.stock_in_no;
          //    d.invoice_no = data.invoice_no;
          //    d.supplier = data.supplier;
          //    d.status = data.status;
          //    d.remarks = data.remarks;
          //    return;
          //  }
          //})
         
        }
        this.processGridData(newData);
      }
    })
  }
  convertDate(datestr) {
    var newDate = new Date(datestr);
    var day = newDate.getDate();
    var month = newDate.getMonth() + 1;
    var year = newDate.getFullYear();

    var newdate = year + "-" + ("00" + month).slice(-2) + "-" + ("00" + day).slice(-2);
    console.log(newDate);
    return newdate;
  }
  GenerateStockInNo(no: number) {
    var currentNo = no.toString().substring(0, 4);
    var CurrentNoInt = parseInt(currentNo);
    var yearNow = new Date().getFullYear();
    if (CurrentNoInt === yearNow) {
      return no + 1;
    } else {
      var newCurrentNo = yearNow.toString() + ('0000' + 1).slice(-4);
      return parseInt(newCurrentNo);
    }
  }
  onSelectedKeysChange(event) {

  }
  isDraft(status) {
    return status === 'Draft' ? true : false;
  }
  GetReceipts() {
    var newFrom = this.util.FormatDate(this.from);
    var newTo = this.util.FormatDate(this.to);
    var sub = this.service.GetReceipts(newFrom, newTo).subscribe(data => {

      this.data_unchanged = _.cloneDeep(data);
      this.processGridData(data);
     
      this.loadPages();
      this.showFilter = true;
      sub.unsubscribe();
    })
  }
  processGridData(data) {
    var util = this.util;
    var sorData = _.sortBy(data, ['stock_in_no', 'date_received']);
    _.forEach(sorData, function (s) {
      s.date_received = util.FormatDate(new Date(s.date_received));
    })
    this.data = data;
    this.mySelection = [];
    this.gridData = process(this.data, this.state);
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
