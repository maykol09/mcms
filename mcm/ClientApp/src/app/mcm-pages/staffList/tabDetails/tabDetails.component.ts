import { Component, Input, SimpleChanges, ElementRef, ViewChild } from "@angular/core";
import { DataSharedService } from 'src/app/shared/service/data.service';


@Component({
  selector: 'staffList-tabDetails',
  templateUrl: './tabDetails.component.html',
  styleUrls: ['../staffList.component.css']
})

export class TabDetailsComponent {
  personId: number;
  @Input() person_id: number;
  selectedTab: number = 0;
  @ViewChild('consult') consultHeight: ElementRef;

  constructor(private dataService: DataSharedService) {

  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.person_id.currentValue !== "" && changes.person_id.currentValue !== undefined) {
      this.personId = changes.person_id.currentValue;
    }
  }
  onTabSelect(event) {
    if (event.index !== 0) {
      this.selectedTab = event.index;
      var consultHeight = this.consultHeight.nativeElement.offsetHeight;
      this.dataService.changeHeightFromConsultation(consultHeight);
    }
  }
  fromPersonDetails(event) {
    console.log(event);
  }
}
