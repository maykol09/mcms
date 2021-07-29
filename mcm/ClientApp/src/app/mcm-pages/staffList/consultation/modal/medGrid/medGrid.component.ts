
import { Component, Input, ViewChild, OnInit, OnDestroy, Renderer2, Output, EventEmitter } from "@angular/core";
import { State, CompositeFilterDescriptor, SortDescriptor, process, orderBy } from '@progress/kendo-data-query';
import { GridDataResult, PageChangeEvent, DataStateChangeEvent, GridComponent } from '@progress/kendo-angular-grid';
import { UtilitiesService } from 'src/app/shared/service/utilities.service';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { NotificationService } from 'src/app/shared/service/notification.service';
import { MedicationGridService } from "./medGrid.service";
import * as _ from 'lodash';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomConfirmDeleteModalComponent } from 'src/app/shared/modal/confirmDelete/confirmDelete.component';
import { DataSharedService } from 'src/app/shared/service/data.service';

const matches = (el, selector) => (el.matches || el.msMatchesSelector).call(el, selector);
const MODALS = {
  confirm: CustomConfirmDeleteModalComponent
}
@Component({
  selector: "modal-medication-grid",
  templateUrl: "./medGrid.component.html",
  styleUrls: ["../addConsultation.component.css"]
})

export class MedicationGridComponent implements OnInit, OnDestroy {
  public state: State = {
    filter: {
      logic: 'and',
      filters: []
    }
  };
  public medicine: any;
  public medicine_unchange: any;
  public medIdFromSelection: number;
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
  public selectedConsult = [];
  public editedRowIndex: number;
  public addConsultationMed: FormGroup
  public formControl = <any>[];
  public isNew = false;
  public docClickSubscription: any;
  currentMedOnhand = 0;
  medDelData: any[] = [];
  addedCount = 0;
  withActionData: any;
  sub: any;
  oldQuantity: number;
  med_id: number;
  @ViewChild(GridComponent) private grid: GridComponent;
  @Input() person_id: any;
  @Output() sendToParent = new EventEmitter<any>();

  constructor(
    private dataService: DataSharedService,
    private util: UtilitiesService,
    private notification: NotificationService,
    private service: MedicationGridService,
    private renderer: Renderer2,
    private _modal: NgbModal) {
    //this.formBuilder();
  }
  ngAfterViewInit() {

    this.GetConsultationMed(this.person_id);
    this.GetMedicineRef();
  }
  public ngOnInit(): void {
    this.docClickSubscription = this.renderer.listen('document', 'click', this.onDocumentClick.bind(this));
  }
  formBuilder(): void {
    this.addConsultationMed = this.service.FormGroup();
    this.formControl = this.addConsultationMed.controls;
  }
  public ngOnDestroy(): void {
    this.docClickSubscription();
  }
  GetMedicineRef() {
    this.medicine_unchange = _.cloneDeep(this.medicineWithValidOnhand(this.dataService.GetMedicine()));
    this.medicine = this.medicine_unchange.slice();
   
  }
  medicineWithValidOnhand(data) {
    return _.filter(data, function (d) {
       if(d.is_active)  return d ;
    })
  }
  GetConsultationMed(person_id) {
    if (person_id.action !== "I") {
      var sub = this.service.GetConsultationMed(person_id).subscribe(data => {

        this.processGridData(data, "onload");
        this.loadPages();
        sub.unsubscribe();
      })
    }
  }
  AddMedData({ sender }) {
    this.closeEditor(sender);
    this.addConsultationMed = this.service.FormGroup();
    this.isNew = true;
    this.grid.addRow(this.addConsultationMed);

  }

  public EditMedData({ isEdited, dataItem, rowIndex }): void {

    if (isEdited || (this.addConsultationMed && !this.addConsultationMed.valid)) {
      this.notification.showError("Please fill the required field(s).")
      return;
    }
    this.oldQuantity = dataItem.quantity;
    this.med_id = dataItem.med_id;
    if (this.MedicineValueChange(dataItem.medicine, 'method')) {
      this.isNew = false;
      this.saveRow();
      this.addConsultationMed = this.service.FormGroup();

      this.addConsultationMed.patchValue(dataItem);
      this.editedRowIndex = rowIndex;
      this.grid.editRow(rowIndex, this.addConsultationMed);
    } else {
      this.notification.showWarning("Medicine is inactive.")
    }

  }

  public cancelHandler(): void {
    this.closeEditor(this.grid, this.editedRowIndex);
  }
  private closeEditor(grid: GridComponent, rowIndex: number = this.editedRowIndex): void {
    this.isNew = false;
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
    this.addConsultationMed = undefined;
  }
  private saveRow(): void {
    
    if (this.addConsultationMed && (!this.isInEditingMode || this.isNew)) {
      this.addedCount++;
      this.addConsultationMed.patchValue({ action: "I", consult_med_id : this.addedCount, med_id : this.medIdFromSelection });
      this.data.push(this.addConsultationMed.getRawValue());
      this.processGridData(this.data);
      this.getWithActionData(status);
      this.closeEditor(this.grid, this.editedRowIndex);
    } else {
      if (this.addConsultationMed !== undefined && !this.addConsultationMed.pristine) {
        var editConsult = this.addConsultationMed.getRawValue();
        var med_id = this.medIdFromSelection;
        _.forEach(this.data, function (d) {
          if (d.consult_med_id === editConsult.consult_med_id) {
            d.med_id = med_id === undefined ? editConsult.med_id : med_id;
            d.medicine = editConsult.medicine;
            d.dosage = editConsult.dosage;
            d.quantity = editConsult.quantity;
            d.onhand = editConsult.onhand;
            if (editConsult.action !== 'I') {
              d.action = 'U';
            }
          }
        });
        this.processGridData(this.data);
        this.getWithActionData(this.addConsultationMed.status);
      }
      this.medicine = this.medicine_unchange.slice();
      this.closeEditor(this.grid, this.editedRowIndex);
    }
  }

  MedicineFilterChange(event): void {
    this.medicine = this.medicine_unchange.filter((s) => s.med_name.toLowerCase().indexOf(event.toLowerCase()) !== -1);
  }
  //ActiveMedicine() {
  //  return _.filter(this.dataService.getMedicine, function (d) {
  //    if (d.is_active) return d;
  //  })
  //}
  MedicineValueChange(event, from): boolean {
    if (event !== null && event !== undefined) {
      var med = _.filter(this.medicine_unchange, { 'med_name': event });
      if (med.length > 0) {
        this.currentMedOnhand = parseInt(med[0].onhand);
        if (from === 'grid') {
          this.oldQuantity = 0;
          this.med_id = med[0].med_id;
          this.medIdFromSelection = med[0].med_id;
          
          this.addConsultationMed.patchValue({ quantity: '' , onhand: med[0].onhand });
        }
        return med[0].is_active;
      } 
    }
    return false;
  }
  QuantityChange(val): void {
    if (this.isInEditingMode) {
      var validVal = val.target.value === "" ? 0 : parseInt(val.target.value);
      var oldQuantity = this.oldQuantity === undefined ? 0 : this.oldQuantity;
      var newValidVal = validVal - oldQuantity;
    } else {
      var validVal = val.target.value === "" ? 0 : parseInt(val.target.value);
    }
    
    var currentVal = this.currentMedOnhand === undefined ? 0 : this.currentMedOnhand - newValidVal;
    this.addConsultationMed.patchValue({ onhand: currentVal })
    var med_id = this.med_id;
    _.forEach(this.medicine, function (m) {
      if (m.med_id === med_id) {
        m.onhand = currentVal;
      }
    })
    if ((currentVal < 0 && newValidVal >= 0) || (currentVal === 0 && newValidVal === 0)) {
      this.addConsultationMed.controls.quantity.setErrors({ 'invalid': true });
      this.notification.showError("Invalid medicine quantity.");
    } else {
      this.addConsultationMed.controls.quantity.setErrors({ 'invalid': null });
      this.addConsultationMed.controls.quantity.updateValueAndValidity();
    }
  }

  getWithActionData(valid): void {
    var withActionData = [];
    _.forEach(this.data, function (d) {
      if (d.action !== null) {
        withActionData.push(d);
      }
    })
    _.forEach(this.medDelData, function (m) {
      withActionData.push(m);
    });
    this.withActionData = withActionData;
    this.sendToParent.emit({ data: this.withActionData, valid: valid });
  }
  public get isInEditingMode(): boolean {
    return this.editedRowIndex !== undefined || this.isNew;
  }
  private onDocumentClick(e: any): void {
    if (this.addConsultationMed && this.addConsultationMed.valid &&
      !matches(e.target, '#medGrid tbody *, #medGrid .k-grid-toolbar .k-button')) {
      this.saveRow();
    } else if (this.addConsultationMed && !matches(e.target, '#medGrid tbody *, #medGrid .k-grid-toolbar .k-button')) {
      this.addConsultationMed.controls.quantity.markAsTouched();
      this.sendToParent.emit({data : [], valid : "INVALID"})
    }
  }

  onSelectedKeysChange(e) {
    var data = this.data;
    var selectedConsult = [];
    _.forEach(e, function (d) {
      selectedConsult.push(data[d].consult_med_id);
    })
    this.selectedConsult = selectedConsult;
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
        }
      })
    }

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
  removeSelectedConsult() {
    var data = this.data;
    var medDeldata = this.medDelData;
    _.forEach(this.selectedConsult, function (s) {
      _.remove(data, function (r) {
        if (r.consult_med_id == s && r.person_id !== 0) {
          r.action = "D";
          medDeldata.push(r);
        }
        return r.consult_med_id == s;
      })
    })

    this.medDelData = medDeldata;
    this.getWithActionData('VALID');
    this.processGridData(data, "delete");
  }

  processGridData(data, call = "") {
    var util = this.util;
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
    this.loadPages();
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
}
