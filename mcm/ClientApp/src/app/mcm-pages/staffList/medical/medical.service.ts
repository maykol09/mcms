import { Injectable } from "@angular/core";
import { UtilitiesService } from 'src/app/shared/service/utilities.service';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class MedicalService {
  apiUrl = "";
  constructor(private util: UtilitiesService, private http: HttpClient) {
    this.apiUrl = this.util.getApiUrl();
  }

  GetMedical(person_id) {
    var params = new HttpParams().append("person_id", person_id);
    return this.http.get(this.apiUrl + "/api/Medical/GetMedical", { params: params });
  }
}
