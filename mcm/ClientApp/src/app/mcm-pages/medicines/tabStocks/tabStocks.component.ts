import { Component, Input, SimpleChanges, ElementRef, ViewChild } from "@angular/core";
import { DataSharedService } from 'src/app/shared/service/data.service';


@Component({
  selector: 'medicine-tabStocks',
  templateUrl: './tabStocks.component.html',
  styleUrls: ['../medicine.component.css']
})

export class TabStocksComponent {
  medId: number;
  @Input() med_id: number;
  selectedTab: number = 0;
  @ViewChild('medicine') medicineHeight: ElementRef;

  constructor(private dataService: DataSharedService) {

  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.med_id.currentValue !== "" && changes.med_id.currentValue !== undefined) {
      this.medId = changes.med_id.currentValue;
    }
  }
  onTabSelect(event) {
    if (event.index !== 0) {
      this.selectedTab = event.index;
      var medicineHeight = this.medicineHeight.nativeElement.offsetHeight;
      this.dataService.changeHeightFromReceived(medicineHeight);
    }
  }
  fromPersonDetails(event) {
    console.log(event);
  }
}
