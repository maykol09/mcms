import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})

export class ReferenceService {
  constructor() {

  }

  getCivility() {
    return [{ name: "" },
    { name: "Mr" },
    { name: "Mrs" },
    { name: "Dr" },
    { name: "Miss" },
    { name: "Ms" },]
  }
}
