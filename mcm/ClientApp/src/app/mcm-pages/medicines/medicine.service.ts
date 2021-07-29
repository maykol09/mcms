import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from '@angular/common/http';
import { UtilitiesService } from 'src/app/shared/service/utilities.service';

@Injectable({
  providedIn: 'root'
})

export class MedicineService {
  apiUrl = "";
  constructor(private http: HttpClient,
    private util: UtilitiesService) {
    this.apiUrl = this.util.getApiUrl();
  }

  GetMedicine(medicine) {
    var params = new HttpParams().append("medicine", medicine);
    return this.http.get(this.apiUrl + "/api/Medicine/GetMedicines", { params: params });
  }
  DeleteMedicine(med_id) {
    var params = new HttpParams().append("med_id", med_id);
    return this.http.post(this.apiUrl + "/api/Medicine/DeleteMedicine", med_id);
  }
}
