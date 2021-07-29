import { Component, Input, Output, OnInit } from "@angular/core";
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl } from '@angular/forms';
import { AddMedicationService } from './addMedication.service';
import { NotificationService } from 'src/app/shared/service/notification.service';
import { UtilitiesService } from 'src/app/shared/service/utilities.service';
import * as _ from 'lodash';
import * as $ from 'jquery';

@Component({
  selector: 'modal-addMedication',
  templateUrl: './addMedication.component.html',

})

export class AddMedicationComponent{
  addMedication: FormGroup;
  formControl = <any>[];
  @Input() person_id: any;
  @Output() sendToParent: any;
  constructor(private modal: NgbActiveModal,
    private service: AddMedicationService,
    private notification: NotificationService,
    private util: UtilitiesService) {
    this.formBuilder();

  }
  ngAfterViewInit() {

    var info = _.cloneDeep(this.person_id[0]);
    if (this.person_id.action === "U") {
      info.date_consulted = new Date(info.date_consulted);
      setTimeout(() => { this.addMedication.patchValue(info) });
    }
  }

  formBuilder() {
    this.addMedication = this.service.FormBuilder();
    this.formControl = this.addMedication.controls;
  }

  saveMedication() {
    var required = false;
    var action = this.person_id[0].action;
    this.addMedication.patchValue({ action: action });
    if (this.addMedication.invalid) {
      _.forEach(this.addMedication.controls, function (control) {
        control.markAsTouched();
        if (control.errors !== null) {
          required = control.errors.required ? true : false;
        }
      });
      if (required) {
        this.notification.showError('Please fill the required field(s).');
      }
    } else {
      var date_consulted = new Date(this.addMedication.value.date_consulted).toLocaleDateString("en-US");
      this.addMedication.patchValue({ person_id: this.person_id[0].person_id });
      this.addMedication.value.date_consulted = date_consulted;
      var sub = this.service.SaveMedication(this.addMedication.value).subscribe(data => {
        this.notification.showSuccess('Record save successfully.');

        var person = this.addMedication.value;

        this.modal.close(person);
        sub.unsubscribe();
      })
    }
  }
}
