import { Component, Input, SimpleChanges, HostListener, ViewChild, ElementRef, AfterViewInit } from "@angular/core";
import { State, CompositeFilterDescriptor, SortDescriptor, process, orderBy } from '@progress/kendo-data-query';
import { GridDataResult, PageChangeEvent, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { ConsultationService } from './consultation.service';
import * as _ from 'lodash';
import { UtilitiesService } from 'src/app/shared/service/utilities.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddConsultationComponent } from './modal/addConsultation.component';

import { NotificationService } from 'src/app/shared/service/notification.service';
import { CustomConfirmDeleteModalComponent } from 'src/app/shared/modal/confirmDelete/confirmDelete.component';
import { DataSharedService } from 'src/app/shared/service/data.service';

const MODALS = {
  addConsultation: AddConsultationComponent,
  confirm: CustomConfirmDeleteModalComponent
}

@Component({
  selector: 'staffList-consultation',
  templateUrl: './consultation.component.html',
  styleUrls: ['../staffList.component.css', './consultation.component.css']
})

export class ConsultationComponent implements AfterViewInit {
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
  selectedConsult = [];
  @Input() person_id: any;
  @ViewChild('gridHeight') gridHeight: ElementRef;
  constructor(private service: ConsultationService,
    private util: UtilitiesService,
    private _modal: NgbModal,
    private dataService: DataSharedService,
    private notification: NotificationService) {

  }
  ngAfterViewInit() {

    this.responsiveHeight();

  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.person_id.currentValue !== "" && changes.person_id.currentValue !== undefined) {
      this.GetConsultation(changes.person_id.currentValue)
    }
  }
  consultation_id() {

  }
  AddData(consultation_id, action) {
    if (this.person_id.person_id !== 0) {
      const modalRef = this._modal.open(
        MODALS['addConsultation'],
        {
          backdrop: 'static',
          keyboard: false,
          size: 'lg',
          backdropClass: 'modal-backdrop-pointer-events'
        });
      if (action === "I") {
        this.person_id.action = action;
        modalRef.componentInstance.person_id = this.person_id;;
      } else {
        //var info = _.filter(this.data, ['consultation_id', consultation_id]);
        var info = _.filter(this.data_unchanged, ['consultation_id', consultation_id])
        
        info[0].action = action;
        modalRef.componentInstance.person_id = info[0];
      }
      modalRef.result.then(data => {
        if (data !== "cancel") {
          var newData = _.cloneDeep(this.data_unchanged);
          if (data.action === 'I') {
            //data.date_consulted = this.convertDate(data.date_consuleted);
            newData.push(data);
            this.data_unchanged.push(data);
            //this.processGridData(newData, "edit");
          } else {
           //for IE begin
            var convert = this.convertDate;
            _.forEach(newData, function (d) {
              if (d.consultation_id === data.consultation_id) {
                d.date_consulted = convert(data.date_consulted);
                d.complaints = data.complaints;
                d.diagnosis = data.diagnosis;
                d.treatment = data.treatment;
                d.consulted_by = data.consulted_by;
                return;
              }
            })
            //end
            _.forEach(this.data_unchanged, function (d) {
              if (d.consultation_id === data.consultation_id) {
                d.date_consulted = convert(data.date_consulted);
                d.complaints = data.complaints;
                d.diagnosis = data.diagnosis;
                d.treatment = data.treatment;
                d.consulted_by = data.consulted_by;
                return;
              }
            })
            
          }
          this.processGridData(newData, "edit");
        }
      })
    } else {
      this.notification.showWarning("Please save the person details.")
    }
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
  DeleteAllSelected() {
    if (this.person_id.person_id !== 0) {
      if (this.selectedConsult.length === 0) {
        this.notification.showWarning('Please select a record(s).')
      } else {
        const modalRef = this._modal.open(MODALS['confirm'], { backdrop: 'static', keyboard: false });
        modalRef.componentInstance.allSelected = this.selectedConsult;
        modalRef.result.then(data => {
          if (data === 'save') {
            this.removeSelectedConsult();
            var sub = this.service.DeleteConsultation(this.selectedConsult).subscribe(data => {
              this.dataService.GetReference().subscribe(data => {
                this.dataService.Reference(data);
              })
              this.notification.showSuccess("Record Save.")
              sub.unsubscribe;
            })
          }
        })
      }
    } else {
      this.notification.showWarning("Please save the person details.")
    }
  }
  removeSelectedConsult() {
    var data = this.data;
    var data_unchanged_clone = _.cloneDeep(this.data_unchanged);
    var data_unchanged = this.data_unchanged
    _.forEach(this.selectedConsult, function (s) {
      _.remove(data, function (r) {
        return r.consultation_id == s;
      })
      _.remove(data_unchanged_clone, function (r) {
        return r.consultation_id == s;
      })
      _.remove(data_unchanged, function (r) {
        return r.consultation_id == s;
      })
    })
    this.processGridData(data_unchanged_clone, "delete");
  }

  GetConsultation(person_id) {
    var sub = this.service.GetConsultation(person_id.person_id).subscribe(data => {
      //this._data = data;
      this.data_unchanged = _.cloneDeep(data);
      this.processGridData(data, "onload");
     
      this.loadPages();
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
  onSelectedKeysChange(e) {
    var data = this.data;
    var selectedConsult = [];
    _.forEach(e, function (d) {
      selectedConsult.push(data[d].consultation_id);
    })
    this.selectedConsult = selectedConsult;
  }
  onSelectAllChange(e) {
    if (e === "checked") {
      var selected = [];
      _.forEach(this.gridData.data, function (g) {
        selected.push(g.consultation_id);
      })
      this.selectedConsult = selected;
    }
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
    //var height = window.innerHeight - this.gridHeight.nativeElement.offsetheight;
    //this.gridHeight.nativeElement.setAttribute('style', "height:" + height + "px");
  }
}
