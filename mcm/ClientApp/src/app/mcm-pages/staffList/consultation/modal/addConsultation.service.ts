import { Injectable } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { UtilitiesService } from 'src/app/shared/service/utilities.service';


@Injectable({
  providedIn: 'root'
})

export class AddConsultationService {
  apiUrl = "";
  constructor(private formBuilder: FormBuilder, private http: HttpClient, private util: UtilitiesService) {
    this.apiUrl = this.util.getApiUrl();
  }
  SaveConsultation(data) {
    return this.http.post(this.apiUrl + "api/Consultation/SaveConsultation", data);
  }
  GetConsultationMed(info) {
    var params = new HttpParams().append("person_id", info.person_id)
      .append("consultation_id", info.consultation_id);
                                  
    return this.http.get(this.apiUrl + "api/Consultation/GetConsultationMed", {params:params}); 
  }
  GetDiagnosis(input) {
    var params = new HttpParams().append("input", input)
    return this.http.get(this.apiUrl + "api/Reference/GetDiagnosis", { params: params });
  }

  FormBuilder() {
    return this.formBuilder.group({
      consultation_id: [0],
      person_id: [],
      date_consulted: ['', Validators.required],
      complaints: ['', Validators.required],
      diagnosis: [''],
      treatment: [''],
      consulted_by: [{value:"", disabled:true}],
      action: ['']
    })
  }

}
