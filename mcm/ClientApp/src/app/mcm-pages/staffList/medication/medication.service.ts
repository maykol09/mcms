import { Injectable } from "@angular/core";
import { UtilitiesService } from 'src/app/shared/service/utilities.service';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class MedicationService {
  apiUrl = "";
  constructor(private util: UtilitiesService, private http: HttpClient) {
    this.apiUrl = this.util.getApiUrl();
  }

  GetMedication(person_id) {
    var params = new HttpParams().append("person_id", person_id);
    return this.http.get(this.apiUrl + "/api/Medication/GetMedication", { params: params });
  }
  DeleteMedication(medication_ids) {
    return this.http.post(this.apiUrl + "/api/Medication/DeleteMedication", medication_ids);
  }
}
