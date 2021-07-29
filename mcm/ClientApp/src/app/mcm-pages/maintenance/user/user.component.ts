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
  selector: 'maintenance-user',
  styleUrls: ['../maintenance.component.css'],
  templateUrl: './user.component.html'
})

export class UserComponent {
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
  public addUser: FormGroup
  public formControl = <any>[];
  public isNew = false;
  public docClickSubscription: any;
  addedCount = 0;
  withActionData: any[] = [];
  isSave = false;
  user_name = [];
  user_name_unchange = [];
  @ViewChild(GridComponent) private grid: GridComponent;
  constructor(private util: UtilitiesService,
    private dataService: DataSharedService,
    private service: MaintenanceService,
    private notification: NotificationService,
    private renderer: Renderer2,
    private navUser: NavMenuService,
    private _modal: NgbModal) {
    this.GetUser();
    this.docClickSubscription = this.renderer.listen('document', 'click', this.onDocumentClick.bind(this));

    this.user_name_unchange = this.dataService.GetUser();
    this.user_name = this.user_name_unchange.slice();
  }
  public ngOnDestroy(): void {
    this.docClickSubscription();
  }
  AddData({ sender }) {
    this.closeEditor(sender);
    this.addUser = this.service.FormGroup();
    this.isNew = true;
    var date = this.util.FormatDate(new Date());
    this.navUser.user.subscribe((data: string) => {
      this.addUser.patchValue({ created_by: data, date_created: date })
      this.grid.addRow(this.addUser);
    })
  }
  UserNameFilterChange(event) {
    this.user_name = this.user_name_unchange.filter((s) => s.user_name.toLowerCase().indexOf(event.toLowerCase()) !== -1);
  }
  public EditData({ isEdited, dataItem, rowIndex }): void {
    if (isEdited || (this.addUser && !this.addUser.valid)) {
      return;
    }
    this.isNew = false;
    this.saveRow();
    this.addUser = this.service.FormGroup();
    this.addUser.patchValue(dataItem);
    this.editedRowIndex = rowIndex;
    this.grid.editRow(rowIndex, this.addUser);
  }

  public get isInEditingMode(): boolean {
    return this.editedRowIndex !== undefined || this.isNew;
  }
  DeleteSelected(user_id: number): void {
    var modalRef = this._modal.open(MODALS['confirmDeleteModal'], {
      backdrop: 'static',
      keyboard: false
    });
    modalRef.result.then(data => {
      if (data === 'save') {
        this.service.DeleteUser(user_id).subscribe(data => {
          _.remove(this.data, function (r) {
            if (r.user_id === user_id) {

              return r;
            }
          })
          this.processGridData(this.data);
          this.loadPages();
          this.notification.showSuccess("Record save.");
        })
      }
    })
  }
  SaveUser(): void {
    this.saveRow();
    this.isSave = true;
    if (this.withActionData && this.withActionData.length > 0) {
      
      this.SaveMethod();
    } else if (this.addUser && this.addUser.invalid) {
      this.notification.showError("Please fill the required field(s).")
    } else {
      this.notification.showWarning("No changes made.")
    }
  }
  SaveMethod() {
    this.service.SaveUser(this.withActionData).subscribe((data) => {
      this.withActionData = [];
      this.isSave = false;
      this.notification.showSuccess("Record save.");
    })
  }
  private saveRow(): void {
    if (!this.isSave) {
      if (this.addUser && (!this.isInEditingMode || this.isNew)) {

        this.addUser.patchValue({ action: "I", user_id: 0, user_level: 99 });
        this.data.push(this.addUser.getRawValue());
        this.processGridData(this.data);
        this.withActionData.push(this.addUser.getRawValue());
        this.closeEditor(this.grid, this.editedRowIndex);
      } else {
        if (this.addUser !== undefined && !this.addUser.pristine) {
          var editConsult = this.addUser.getRawValue();
          _.forEach(this.data, function (d) {
            if (d.user_id === editConsult.user_id) {
              d.user_name = editConsult.user_name;
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
    if (this.addUser && this.addUser.valid &&
      !matches(e.target, '#userGrid tbody *, #userGrid .k-grid-toolbar')) {
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
    this.addUser = undefined;
  }
  GetUser(): void {
    var sub = this.service.GetUser().subscribe(data => {
      this.processGridData(data)
      this.loadPages();
      sub.unsubscribe();
    })
  }
  processGridData(data) {
    var util = this.util;
    _.forEach(data, function (s) {
      s.date_created = util.FormatDate(new Date(s.date_created));
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
}
