import { Component, Input } from "@angular/core";
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup } from "@angular/forms";
import * as _ from 'lodash';
import { Router } from '@angular/router';


@Component({
  selector: 'confirm-modal',
  templateUrl: './confirm.component.html',
})

export class CustomConfirmModalComponent {

  constructor(public modal: NgbActiveModal) {
  }

}
