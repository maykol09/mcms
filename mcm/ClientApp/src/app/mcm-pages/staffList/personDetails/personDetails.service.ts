import { Injectable } from "@angular/core";
import { UtilitiesService } from 'src/app/shared/service/utilities.service';
import { HttpParams, HttpClient } from '@angular/common/http';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})

export class PersonDetailsService {
  apiUrl = "";
  constructor(private util: UtilitiesService,
    private http: HttpClient,
    private formBuilder: FormBuilder) {
    this.apiUrl = this.util.getApiUrl();
  }

  GetPersonDetails(person_id) {
    var params = new HttpParams().append("person_id", person_id);
    return this.http.get(this.apiUrl + "/api/PersonDetails/GetPersonDetails", { params: params });
  }
  SavePersonDetails(data) {
    return this.http.post(this.apiUrl + "/api/PersonDetails/SavePersonDetails", data);
  }
  GetPersonDetailsById(person_id) {
    var params = new HttpParams().append("person_id", person_id);
    return this.http.get(this.apiUrl + "/api/PersonDetails/GetPersonDetailsById", { params: params });
  }
  FormGroup(): FormGroup {
    return this.formBuilder.group({
      person_id: [],
      last_name: ['', Validators.required],
      first_name: ['', Validators.required],
      middle_name: [''],
      birth_date: ['', Validators.required],
      sub_unit_code: [{ value: '', disabled: true }],
      age: [{ value: '', disabled: true }],
      sfile_no: [],
      medical_exam_date: [{ value: '', disabled: true }],
      allergy: [''],
      category: [{ value: '', disabled: true }],
      sis_employee_type: [{ value: '', disabled: true }],
      user: [''],
      action: [''],
      sis_person_id: [],

    })
  }
}
