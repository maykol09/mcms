import { Injectable, EventEmitter } from '@angular/core';

import { PlatformLocation } from '@angular/common';
//import { forEach } from 'lodash';
import * as _ from 'lodash';
@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {
  postData = new EventEmitter();
  public url: any[] = location.href.split('/');
  constructor(private platformLocation: PlatformLocation) {

  }

  getApiUrl() {
    var apiUrl = "";

    if (this.url[2].includes('localhost')) { //dev
      apiUrl = this.url[0] + '//' + this.url[2] + '/';
    }
    else {
      apiUrl = this.url[0] + '//' + this.url[2] + '/mcms/';
    }
    return apiUrl;
  }

  FormatDate(date) {

    date = new Date(date).toLocaleDateString('en-GB', {
      day: "2-digit",
      month: 'short',
      year: 'numeric'
    });
    return date;
  }
  FormatNumber(num) {
    return num.toLocaleString();
  }
  convertDate(dateStr) {
    var dateParts = dateStr.split(" ");
    var day = dateParts[0];
    var month = _.indexOf(["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], dateParts[1]);
    var year = dateParts[2];
    var newDate = year + "-" + ('00' + month).slice(-2) + '-' + day;
    return newDate;
  }
}

