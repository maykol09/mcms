import { Injectable } from "@angular/core";
import { UtilitiesService } from 'src/app/shared/service/utilities.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormBuilder, Validators } from "@angular/forms";
import { DataCollection } from '@progress/kendo-angular-grid/dist/es2015/data/data.collection';

@Injectable({
  providedIn: 'root'
})

export class MaintenanceService {
  apiUrl = "";
  constructor(private util: UtilitiesService, private http: HttpClient, private formBuilder: FormBuilder) {
    this.apiUrl = this.util.getApiUrl();
  }

  GetUser(): Observable<object> {
    return this.http.get(this.apiUrl + "api/Maintenance/GetUser");
  }
  SaveUser(data: Array<object>) {
    return this.http.post(this.apiUrl + "api/Maintenance/SaveUser", data);
  }
  DeleteUser(user_id) {
    //var param = new HttpParams().append("user_id", user_id);
    return this.http.post(this.apiUrl + "api/Maintenance/DeleteUser", user_id );
  }
  GetReference() {
    return this.http.get(this.apiUrl + "api/Maintenance/GetReference");
  }
  SaveReference(data) {
    return this.http.post(this.apiUrl + "api/Maintenance/SaveReference", data);
  }
  DeleteReference(ref_id) {
    var param = new HttpParams().append("ref_id", ref_id);
    return this.http.post(this.apiUrl + "api/Maintenance/DeleteReference", ref_id);
  }
  FormGroup() {
    return this.formBuilder.group({
      user_id: [0],
      user_name: ["", Validators.required],
      user_level: ["", Validators.required],
      created_by: [{ value: "", disabled: true }],
      date_created: [{ value: "", disabled: true }],
      action: [],
    })
  }

  RefFormGroup() {
    return this.formBuilder.group({
      ref_id: [0],
      ref_name: ["", Validators.required],
      ref_type: ["", Validators.required],
      ref_code: [""],
      action: [],
    })
  }
}
