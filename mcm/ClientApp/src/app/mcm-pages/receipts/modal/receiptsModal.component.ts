import { Component, Input, AfterViewInit } from "@angular/core";
import { ReceiptsService } from "../receipts.service";
import { FormGroup } from "@angular/forms";
import { NotificationService } from 'src/app/shared/service/notification.service';
import { UtilitiesService } from 'src/app/shared/service/utilities.service';
import { CustomConfirmModalComponent } from 'src/app/shared/modal/confirm/confirm.component';
import { NavMenuService } from 'src/app/shared/nav-menu/nav-menu.service';
import { NgbModal, NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import * as _ from 'lodash';
import { DataSharedService } from 'src/app/shared/service/data.service';
const MODALS = {
  saveChanges: CustomConfirmModalComponent
}

@Component({
  selector: 'receipts-modal',
  templateUrl: './receiptsModal.component.html',
  styleUrls: ['./receiptsModal.component.css']
})

export class ReceiptsModalComponent implements AfterViewInit {

  formControl = <any>[];
  dataFromReceiptsGrid: any;
  addMedReceipts: FormGroup;
  addConsultationMed: FormGroup;
  @Input() info: any;
  sub: any;
  diagnosisList: any;
  currentFilter: any = "";
  supplier: any;
  supplier_unchange: any;
  constructor(private service: ReceiptsService,
    private util: UtilitiesService,
    private _modal: NgbModal,
    private notification: NotificationService,
    private modal: NgbActiveModal,
    private fromNav: NavMenuService,
    private dataShared: DataSharedService) {
    this.formBuilder();
    this.supplier_unchange = this.dataShared.GetSupplier();
    this.supplier = this.TrimSupplier(this.supplier_unchange.slice());

  }
  ngAfterViewInit() {
    var info = _.cloneDeep(this.info);
    if (this.info.action === "U") {
      info.date_received = new Date(info.date_received.split("T")[0]);
      //info.supplier = this.GetSupplierIdName("", info.supplier);
    }
    this.sub = this.fromNav.user.subscribe(data => {
      info.user = data;
      setTimeout(() => { this.addMedReceipts.patchValue(info) });
    });
    this.sub.unsubscribe();
  }
  TrimSupplier(data) {
    return _.forEach(data, function (s) {
      s.supplier_id = s.supplier_id.trim();
    })
  }

  GetSupplierIdName(id, name) {
    if (id !== "") {
      var id = _.filter(this.supplier, { 'supplier_id': id });
      return id[0].supplier_name;
    } else {
      var name = _.filter(this.supplier, { 'supplier_name': name });
      return name[0].supplier_id;
    }
  }
  formBuilder(): void {
    this.addMedReceipts = this.service.FormBuilder();
    this.formControl = this.addMedReceipts.controls;
  }
  fromReceiptsGrid(event) {
    this.dataFromReceiptsGrid = event;
  }
  checkDataFromMedGrid() {
    if (this.dataFromReceiptsGrid === undefined) {
      this.dataFromReceiptsGrid = {};
      this.dataFromReceiptsGrid.data = [];
    }
  }
  saveReceipts(_action): void {
    setTimeout(() => {
      var required = false;
      var action = this.info.action;
      this.addMedReceipts.patchValue({ action: action });
      if (this.addMedReceipts.invalid) {
        _.forEach(this.addMedReceipts.controls, function (control) {
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
        if (this.addMedReceipts.dirty || this.dataFromReceiptsGrid.data.length > 0 ) {
          var _date_received = new Date(this.addMedReceipts.value.date_received);
          this.addMedReceipts.patchValue({ si_id: this.info.si_id, status: 'Posted' });
          var allData = this.addMedReceipts.getRawValue();
          allData.list_receveived_med = this.dataFromReceiptsGrid.data;

          if (allData.action === "I") {
            allData.date_received = new Date(_date_received.setDate(_date_received.getDate() + 1));
          }
            
          
          var sub = this.service.SaveReceipts(allData).subscribe(data => {
            this.dataShared.GetReference().subscribe(data => {
              this.dataShared.Reference(data);
            })
            this.notification.showSuccess('Record save successfully.');
            this.addMedReceipts.patchValue({ si_id: data });
            var stocks = this.addMedReceipts.getRawValue();
            //stocks.supplier = this.GetSupplierIdName(stocks.supplier, "");
            //stocks.date_received = this.util.FormatDate(new Date(stocks.date_received));
            //if (allData.action === "I") {
            //  stocks.date_received = new Date(_date_received.setDate(_date_received.getDate() + 1));
            //}
            this.modal.close(stocks);
            sub.unsubscribe();
          })
        } else {
          if (this.dataFromReceiptsGrid.valid !== undefined && this.dataFromReceiptsGrid.valid !== 'valid') {
            this.notification.showError("Please fill the required field(s).")
          } else {
            this.notification.showWarning("No changes made.")
          }
        }
      }
    })
  }
  closeModal() {
    //this.modal.close("cancel");
    setTimeout(() => {
      this.checkDataFromMedGrid();
      if (this.addMedReceipts.dirty || this.dataFromReceiptsGrid.data.length > 0) {
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
            this.saveReceipts('save');
          }
        })
      } else {
        this.modal.close("cancel");
      }
    })
  }
  SupplierFilterChange(event) {
    this.supplier = this.supplier_unchange.filter((s) => s.supplier_name.toLowerCase().indexOf(event.toLowerCase()) !== -1);
  }
  //SupplierValueChange(event) {
  //  var med_id = _.filter(this.supplier_unchange, { 'med_name': event });
  //  this.medIdFromSelection = med_id[0].med_id;

  //}
}
