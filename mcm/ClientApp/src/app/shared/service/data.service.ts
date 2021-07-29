import { Injectable } from "@angular/core";
import { BehaviorSubject } from 'rxjs';
import { UtilitiesService } from './utilities.service';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})

export class DataSharedService {
  dataFromHOme: string;
  users = new BehaviorSubject({ user: null });
  dataFromForm = new BehaviorSubject('');
  dataFromNav = new BehaviorSubject('');
  heightFromConsultation: BehaviorSubject<string> = new BehaviorSubject('');
  heightFromReceived: BehaviorSubject<string> = new BehaviorSubject('');
  apiUrl = "";
  getMedicine: any;
  getSupplier: any;
  getReason: any;
  getUser: any;
  constructor(private util: UtilitiesService, private http: HttpClient) {
    this.apiUrl = util.getApiUrl();
  }

  GetMedicine() {
    return this.getMedicine;
  }
  GetSupplier() {
    return this.getSupplier;
  }
  GetReason() {
    return this.getReason;
  }
  GetUser() {
    return this.getUser;
  }
  GetReference() {
    return this.http.get(this.apiUrl + "api/Reference/GetReference");
  }
  Reference(data) {
    this.getMedicine = data.medicine;
    this.getSupplier = data.supplier;
    this.getReason = data.reason;
    this.getUser = data.users;
  }

  changeHeightFromConsultation(data: string) {
    this.heightFromConsultation.next(data);
  }
  changeHeightFromReceived(data: string) {
    this.heightFromReceived.next(data);
  
  }
  loadUser(user: any) {
    this.users.next(user);
  }

  saveDataFromForm(data: any) {
    this.dataFromForm.next(data);
  }

  saveDataFromNav(data: any) {
    this.dataFromNav.next(data);
  }

}
