import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from '@angular/common/http';
import { UtilitiesService } from 'src/app/shared/service/utilities.service';


@Injectable({
  providedIn: 'root'
})

export class ReportsService {
  apiUrl = "";
  constructor(private http: HttpClient, private util: UtilitiesService) {
    this.apiUrl = this.util.getApiUrl();
  }
  GetConsultationReports(from, to) {
    var params = new HttpParams().append("from", from).append("to",to);
    return this.http.get(this.apiUrl + "api/Reports/GetConsultationReports", { params: params }); 
  }
  GetMedicationReports(from, to) {
    var params = new HttpParams().append("from", from).append("to", to);
    return this.http.get(this.apiUrl + "api/Reports/GetMedicationReports", { params: params });
  }
  GetMedicineReports() {
    //var params = new HttpParams().append("from", from).append("to", to);
    return this.http.get(this.apiUrl + "api/Reports/GetMedicineReports");
  }
}
