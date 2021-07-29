import { Injectable } from "@angular/core";
import { UtilitiesService } from 'src/app/shared/service/utilities.service';
import { HttpParams, HttpClient } from '@angular/common/http';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})

export class MedicineDetailsService {
  apiUrl = "";
  constructor(private util: UtilitiesService,
    private http: HttpClient,
    private formBuilder: FormBuilder) {
    this.apiUrl = this.util.getApiUrl();
  }

  GetMedicineDetails(med_id) {
    var params = new HttpParams().append("med_id", med_id);
    return this.http.get(this.apiUrl + "/api/Medicine/GetMedicineDetails", { params: params });
  }
  SaveMedicineDetails(data) {
    return this.http.post(this.apiUrl + "/api/Medicine/SaveMedicineDetails", data);
  }
  FormGroup(): FormGroup {
    return this.formBuilder.group({
      med_id: [],
      med_code: [''],
      med_name: ['', Validators.required],
      med_class: [''],
      med_unit: [''],
      med_onhand: [{ value: '', disabled: true }],
      med_cost: [{ value: '', disabled: true }],
      reorder_qty: [],
      order_qty: [],
      user: [''],
      action: [''],
      is_active: [false]
    })
  }
}
