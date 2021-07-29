import { Component, Input, SimpleChanges, Output, EventEmitter, OnDestroy, OnChanges } from "@angular/core";
import { MedicineDetailsService } from './medicineDetails.service';
import { FormGroup } from '@angular/forms';
import { UtilitiesService } from 'src/app/shared/service/utilities.service';
import * as _ from 'lodash';
import { NotificationService } from 'src/app/shared/service/notification.service';
import { NavMenuService } from 'src/app/shared/nav-menu/nav-menu.service';

@Component({
  selector: 'medicineList-medicineDetails',
  templateUrl: './medicineDetails.component.html',
  styleUrls: ['../medicine.component.css']
})

export class MedicineDetailsComponent implements OnDestroy, OnChanges {
  medicineDetails: FormGroup;
  formControl = <any>[];
  @Input() med_id: any;
  @Output() sendToParent = new EventEmitter();
  sub: any;
  email: string = "";
  constructor(private service: MedicineDetailsService,
    private util: UtilitiesService,
    private notification: NotificationService, private fromNav: NavMenuService) {
    this.formBuilder();
    this.sub = this.fromNav.user.subscribe(data => {
      this.email = data + "@who.int";
    })
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.med_id.currentValue !== undefined) {
      if (changes.med_id.currentValue === "") {
        this.med_id = 0;
        this.medicineDetails.reset();
      } else {
        this.GetMedicineDetails(changes.med_id.currentValue)
      }
     
    }
  }
  SaveMedicineDetails() {
    var required = false;
    var action = this.med_id > 0 ? 'U' : 'I';
    this.medicineDetails.patchValue({ action: action });
    if (this.medicineDetails.invalid) {
      _.forEach(this.medicineDetails.controls, function (control) {
        control.markAsTouched();
        if (control.errors !== null) {
          required = control.errors.required ? true : false;
        }
      });
      if (required) {
        this.notification.showError('Please fill the required field(s).');
      }
    } else {
      if (this.medicineDetails.dirty) {
        
        var status = this.medicineDetails.value.is_active === null || !this.medicineDetails.value.is_active ? false : true;
        this.medicineDetails.patchValue({ med_id: this.med_id, is_active: status });
        this.service.SaveMedicineDetails(this.medicineDetails.value).subscribe((data: number) => {
          this.notification.showSuccess('Record save successfully.');
          var med_name = this.medicineDetails.value.med_name;
          this.med_id = data;
          var medicine = {
            med_name: med_name,
            med_id: data,
            is_active: this.medicineDetails.value.is_active,
            action: action
          };

          this.sendToParent.emit(medicine);
        })
      } else {
        this.notification.showWarning("No changes made.")
      }
    }
  }
  birthDateChange(event) {
    this.medicineDetails.patchValue({ age: this.getAge(event) });
  }
  getAge(data) {
    var today = new Date();
    var birthDate = new Date(data);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age = age - 1;
    }

    return age;
  }
  GetMedicineDetails(med_id) {
    if (med_id === 0) {
      this.med_id = 0;
      this.medicineDetails.reset();
    } else {
      this.service.GetMedicineDetails(med_id).subscribe(data => {
        this.medicineDetails.patchValue(data);
      })
    }
  }
  formBuilder() {
    this.medicineDetails = this.service.FormGroup();
    this.formControl = this.medicineDetails.controls;
  }

}
