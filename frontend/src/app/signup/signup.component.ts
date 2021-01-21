import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { User } from "../models";
import { BmarkerService } from "../services/bmarker.service";
import { Validators, FormGroup, FormBuilder } from "@angular/forms";
import { CustomFormValidationService } from "../services/custom-form-validation.service";
@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.scss"],
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  constructor(
    private bmarkerService: BmarkerService,
    private router: Router,
    private fb: FormBuilder,
    private customValidator: CustomFormValidationService
  ) {}

  ngOnInit() {
    this.signupForm = this.fb.group(
      {
        firstName: ["", Validators.required],
        lastName: ["", Validators.required],
        email: ["", [Validators.required, Validators.email]],
        password: [
          "",
          Validators.compose([
            Validators.required,
            this.customValidator.passwordPatternValidator(),
          ]),
        ],
        confirmPassword: ["", [Validators.required]],
      },
      {
        validator: this.customValidator.passwordMatchValidator(
          "password",
          "confirmPassword"
        ),
      }
    );
  }

  get signupFormControl() {
    return this.signupForm.controls;
  }

  signupUser() {
    if (this.signupForm.valid) {
      const formValue = this.signupForm.value;
      delete formValue.confirmPassword;
      console.table(formValue);

      this.bmarkerService.signupUser(formValue).subscribe((response) => {
        if (response.ok) {
          this.router.navigate(["login"]);
        }
      });
    }
  }
}
