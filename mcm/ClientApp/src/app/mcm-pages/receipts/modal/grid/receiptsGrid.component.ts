
import { Component, Input, ViewChild, OnInit, OnDestroy, Renderer2, Output, EventEmitter } from "@angular/core";
import { State, CompositeFilterDescriptor, SortDescriptor, process, orderBy } from '@progress/kendo-data-query';
import { GridDataResult, PageChangeEvent, DataStateChangeEvent, GridComponent } from '@progress/kendo-angular-grid';
import { UtilitiesService } from 'src/app/shared/service/utilities.service';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { NotificationService } from 'src/app/shared/service/notification.service';
import * as _ from 'lodash';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomConfirmDeleteModalComponent } from 'src/app/shared/modal/confirmDelete/confirmDelete.component';
import { DataSharedService } from 'src/app/shared/service/data.service';
import { ReceiptsService } from "../../receipts.service";

const matches = (el, selector) => (el.matches || el.msMatchesSelector).call(el, selector);
const MODALS = {
  confirm: CustomConfirmDeleteModalComponent
}
@Component({
  selector: "modal-receipts-grid",
  templateUrl: "./receiptsGrid.component.html",
  styleUrls: ["../receiptsModal.component.css"]
})

export class ReceiptsGridComponent implements OnInit, OnDestroy {
  public state: State = {
    filter: {
      logic: 'and',
      filters: []
    }
  };
  public medicine: any;
  public medicine_unchange: any;
  public siIdFromSelection: number;
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
  public addMedReceipts: FormGroup
  public formControl = <any>[];
  public isNew = false;
  public docClickSubscription: any;
  medDelData: any[] = [];
  addedCount = 0;
  withActionData: any;
  sub: any;
  @ViewChild(GridComponent, { static: true }) private grid: GridComponent;
  @Input() info: any;
  @Output() sendToParent = new EventEmitter<any>();

  constructor(
    private dataService: DataSharedService,
    private util: UtilitiesService,
    private notification: NotificationService,
    private service: ReceiptsService,
    private renderer: Renderer2,
    private _modal: NgbModal) {
    //this.formBuilder();
  }
  ngAfterViewInit() {
    this.GetMedicineRef();
    this.GetMedReceipts(this.info);
   
  }
  public ngOnInit(): void {
    this.docClickSubscription = this.renderer.listen('document', 'click', this.onDocumentClick.bind(this));
  }
  formBuilder(): void {
    this.addMedReceipts = this.service.FormGroup();
    this.formControl = this.addMedReceipts.controls;
  }
  public ngOnDestroy(): void {
    this.docClickSubscription();
  }
  GetMedicineRef() {
    this.medicine_unchange = this.ActiveMedicine(this.dataService.GetMedicine());
    this.medicine = this.medicine_unchange.slice();
   
  }
  ActiveMedicine(data) {
    return _.filter(data, function (d) {
      if (d.is_active) return d;
    })
  }
  GetMedicineIdName(id, name) {
    if (id !== "") {
      var id = _.filter(this.medicine, { 'med_id': id });
      return id[0].med_name;
    } else {
      var name = _.filter(this.medicine, { 'med_name': name });
      return name[0].med_id;
    }
  }
  GetMedReceipts(info) {
    if (info.action !== "I") {
      var sub = this.service.GetStockMedicine(info.si_id).subscribe(data => {

        this.processGridData(data, "onload");
        this.loadPages();
        sub.unsubscribe();
      })
    }
  }
  AddMedData({ sender }) {
    this.closeEditor(sender);
    this.addMedReceipts = this.service.FormGroup();
    this.isNew = true;
    this.grid.addRow(this.addMedReceipts);

  }

  public EditRecData({ isEdited, dataItem, rowIndex }): void {
    if (isEdited || (this.addMedReceipts && !this.addMedReceipts.valid)) {
      this.notification.showError("Please fill the required field(s).")
      return;
    }
    this.isNew = false;
    this.saveRow();
    this.addMedReceipts = this.service.FormGroup();
    this.addMedReceipts.patchValue(dataItem);
    this.addMedReceipts.patchValue({"med_name": this.GetMedicineIdName("", dataItem.med_name)})
    this.editedRowIndex = rowIndex;
    this.grid.editRow(rowIndex, this.addMedReceipts);
  }

  public cancelHandler(): void {
    this.closeEditor(this.grid, this.editedRowIndex);
  }
  private closeEditor(grid: GridComponent, rowIndex: number = this.editedRowIndex): void {
    this.isNew = false;
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
    this.addMedReceipts = undefined;
  }
  private saveRow(): void {
    if (this.addMedReceipts && (!this.isInEditingMode || this.isNew)) {
      this.addedCount++;
      this.addMedReceipts.value.action = "I";
      this.addMedReceipts.value.si_med_id = this.addedCount;
      this.addMedReceipts.value.med_id = this.siIdFromSelection;
      this.addMedReceipts.value.med_name = this.GetMedicineIdName(this.siIdFromSelection, "");
      this.data.push(this.addMedReceipts.value);
      this.processGridData(this.data);
      this.getWithActionData('valid');
      this.closeEditor(this.grid, this.editedRowIndex);
    } else {
      if (this.addMedReceipts !== undefined && !this.addMedReceipts.pristine) {
        var editConsult = this.addMedReceipts.value;
        var newMedName = this.GetMedicineIdName(editConsult.med_name, "");
        _.forEach(this.data, function (d) {
          if (d.si_med_id === editConsult.si_med_id) {
            d.med_id = editConsult.med_name;
            d.med_name = newMedName;
            d.quantity = editConsult.quantity;
            d.cost = editConsult.cost;
            d.remarks = editConsult.remarks;
            if (editConsult.action !== 'I') {
              d.action = 'U';
            }
          }
        });
        this.processGridData(this.data);
        this.getWithActionData('valid');
      }
      this.closeEditor(this.grid, this.editedRowIndex);
    }
  }

  MedicineFilterChange(event) {
    this.medicine = this.medicine_unchange.filter((s) => s.med_name.toLowerCase().indexOf(event.toLowerCase()) !== -1);
  }
  MedicineValueChange(event) {
    var med_id = _.filter(this.medicine_unchange, { 'med_id': event });
    this.siIdFromSelection = med_id[0].med_id;

  }

  getWithActionData(valid) {
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
    this.withActionData;
    this.sendToParent.emit({ data: this.withActionData, valid: valid });
  }
  public get isInEditingMode(): boolean {
    return this.editedRowIndex !== undefined || this.isNew;
  }
  private onDocumentClick(e: any): void {
    if (this.addMedReceipts && this.addMedReceipts.valid &&
      !matches(e.target, '#receiptsGrid tbody *, #receiptsGrid .k-grid-toolbar .k-button')) {
      this.saveRow();
    }
  }

  onSelectedKeysChange(e) {
    var data = this.data;
    var selectedConsult = [];
    _.forEach(e, function (d) {
      selectedConsult.push(data[d].si_med_id);
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
        if (r.si_med_id == s && r.si_id !== 0) {
          r.action = "D";
          medDeldata.push(r);
        }
        return r.si_med_id == s;
      })
    })

    this.medDelData = medDeldata;
    this.getWithActionData('valid');
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
}
