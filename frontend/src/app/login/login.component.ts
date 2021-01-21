import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { BmarkerService } from "../services/bmarker.service";
import { Validators, FormGroup, FormBuilder } from "@angular/forms";
import { CustomFormValidationService } from "../services/custom-form-validation.service";
@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted: boolean = false;
  constructor(
    private bmarkerService: BmarkerService,
    private router: Router,
    private fb: FormBuilder,
    private customValidator: CustomFormValidationService
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: [
        "",
        [
          Validators.required,
          Validators.pattern(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          ),
        ],
      ],
      password: [
        "",
        Validators.compose([
          Validators.required,
          this.customValidator.passwordPatternValidator(),
        ]),
      ],
    });
  }

  get loginFormControl() {
    return this.loginForm.controls;
  }

  loginUser() {
    this.submitted = true;
    const loginFormValue = this.loginForm.value;
    this.bmarkerService.loginUser(loginFormValue).subscribe((response) => {
      if (response.ok) {
        console.log(response.body);
        let responseObj = response.body;
        localStorage.setItem("bmarkerToken", responseObj["token"]);
        // this.router.navigate(["bookmarks", responseObj["root_bookmark_key"]]);
        this.router.navigate(["bookmarks"]);
      }
    });
  }
}
