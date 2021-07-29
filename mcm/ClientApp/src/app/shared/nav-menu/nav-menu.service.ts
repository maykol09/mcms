import { Injectable } from "@angular/core";
import { UtilitiesService } from '../service/utilities.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class NavMenuService {
  apiUrl = "";
  public user = new BehaviorSubject<string>('.');
  public user_level = new BehaviorSubject<number>(1);
  constructor(private util: UtilitiesService, private http: HttpClient) {
    this.apiUrl = this.util.getApiUrl();
  }
  //DecUser(data : string) {
  //  this.user = new BehaviorSubject<string>(data)
  //}
  //DecUserLevel(data : number) {
  //  this.user_level = new BehaviorSubject<number>(data);
  //}
  GetCurrentUser() {
    return this.http.get(this.apiUrl + "/api/Reference/GetCurrentUser");
  }

  UserChange(user: string) {
    this.user.next(user);
  }
  UserLevelChange(data: number) {
    this.user_level.next(data);
  }
}
