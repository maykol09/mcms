import { Component, HostListener, Input, ViewChild, ElementRef, AfterViewInit } from "@angular/core";
import { State, CompositeFilterDescriptor, SortDescriptor, process, orderBy } from '@progress/kendo-data-query';
import { GridDataResult, PageChangeEvent, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { StaffListService } from './staffList.service';
import * as _ from 'lodash';
import { DataSharedService } from 'src/app/shared/service/data.service';
import { CustomConfirmDeleteModalComponent } from 'src/app/shared/modal/confirmDelete/confirmDelete.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from 'src/app/shared/service/notification.service';

const MODALS = {
  confirmDelete: CustomConfirmDeleteModalComponent
}

@Component({
  selector: 'staffList-page',
  templateUrl: './staffList.component.html',
  styleUrls: ['./staffList.component.css']
})

export class StaffListComponent implements AfterViewInit {
  public state: State = {
    filter: {
      logic: 'and',
      filters: []
    }
  };
  public data: any[] = [];
  public staffList: GridDataResult;
  public filter: CompositeFilterDescriptor;
  public multiple = true;
  public allowUnsort = true;
  public showFilter = false;
  public context: string = "";
  public sort: SortDescriptor[] = [{ field: 'Created', dir: 'desc' }];
  public skip = 0;
  public pageSize = 50;

  public buttonCount = 3;
  public pageSizes = true;
  public previousNext = true;
  public mySelection: number[] = [0];

  offsetStyle: any;
  offsetCover: any;
  hidePic = false;
  hideTab = true;
  consultation = false;
  medication = true;
  medical = true;
  selectedItem = 1;
  personId: any;
  name: string;
  currentFilter: string = "";
  medicationHid = true;
  medicalHid = true;
  consultationHid = false;

  @ViewChild('img') img: ElementRef;
  @ViewChild('consult') consultHeight: ElementRef;


  constructor(private staffService: StaffListService,
    private dataService: DataSharedService,
    private modal: NgbModal,
    private notification: NotificationService) {
    this.offset();
    this.loadStaff('')

  }
  ngAfterViewInit() {
    if (this.hideTab === true) {
      this.sendHeightToOtherTab();
    }
  }
  DeleteStaff(person_id) {
    var modalRef = this.modal.open(MODALS['confirmDelete'],
      {
        backdrop: 'static',
        keyboard: false,
      });
    modalRef.result.then(data => {
      if (data === 'save') {
        this.staffService.DeleteStaff(person_id).subscribe(data => {
          _.remove(this.data, function (s) {
            return s.person_id === person_id;
          })
          this.personId = { person_id: 0, sis_person_id: 0 };
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
  fromPersonDetailsNewStaff(event) {
    this.name = event.last_name + ', ' + event.first_name;
    this.imageView(event.sis_person_id);
  }
  fromPersonDetails(event) {
    this.skip = 0;
    this.personId = event;
    this.data.push(event);
    this.processGridData(this.data);
    this.showFilter = true;
    this.state.filter.filters.push({ field: 'name', operator: 'contains', value: event.name });
    this.loadPages();
    this.filterChange(this.state);
    this.mySelection = [0]
    this.name = event.name;
  }
  loadStaff(person_id) {
    this.staffService.GetStaffList(person_id).subscribe(data => {
      this.processGridData(data);
      this.loadFirstRow();
    });
  }
  processGridData(data) {
    var sortData = _.sortBy(data, ['name']);
    this.data = sortData;
    this.staffList = process(this.data, this.state);
    this.loadPages();


  }
  addStaff() {
    this.personId = { person_id: 0, sis_person_id: 0 };
    this.mySelection = [];
    this.name = "New Staff";
    this.imageView(100000);
  }

  loadFirstRow() {
    var firstRow = this.staffList.data[0];
    this.personId = { person_id: firstRow.person_id, sis_person_id: firstRow.sis_person_id };
    var fullName = firstRow.name.split(',');
    this.name = fullName[1] + " " + fullName[0];
  }

  imageView(person_id) {
    var newPersonId = person_id === 0 || person_id === null? '1000000' : ('0000000' + person_id.toString()).toString().slice(-7); 
    this.img.nativeElement.setAttribute('src', "https://apps.wpro.who.int/docs/sis/" + newPersonId + ".jpg?ts=" + Math.floor(Math.random() * 10000000));
  }
  GetStaffInfo(person_id, name, sis_person_id) {
    var fullName = name.split(',');
    this.name = fullName[1] + " " + fullName[0];
    this.hidePic ? "" : this.imageView(sis_person_id);
    this.personId = { person_id: person_id, sis_person_id: sis_person_id };
  }
  offset() {
    var innerW = window.innerWidth;
    if (innerW <= 1551) {
      this.hideTab = false;
      this.hidePic = true;
      this.offsetStyle = { width: innerW - 342 + "px", };
    } else {
      this.hideTab = true;
      this.hidePic = false;
      this.offsetStyle = { width: innerW - 577 + "px", };
    }
  }
  activeLink(event, newValue) {
    if (newValue === 1) {
      this.medicationHid = true;
      this.medicalHid = true;
      this.consultationHid = false;
    } else if (newValue === 2) {
      this.consultationHid = true;
      this.medicalHid = true;
      this.medicationHid = false;
    } else {
      this.consultationHid = true;
      this.medicationHid = true;
      this.medicalHid = false;
    }
    this.selectedItem = newValue;
  }

  private loadPages(): void {
    this.staffList = {
      data: this.data.slice(this.skip, this.skip + this.pageSize),
      //data: this.data.slice(),
      total: this.data.length
    };
  }
  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    this.pageSize = isNaN(event.take) ? this.data.length : event.take;
    //this.loadPages();
    this.staffList = process(this.data, this.state);
  }
  public filterChange(state): void {
    var filter = state.filter.filters.length;
    this.currentFilter = filter > 0 ? state.filter.filters["0"].value : "";
    this.state = state;
    this.staffList = process(this.data, this.state);
  }

  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.staffList = {
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
    if (innerW > 1551) {
      var consultHeight = this.consultHeight.nativeElement.offsetHeight;
      this.dataService.changeHeightFromConsultation(consultHeight);
    }
  }
}
