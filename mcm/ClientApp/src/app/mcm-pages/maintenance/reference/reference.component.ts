import { Component, ViewChild, Renderer2 } from "@angular/core";
import { State, CompositeFilterDescriptor, process, SortDescriptor, orderBy } from '@progress/kendo-data-query';
import { GridDataResult, PageChangeEvent, GridComponent } from '@progress/kendo-angular-grid';
import * as _ from 'lodash';
import { UtilitiesService } from 'src/app/shared/service/utilities.service';
import { DataSharedService } from 'src/app/shared/service/data.service';
import { MaintenanceService } from '../maintenance.service';
import { NotificationService } from 'src/app/shared/service/notification.service';
import { FormGroup } from "@angular/forms";
import { NavMenuService } from 'src/app/shared/nav-menu/nav-menu.service';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CustomConfirmDeleteModalComponent } from 'src/app/shared/modal/confirmDelete/confirmDelete.component';

const matches = (el, selector) => (el.matches || el.msMatchesSelector).call(el, selector);
const MODALS = {
  confirmDeleteModal: CustomConfirmDeleteModalComponent
}

@Component({
  selector: 'maintenance-reference',
  styleUrls: ['../maintenance.component.css'],
  templateUrl: './reference.component.html'
})

export class ReferenceComponent {
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
  public editedRowIndex: number;
  public addReference: FormGroup
  public formControl = <any>[];
  public isNew = false;
  public docClickSubscription: any;
  addedCount = 0;
  withActionData: any[] = [];
  isSave = false;
  ref_type = [{ name: "REASON_FOR_VISIT" }, { name: "SUPPLIER" }]
  ref_type_unchange = this.ref_type.slice();
  @ViewChild(GridComponent, { static: true }) private grid: GridComponent;
  constructor(private util: UtilitiesService,
    private dataService: DataSharedService,
    private service: MaintenanceService,
    private notification: NotificationService,
    private renderer: Renderer2,
    private navUser: NavMenuService,
    private _modal: NgbModal) {
    this.GetReference();
    this.docClickSubscription = this.renderer.listen('document', 'click', this.onDocumentClick.bind(this));
  }
  public ngOnDestroy(): void {
    this.docClickSubscription();
  }
  AddData({ sender }) {
    this.closeEditor(sender);
    this.addReference = this.service.RefFormGroup();
    this.isNew = true;
    this.navUser.user.subscribe((data: string) => {
      this.grid.addRow(this.addReference);
    })
  }

  public EditData({ isEdited, dataItem, rowIndex }): void {
    if (isEdited || (this.addReference && !this.addReference.valid)) {
      return;
    }
    this.isNew = false;
    this.saveRow();
    this.addReference = this.service.RefFormGroup();
    this.addReference.patchValue(dataItem);
    this.editedRowIndex = rowIndex;
    this.grid.editRow(rowIndex, this.addReference);
  }
  RefTypeFilterChange(event) {
    this.ref_type = this.ref_type_unchange.filter((s) => s.name.toLowerCase().indexOf(event.toLowerCase()) !== -1);
  }

  public get isInEditingMode(): boolean {
    return this.editedRowIndex !== undefined || this.isNew;
  }
  DeleteSelected(ref_id: number): void {
    var modalRef = this._modal.open(MODALS['confirmDeleteModal'], {
      backdrop: 'static',
      keyboard: false
    });
    modalRef.result.then(data => {
      if (data === 'save') {
        this.service.DeleteReference(ref_id).subscribe(data => {
          _.remove(this.data, function (r) {
            if (r.ref_id === ref_id) {

              return r;
            }
          });
          this.dataService.GetReference().subscribe(data => {
            this.dataService.Reference(data);
          })
          this.processGridData(this.data);
          this.loadPages();
          this.notification.showSuccess("Record save.");
        })
      }
    })
  }
  SaveReference(): void {
    this.saveRow();
    this.isSave = true;
    if (this.withActionData && this.withActionData.length > 0) {

      this.SaveMethod();
    } else if (this.addReference && this.addReference.invalid) {
      this.notification.showError("Please fill the required field(s).")
    } else {
      this.notification.showWarning("No changes made.")
    }
  }
  SaveMethod() {
    this.service.SaveReference(this.withActionData).subscribe((data) => {
      this.withActionData = [];
      this.isSave = false;
      this.dataService.GetReference().subscribe(data => {
        this.dataService.Reference(data);
      })
      this.notification.showSuccess("Record save.");
    })
  }
  private saveRow(): void {
    if (!this.isSave) {
      if (this.addReference && (!this.isInEditingMode || this.isNew)) {

        this.addReference.patchValue({ action: "I", ref_id: 0 });
        this.data.push(this.addReference.getRawValue());
        this.processGridData(this.data);
        this.withActionData.push(this.addReference.getRawValue());
        this.closeEditor(this.grid, this.editedRowIndex);
      } else {
        if (this.addReference !== undefined && !this.addReference.pristine) {
          var editConsult = this.addReference.getRawValue();
          _.forEach(this.data, function (d) {
            if (d.ref_id === editConsult.ref_id) {
              d.ref_name = editConsult.ref_name;
              d.ref_type = editConsult.ref_type;
              d.ref_code = editConsult.ref_code;
            }
          });
          if (editConsult.action !== 'I') {
            editConsult.action = "U";
          }

          this.processGridData(this.data);
          this.withActionData.push(editConsult);
        }
        this.closeEditor(this.grid, this.editedRowIndex);
      }
    }
  }

  private onDocumentClick(e: any): void {
    if (this.addReference && this.addReference.valid &&
      !matches(e.target, '#refGrid tbody *, #refGrid .k-grid-toolbar')) {
      this.saveRow();
    }
  }
  public cancelHandler(): void {
    this.closeEditor(this.grid, this.editedRowIndex);
  }
  private closeEditor(grid: GridComponent, rowIndex: number = this.editedRowIndex): void {
    this.isNew = false;
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
    this.addReference = undefined;
  }
  GetReference(): void {
    var sub = this.service.GetReference().subscribe(data => {
      this.processGridData(data)
      this.loadPages();
      sub.unsubscribe();
    })
  }
  processGridData(data) {
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
}
