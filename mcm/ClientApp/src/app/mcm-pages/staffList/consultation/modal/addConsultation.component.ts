import { Component, Input, ViewChild, Output, ElementRef, OnDestroy, AfterViewInit, OnInit } from "@angular/core";

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl } from '@angular/forms';
import { AddConsultationService } from './addConsultation.service';
import { NotificationService } from 'src/app/shared/service/notification.service';
import * as _ from 'lodash';
import { UtilitiesService } from 'src/app/shared/service/utilities.service';
import { CustomConfirmModalComponent } from 'src/app/shared/modal/confirm/confirm.component';
import { NavMenuService } from 'src/app/shared/nav-menu/nav-menu.service';
import { DataSharedService } from 'src/app/shared/service/data.service';

declare var $: any;
const MODALS = {
  saveChanges: CustomConfirmModalComponent
}
@Component({
  selector: 'modal-addConsultation',
  templateUrl: './addConsultation.component.html',
  styleUrls: ['./addConsultation.component.css']

})

export class AddConsultationComponent implements AfterViewInit, OnInit {

  dataFromMedGrid: any;
  addConsultation: FormGroup;
  addConsultationMed: FormGroup;
  formControl = <any>[];
  @Input() person_id: any;
  sub: any;
  diagnosisList: any;
  reasonList: any;
  reasonList_unchange: any;
  currentDiagnosisFilter: any = "";
  currentReasonFilter: any = "";
  @ViewChild('gridHeight') gridHeight: ElementRef;
  @ViewChild("diagnosisAutocomplete") public diagnosisAutocomplete: any;
  @ViewChild("reasonAutocomplete") public reasonAutocomplete: any;
  constructor(
    private util: UtilitiesService,
    private _modal: NgbModal,
    private notification: NotificationService,
    private modal: NgbActiveModal,
    private service: AddConsultationService,
    private fromNav: NavMenuService,
    private dataService: DataSharedService) {
    this.formBuilder();
    this.reasonList_unchange = this.dataService.GetReason();
    this.reasonList = this.reasonList_unchange;
  }

  GetDiagnosis(input) {
    this.sub = this.service.GetDiagnosis(input).subscribe(data => {
      _.forEach(data, function (d) {
        d.ref_desc = d.ref_code + "-" + d.ref_desc;
      })
      this.diagnosisList = data;
      this.sub.unsubscribe();
    })
  }
  diagnosisFocus() {
    if (this.currentDiagnosisFilter.length >= 3) {
      this.diagnosisAutocomplete.toggle(true);
    } else {
      this.diagnosisAutocomplete.toggle(false);
    }
  }
  diagnosisFilterChange(event) {
    if (event.length >= 3) {
      this.currentDiagnosisFilter = event;
      this.GetDiagnosis(event);
      this.diagnosisAutocomplete.toggle(true);
    } else {
      this.diagnosisAutocomplete.toggle(false);
    }
  }


  reasonFilterChange(event) {
    this.reasonList = this.reasonList_unchange.filter((s) => s.reason.toLowerCase().indexOf(event.toLowerCase()) !== -1);
  }
  ngAfterViewInit() {

    var info = _.cloneDeep(this.person_id);
    if (this.person_id.action === "U") {
      info.date_consulted = new Date(info.date_consulted.split("T")[0]);
      console.log(info.date_consulted)
      setTimeout(() => { this.addConsultation.patchValue(info) });
    } else {
      this.sub = this.fromNav.user.subscribe(data => {
        this.addConsultation.patchValue({ consulted_by: data });

      });
      this.sub.unsubscribe();
    }
  }
  //convertDate(dateStr) {
  //  var d = "Mar";
  //  var dateParts = dateStr.split(" ");
  //  var day = dateParts[0];
  //  var month = _.indexOf(["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], d);
  //  var year = dateParts[2];
  //  var newDate = year + "-" + ('00' + month).slice(-2) + '-' + day;
  //  return newDate;
  //}
  //ngOnDestroy() {
  //  this.sub.unsubscribe();
  //}
  ngOnInit() {

    $(document).ready(function () {
      let modalContent: any = $('.modal-content');
      let modalHeader = $('.modal-header');
      modalHeader.addClass('cursor-all-scroll');
      //modalContent[0].draggable = true;
      modalContent.draggable({
        handle: '.modal-header'
      });
    });
  }
  formBuilder(): void {
    this.addConsultation = this.service.FormBuilder();
    this.formControl = this.addConsultation.controls;
  }

  fromMedGrid(event) {
    this.dataFromMedGrid = event;
  }
  checkDataFromMedGrid() {
    if (this.dataFromMedGrid === undefined) {
      this.dataFromMedGrid = {};
      this.dataFromMedGrid.data = [];
    }
  }
  saveConsultation(): void {
    setTimeout(() => {
      var required = false;
      var action = this.person_id.action;
      this.addConsultation.patchValue({ action: action });
      if (this.addConsultation.invalid) {
        _.forEach(this.addConsultation.controls, function (control) {
          control.markAsTouched();
          if (control.errors !== null) {
            required = control.errors.required ? true : false;
          }
        });
        if (required) {
          this.notification.showError('Please fill the required field(s).');
        }
      } else {
        this.checkDataFromMedGrid();
        if (this.addConsultation.dirty || this.dataFromMedGrid.data.length > 0) {
          var _date_consulted = new Date(this.addConsultation.value.date_consulted);
          
          this.addConsultation.patchValue({ person_id: this.person_id.person_id });
          var allData = this.addConsultation.getRawValue();

          allData.medicine = this.dataFromMedGrid.data;

          if (allData.action === "I") {
            allData.date_consulted = new Date(_date_consulted.setDate(_date_consulted.getDate() + 1));
          }
            

          var sub = this.service.SaveConsultation(allData).subscribe(data => {
            this.notification.showSuccess('Record save successfully.');
            this.addConsultation.patchValue({ consultation_id: data });
            var person = this.addConsultation.getRawValue();
            this.MedicineAddAndSub(this.dataFromMedGrid.data);
            this.modal.close(person);
            sub.unsubscribe();
          }, err => {
            console.log(err);
            this.notification.showError(JSON.parse(err));
          })
        } else {
          if (this.dataFromMedGrid.valid !== 'VALID' && this.dataFromMedGrid.valid !== undefined) {
            this.notification.showError("Please fill the required field(s).")
          } else {
            this.notification.showWarning("No changes made.")
          }
        }
      }
    })
  }

  MedicineAddAndSub(data) {
    var med = this.dataService.getMedicine;
    _.forEach(data, function (d) {

      _.forEach(med, function (m) {
        if (d.med_id === m.med_id) {
          if (d.action === 'D') {
            m.onhand += d.quantity;
          } else {
            m.onhand = d.onhand;
          }
          return;
        }
      })
    })
  }

  closeModal() {
    setTimeout(() => {
      this.checkDataFromMedGrid();
      if (this.addConsultation.dirty || this.dataFromMedGrid.data.length > 0) {
        var modalRef = this._modal.open(
          MODALS['saveChanges'],
          {
            backdrop: 'static',
            keyboard: false,
          });
        modalRef.result.then(res => {
          if (res === "no") {
            this.modal.close("cancel");
          } else if (res === "save") {
            this.saveConsultation();
          }
        })
      } else {
        this.modal.close("cancel");
      }
    }, 100)
  }
}
