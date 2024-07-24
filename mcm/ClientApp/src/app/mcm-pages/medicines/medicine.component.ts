import { Component, HostListener, Input, ViewChild, ElementRef, AfterViewInit } from "@angular/core";
import { State, CompositeFilterDescriptor, SortDescriptor, process, orderBy } from '@progress/kendo-data-query';
import { GridDataResult, PageChangeEvent, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import * as _ from 'lodash';
import { DataSharedService } from 'src/app/shared/service/data.service';
import { MedicineService } from './medicine.service';
import { NotificationService } from 'src/app/shared/service/notification.service';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CustomConfirmDeleteModalComponent } from 'src/app/shared/modal/confirmDelete/confirmDelete.component';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';

const MODALS = {
  confirmDelete: CustomConfirmDeleteModalComponent
}

@Component({
  selector: "pages-medicine",
  styleUrls: ['./medicine.component.css'],
  templateUrl: "./medicine.component.html"
})

export class MedicineComponent {
  public state: State = {
    filter: {
      logic: 'and',
      filters: []
    }
  };
  public data: any[] = [];
  public gridData: GridDataResult;
  public filter: CompositeFilterDescriptor;
  public multiple = true;
  public allowUnsort = true;
  public showFilter = false;
  public context: string = "";
  public sort: SortDescriptor[] = [{ field: 'Created', dir: 'desc' }];
  public skip = 0;
  public pageSize = 30;

  public buttonCount = 4;
  public pageSizes = true;
  public previousNext = true;
  public mySelection: number[] = [0];
  public med_id: number;
  public offsetStyle: any;
  public medId: any;
  hideTab = true;
  currentFilter: string = "";
  constructor(private service: MedicineService,
    private dataService: DataSharedService,
    private modal: NgbModal,
    private notification: NotificationService) {
    this.loadStaff('')
    this.offset();
  }
  @ViewChild(TooltipDirective, { static: true }) public tooltipDir: TooltipDirective;
  @ViewChild('medicine', { static: false }) medicineHeight: ElementRef;
  public showTooltip(e: MouseEvent): void {
    const element = e.target as HTMLElement;
    console.log(element.nodeName);
    if ((element.nodeName === 'DIV' || element.nodeName === 'TD')
      && element.offsetWidth < element.scrollWidth) {
      this.tooltipDir.toggle(element);
    } else {
      this.tooltipDir.hide();
    }
  }
  ngAfterViewInit() {
    if (this.hideTab === true) {
      this.sendHeightToOtherTab();
    }
  }
  loadStaff(person_id) {
    this.processGridData(this.dataService.GetMedicine());
    this.loadFirstRow();

  }
  person_id() { }

  GetMedicineInfo(med_id, med_name) {
    this.medId = med_id;
  }

  DeleteMedicine(med_id) {
    var modalRef = this.modal.open(MODALS['confirmDelete'],
      {
        backdrop: 'static',
        keyboard: false,
      });
    modalRef.result.then(data => {
      if (data === 'save') {
        this.service.DeleteMedicine(med_id).subscribe(data => {
          _.remove(this.data, function (s) {
            return s.med_id === med_id;
          })
          this.dataService.getMedicine = this.data;
          this.processGridData(this.data);
          this.state.filter.filters.push({ field: 'name', operator: 'contains', value: this.currentFilter });
          this.filterChange(this.state);
          this.notification.showSuccess("Record Deleted.");
        })
      }
    })
  }
  TotalRecords() {
    return this.data.length;
  }
  addMedicine() {
    this.medId = "";
    this.mySelection = [];
  }
  fromMedicineDetails(event) {
    if (event.action === 'U') {

      _.forEach(this.data, function (d) {
        if (d.med_id === event.med_id) {
          d.is_active = event.is_active;
          d.med_name = event.med_name;
          d.med_id = event.med_id;
          return d;
        }
      })
      this.processGridData(this.data);
    } else {
      this.NewMedicineFromChild(event);
    }
    this.dataService.getMedicine = this.data;
  }
  NewMedicineFromChild(event) {
    this.med_id = event.med_id;
    this.dataService.getMedicine.push(event);
    this.data.push(event);
    this.processGridData(this.data);
    this.showFilter = true;
    this.state.filter.filters.push({ field: 'med_name', operator: 'contains', value: event.med_name });
    this.filterChange(this.state);
    this.mySelection = [0]
  }

  processGridData(data) {
    var sortData = _.sortBy(data, ['med_name']);
    this.data = sortData;
    this.gridData = process(this.data, this.state);
    this.loadPages();
  }
  offset() {
    var innerW = window.innerWidth;
    this.offsetStyle = { width: innerW - 342 + "px", };
    var innerW = window.innerWidth;
    if (innerW <= 1551) {
      this.hideTab = false;
    } else {
      this.hideTab = true;
    }
  }
  private loadPages(): void {
    this.gridData = {
      data: this.data.slice(this.skip, this.skip + this.pageSize),
      total: this.data.length
    };
  }
  loadFirstRow() {
    var firstRow = this.gridData.data[0];
    this.medId = firstRow.med_id;
    this.med_id = firstRow.med_id;
  }
  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    this.pageSize = isNaN(event.take) ? this.data.length : event.take;
    this.loadPages();
  }
  public filterChange(state): void {
    var filter = state.filter.filters.length;
    this.currentFilter = filter > 0 ? state.filter.filters["0"].value : "";
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
    this.offset();
    this.sendHeightToOtherTab();
  }
  sendHeightToOtherTab() {
    var innerW = window.innerWidth;
    if (innerW >= 1551) {
      var medicineHeight = this.medicineHeight.nativeElement.offsetHeight;
      this.dataService.changeHeightFromReceived(medicineHeight);
    }
  }
}
