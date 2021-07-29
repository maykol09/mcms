import { Component, Input } from "@angular/core";
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup } from "@angular/forms";
import * as _ from 'lodash';
import { Router } from '@angular/router';


@Component({
  selector: 'confirmDelete-modal',
  templateUrl: './confirmDelete.component.html',
})

export class CustomConfirmDeleteModalComponent {

  constructor(public modal: NgbActiveModal) {
  }

}
