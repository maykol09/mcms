import { Injectable } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from "@angular/common/http";
import { UtilitiesService } from 'src/app/shared/service/utilities.service';
@Injectable({
  providedIn: 'root'
})

export class AddMedicationService {
  apiUrl = "";
  constructor(private formBuilder: FormBuilder, private http: HttpClient, private util: UtilitiesService) {
    this.apiUrl = this.util.getApiUrl();
  }

  FormBuilder() {
    return this.formBuilder.group({
      consult_med_id: [],
      person_id: [],
      medicine: ['', Validators.required],
      med_quantity: [],
      dosage: [''],
      date_given: [''],
      action: ['']
    })
  }
  SaveMedication(data) {
    return this.http.post(this.apiUrl + "api/Medication/SaveMedication", data);
  }
}
