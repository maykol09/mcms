import { Component, Input, SimpleChanges, OnDestroy } from "@angular/core";
import { State, CompositeFilterDescriptor, SortDescriptor, process, orderBy } from '@progress/kendo-data-query';
import { GridDataResult, PageChangeEvent, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { MedicalService } from './medical.service';
import * as _ from 'lodash';
import { UtilitiesService } from 'src/app/shared/service/utilities.service';
import { DataSharedService } from 'src/app/shared/service/data.service';
@Component({
  selector: 'staffList-medical',
  templateUrl: './medical.component.html',
  styleUrls: ['../staffList.component.css']
})

export class MedicalComponent implements OnDestroy {
  public state: State = {
    filter: {
      logic: 'and',
      filters: []
    }
  };
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
  @Input() person_id: number;
  styleHeight: any;
  heightSub: any;
  constructor(private service: MedicalService, private util: UtilitiesService, private dataService: DataSharedService) {
    this.heightSub = this.dataService.heightFromConsultation.subscribe(data => {
      this.styleHeight = { height: ((parseInt(data) - 42.5)).toString() + "px" };
    })
  }
  ngOnDestroy() {
    this.heightSub.unsubscribe();
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.person_id.currentValue !== "" && changes.person_id.currentValue !== undefined) {
      this.GetMedical(changes.person_id.currentValue)
    }
  }
  GetMedical(person_id) {
    var sis_id = person_id.sis_person_id === null ? 0 : person_id.sis_person_id;
    var sub = this.service.GetMedical(sis_id).subscribe(data => {
      var sortData = _.sortBy(data, ['medical_exam_date']).reverse();
      var util = this.util;
      _.forEach(sortData, function (s) {
        var mDate = s.medical_exam_date === null ? "" : s.medical_exam_date;
        var nmDate = s.next_medical_exam_date === null ? "" : s.next_medical_exam_date;
        s.medical_exam_date = util.FormatDate(mDate);
        s.next_medical_exam_date = util.FormatDate(nmDate);
      })

      this.data = sortData;
      this.gridData = process(this.data, this.state);
      this.loadPages();
      sub.unsubscribe();
    })
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
