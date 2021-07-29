import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from '@angular/common/http';
import { UtilitiesService } from 'src/app/shared/service/utilities.service';

@Injectable({
  providedIn: 'root'
})

export class StaffListService {
  apiUrl = "";
  constructor(private http: HttpClient,
  private util: UtilitiesService) {
    this.apiUrl = this.util.getApiUrl();
  }

  GetStaffList(staff) {
    var params = new HttpParams().append("staff", staff);
    return this.http.get(this.apiUrl + "/api/StaffList/GetStaffList", { params: params });
  }
  DeleteStaff(person_id) {
    var params = new HttpParams().append("person_id", person_id);
    return this.http.post(this.apiUrl + "/api/StaffList/DeleteStaff", person_id);
  }

}

