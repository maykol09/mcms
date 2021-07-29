import { Injectable } from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { UtilitiesService } from 'src/app/shared/service/utilities.service';


@Injectable({
  providedIn: 'root'
})

export class MedicationGridService {
  apiUrl = "";
  constructor(private formBuilder: FormBuilder, private http: HttpClient, private util: UtilitiesService) {
    this.apiUrl = this.util.getApiUrl();
  }

  GetConsultationMed(info) {
    var params = new HttpParams().append("person_id", info.person_id)
      .append("consultation_id", info.consultation_id);

    return this.http.get(this.apiUrl + "api/Consultation/GetConsultationMed", { params: params });
  }
  GetMedicineRef() {

    return this.http.get(this.apiUrl + "api/Reference/GetMedicine");
  }

  FormGroup() {
    return this.formBuilder.group({
      person_id: [0],
      consultation_id: [0],
      consult_med_id: [0],
      med_id: [0],
      medicine: ['', Validators.required],
      quantity: ['', Validators.required],
      dosage: [''],
      action: [],
      onhand: [{ value: "", disabled: true }]
    })
  }


}
