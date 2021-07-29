import { Injectable } from "@angular/core";
import { UtilitiesService } from 'src/app/shared/service/utilities.service';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class ReceivedMedicineService {
  apiUrl = "";
  constructor(private util: UtilitiesService, private http: HttpClient) {
    this.apiUrl = this.util.getApiUrl();
  }

  GetReceivedMed(med_id) {
    var params = new HttpParams().append("med_id", med_id);
    return this.http.get(this.apiUrl + "/api/Medicine/GetReceivedMed", { params: params });
  }

  DeleteMedication(medication_ids) {
    return this.http.post(this.apiUrl + "/api/Medication/DeleteMedication", medication_ids);
  }
}
