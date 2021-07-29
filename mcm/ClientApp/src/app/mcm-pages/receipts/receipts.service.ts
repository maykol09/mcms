
import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from '@angular/common/http';
import { UtilitiesService } from 'src/app/shared/service/utilities.service';
import { Validators, FormGroup, FormBuilder } from "@angular/forms";


@Injectable({
  providedIn: 'root'
})

export class ReceiptsService {
  apiUrl = "";

  constructor(private http: HttpClient, private util: UtilitiesService, private formBuilder: FormBuilder) {
    this.apiUrl = this.util.getApiUrl();
  }
  GetReceipts(from, to) {
    var params = new HttpParams().append("from", from).append("to", to);
    return this.http.get(this.apiUrl + "api/Receipts/GetReceipts", { params: params });
  }
  GetStockMedicine(si_id) {
    var params = new HttpParams().append("si_id", si_id);
    return this.http.get(this.apiUrl + "api/Receipts/GetStockMedicine", { params: params });
  }
  SaveReceipts(data) {
    return this.http.post(this.apiUrl + "api/Receipts/SaveReceipts", data);
  }
  DeleteReceipts(si_id) {
    var params = new HttpParams().append("si_id", si_id);
    return this.http.post(this.apiUrl + "api/Receipts/DeleteReceipts", si_id);
  }
  FormBuilder() {
    return this.formBuilder.group({
      si_id: [0],
      stock_in_no: [{ value: "", disabled: true }],
      date_received: ['', Validators.required],
      invoice_no: ['', Validators.required],
      supplier: [''],
      status: [{ value: "", disabled: true }],
      remarks: [''],
      user: [''],
      action:['']
    })
  }

  FormGroup() {
    return this.formBuilder.group({
      si_med_id: [0],
      med_id: [0],
      si_id: [0],
      med_name: ['', Validators.required],
      quantity: [0, Validators.required],
      cost: [0],
      remarks:[],
      action: ['']
    })
  }

}
