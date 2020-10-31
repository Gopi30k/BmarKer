import { Component, OnInit } from "@angular/core";
import { BmarkerService } from "../services/bmarker.service";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.scss"],
})
export class SignupComponent implements OnInit {
  constructor(private bmarkerService: BmarkerService) {}

  ngOnInit() {}

  signupUser(formValue: Object) {
    delete formValue["cpassword"];
    // alert(JSON.stringify(formValue));
    this.bmarkerService.signupUser(formValue).subscribe((d) => console.log(d));
  }
}
