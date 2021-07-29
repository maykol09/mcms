import { Injectable } from "@angular/core";
import { UtilitiesService } from 'src/app/shared/service/utilities.service';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class ConsultationService {
  apiUrl = "";
  constructor(private util: UtilitiesService, private http: HttpClient) {
    this.apiUrl = this.util.getApiUrl();
  }

  GetConsultation(person_id) {
    var params = new HttpParams().append("person_id", person_id);
    return this.http.get(this.apiUrl + "/api/Consultation/GetConsultation", { params: params });

  }
  DeleteConsultation(consultation_ids) {
    return this.http.post(this.apiUrl + "/api/Consultation/DeleteConsultation", consultation_ids);
  }
}
