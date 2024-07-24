import { Component, Input, SimpleChanges, Output, EventEmitter, OnDestroy, ViewChild } from "@angular/core";
import { ConsultationService } from '../consultation/consultation.service';
import { PersonDetailsService } from './personDetails.service';
import { FormGroup } from '@angular/forms';
import { UtilitiesService } from 'src/app/shared/service/utilities.service';
import * as _ from 'lodash';
import { NotificationService } from 'src/app/shared/service/notification.service';
import { NavMenuService } from 'src/app/shared/nav-menu/nav-menu.service';
import { DataSharedService } from 'src/app/shared/service/data.service';
import { DataCollection } from "@progress/kendo-angular-grid/dist/es2015/data/data.collection";
import { AutoCompleteComponent } from "@progress/kendo-angular-dropdowns";

@Component({
  selector: 'staffList-personDetails',
  templateUrl: './personDetails.component.html',
  styleUrls: ['../staffList.component.css']
})

export class PersonDetailsComponent {
  personDetails: FormGroup;
  formControl = <any>[];
  @Input() person_id: any;
  @Output() sendToParent = new EventEmitter();
  @Output() sendToStaffList = new EventEmitter<Object>();
  sub: any;
  cp_no: string;
  phone_no: string;
  email: string = "";
  name: any[];
  name_unchange: any[];
  addNew = true;
 
  @ViewChild('autocomplete', { static: true }) autocomplete: AutoCompleteComponent;
  constructor(private service: PersonDetailsService,
    private util: UtilitiesService,
    private refService: DataSharedService,
    private notification: NotificationService,
    private fromNav: NavMenuService) {
    this.formBuilder();
    this.name_unchange = this.refService.GetUser()
    this.name = this.name_unchange;

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.person_id.currentValue !== "" && changes.person_id.currentValue !== undefined) {
      this.GetPersonDetails(changes.person_id.currentValue)

      this.addNew = changes.person_id.currentValue.person_id === 0 ? false : true;
    }
  }
  nameFilterChange(event) {
    this.name = this.name_unchange.filter((s) => s.name.toLowerCase().indexOf(event.toLowerCase()) !== -1);
  }
  nameChange(event) {
    var name = _.filter(this.name_unchange, { 'name': event });
    this.service.GetPersonDetailsById(name[0].person_id).subscribe((data: any) => {
      this.sendToStaffList.emit(data);
      data.birth_date = data.birth_date === null ? '' : new Date(data.birth_date.split("T")[0]);
      data.age = data.birth_date === '' ? '' : this.getAge(data.birth_date);
      this.personDetails.patchValue(data);
      this.personDetails.markAsDirty();
    })
  }
  SavePersonDetails() {
    var required = false;
    var action = this.person_id.person_id > 0 ? 'U' : 'I';
    this.personDetails.patchValue({ action: action });
    if (this.personDetails.invalid) {
      _.forEach(this.personDetails.controls, function (control) {
        control.markAsTouched();
        if (control.errors !== null) {
          required = control.errors.required ? true : false;
        }
      });
      if (required) {
        this.notification.showError('Please fill the required field(s).');
      }
    } else {
      if (this.personDetails.dirty) {


        //var birth_date = new Date(this.personDetails.value.birth_date).toLocaleDateString("en-US");

        this.personDetails.patchValue({ person_id: this.person_id.person_id });
        //this.personDetails.value.birth_date = birth_date;
        var sub = this.service.SavePersonDetails(this.personDetails.getRawValue()).subscribe(data => {
          this.notification.showSuccess('Record save successfully.');
          var lastName = this.personDetails.value.last_name;
          var firstname = this.personDetails.value.first_name;
          var person = {
            name: lastName + ", " + firstname,
            person_id: data,
            sis_person_id: this.personDetails.value.sis_person_id
          };

          action === 'I' ? this.sendToParent.emit(person) : "";
          sub.unsubscribe();
        })
      } else {
        this.notification.showWarning("No changes made.")
      }
    }
  }
  birthDateChange(event) {
    this.personDetails.patchValue({ age: this.getAge(event) });
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
  GetPersonDetails(person_id) {
    if (person_id.person_id === 0) {
      this.autocomplete.reset();
      this.person_id.person_id = 0;
      this.personDetails.reset();
    } else {
      var sub = this.service.GetPersonDetails(person_id.person_id).subscribe(data => {
        data[0].age = this.getAge(data[0].birth_date);
        data[0].birth_date = new Date(data[0].birth_date.split('T')[0]);
        this.email = data[0].email;
        this.phone_no = data[0].phone_no;
        this.cp_no = data[0].cp_no;
        var medDate = data[0].medical_exam_date;
        data[0].medical_exam_date = medDate === null || medDate === '' ? "" : this.util.FormatDate(medDate);
        data[0].sub_unit_code = data[0].sub_unit_code === null ? "" : data[0].sub_unit_code.toString().trim();
        if (data[0].sis_person_id === null || data[0].sis_person_id === 0) {
          this.formControl.sub_unit_code.enable()
          this.formControl.sis_employee_type.enable()
        } else {
          this.formControl.sub_unit_code.disable()
          this.formControl.sis_employee_type.disable()
        }
        this.personDetails.patchValue(data[0]);
        sub.unsubscribe();
      })
    }
  }
  formBuilder() {
    this.personDetails = this.service.FormGroup();
    this.formControl = this.personDetails.controls;
  }

}
