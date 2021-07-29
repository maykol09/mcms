import { Injectable } from '@angular/core';

import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

    constructor(public toastr: ToastrService
        ) {
        
    }

    setViewContainerRef(vcr) {
        //this.toastr.setRootViewContainerRef(vcr);
    }

    showSuccess(text) {
        this.toastr.success(text, null, { positionClass: 'toast-bottom-right' });
    }

    showError(text) {
        this.toastr.error(text, null, { positionClass: 'toast-bottom-right' });
    }

    showWarning(text) {
        this.toastr.warning(text, null, { positionClass: 'toast-bottom-right' });
    }

    showInfo(text) {
        this.toastr.info(text, null, { positionClass: 'toast-bottom-right' });
    }

    showInvalidEmail() {
        this.toastr.error('Email is invalid format.', null, { positionClass: 'toast-bottom-right' });
    }

    showCustom(text) {
        //this.toastr.custom('<span style="color: red">Message in red.</span>', null, { enableHTML: true });
    }

    showDateBetweenError(field) {
        this.toastr.error('In ' + field + ' Date from must be less than Date to.', null, { positionClass: 'toast-bottom-right' });
    }

    showUsernameAlreayExists() {
        this.toastr.error('User name already exists.', null, { positionClass: 'toast-bottom-right' });
    }

    showEmployeeNoAlreadyExists() {
        this.toastr.error('Employee no. already exists.', null, { positionClass: 'toast-bottom-right' });
    }

    showSaveSuccess() {
        this.toastr.success('Record saved.', null, { positionClass: 'toast-bottom-right' });
    }

    showNoChangesInfo() {
        this.toastr.info('No changes has been made.', null, { positionClass: 'toast-bottom-right' });
    }

    showEnterRequired() {
        this.toastr.error('Please enter required fields.', null, { positionClass: 'toast-bottom-right' });
    }

}
