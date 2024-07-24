import { Component, Input, SimpleChanges, HostListener, ViewChild, ElementRef, AfterViewInit } from "@angular/core";
import { State, CompositeFilterDescriptor, SortDescriptor, process, orderBy } from '@progress/kendo-data-query';
import { GridDataResult, PageChangeEvent, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { MedicationService } from './medication.service';
import * as _ from 'lodash';
import { UtilitiesService } from 'src/app/shared/service/utilities.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddMedicationComponent } from './modal/addMedication.component';

import { NotificationService } from 'src/app/shared/service/notification.service';
import { CustomConfirmDeleteModalComponent } from 'src/app/shared/modal/confirmDelete/confirmDelete.component';
import { DataSharedService } from 'src/app/shared/service/data.service';

const MODALS = {
  addMedication: AddMedicationComponent,
  confirm: CustomConfirmDeleteModalComponent
}

@Component({
  selector: 'staffList-medication',
  templateUrl: './medication.component.html',
  styleUrls: ['../staffList.component.css']
})

export class MedicationComponent {
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
  styleHeight: any;
  heightSub: any;
  @Input() person_id: any;
  @ViewChild('gridHeight', { static: false }) gridHeight: ElementRef;

  constructor(private service: MedicationService,
    private util: UtilitiesService,
    private _modal: NgbModal,
    private notification: NotificationService,
    private dataService: DataSharedService) {
    this.heightSub = this.dataService.heightFromConsultation.subscribe(data => {
      this.styleHeight = { height: ((parseInt(data) - 42.5)).toString() + "px" };
    })
  }
  ngAfterViewInit() {
    this.responsiveHeight();
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.person_id.currentValue !== "" && changes.person_id.currentValue !== undefined) {
      this.GetMedication(changes.person_id.currentValue)
    }
  }
  AddData(consult_med_id, action) {

    const modalRef = this._modal.open(MODALS['addMedication'], { backdrop: 'static', keyboard: false });
    if (consult_med_id === '') {
      var info = { person_id: this.person_id, action: action }
      modalRef.componentInstance.person_id = this.person_id;
    } else {
      var info = _.filter(this.data, ['consult_med_id', consult_med_id]);
      info.action = action;
      modalRef.componentInstance.person_id = info;
    }
    modalRef.result.then(data => {
      if (data !== "cancel") {
        if (data.action === 'I') {
          this.data.push(data);
        } else {
          _.forEach(this.data, function (d) {
            if (d.consult_med_id === data.consult_med_id) {
              d.medicine = data.medicine;
              d.med_quantity = data.med_quantity;
              d.dosage = data.dosage;
              d.date_given = data.date_given;
            }
          })
        }
        this.processGridData(this.data, "edit");
      }
    })
  }
  DeleteAllSelected() {

    if (this.selectedConsult.length === 0) {
      this.notification.showWarning('Please select a record(s).')
    } else {
      const modalRef = this._modal.open(MODALS['confirm'], { backdrop: 'static', keyboard: false });
      modalRef.componentInstance.allSelected = this.selectedConsult;
      modalRef.result.then(data => {
        if (data === 'save') {
          this.removeSelectedConsult();
          var sub = this.service.DeleteMedication(this.selectedConsult).subscribe(data => {
            this.notification.showSuccess("Record Save.")
            sub.unsubscribe;
          })
        }
      })
    }
  }
  removeSelectedConsult() {
    var data = this.data;
    _.forEach(this.selectedConsult, function (s) {
      _.remove(data, function (r) {
        return r.consult_med_id == s;
      })
    })
    this.processGridData(data, "delete");
  }

  GetMedication(person_id) {
    var sub = this.service.GetMedication(person_id.person_id).subscribe(data => {
      
      this.processGridData(data, "onload");
      this.loadPages();
      sub.unsubscribe();
    })
  }
  medication_id() {

  }
  processGridData(data, call) {
    var util = this.util;
    if (call === "onload") {
      var sortData = _.sortBy(data, ['date_given']).reverse();

      _.forEach(sortData, function (s) {
        s.date_given = s.date_given === null ? '' : util.FormatDate(s.date_given);
      })
      this.data = sortData;
    } else {
      _.forEach(data, function (s) {
        s.date_given = s.date_given === null ? '' : util.FormatDate(new Date(s.date_given));
      })

      this.data = data;
    }
    this.mySelection = [];
    this.gridData = process(this.data, this.state);
  }
  onSelectedKeysChange(e) {
    var data = this.data;
    var selectedConsult = [];
    _.forEach(e, function (d) {
      selectedConsult.push(data[d].consult_med_id);
    })
    this.selectedConsult = selectedConsult;
  }
  onSelectAllChange(e) {
    console.log(e);
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
  public filterChange(state: DataStateChangeEvent): void {
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
