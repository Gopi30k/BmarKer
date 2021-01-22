import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { BmarkerService } from "../services/bmarker.service";
import { Validators, FormGroup, FormBuilder } from "@angular/forms";
import { CustomFormValidationService } from "../services/custom-form-validation.service";
import { MessageService } from "primeng/api";
@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.scss"],
  providers: [MessageService],
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  submitted: boolean = false;
  constructor(
    private bmarkerService: BmarkerService,
    private router: Router,
    private fb: FormBuilder,
    private customValidator: CustomFormValidationService,
    private messageService: MessageService
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
    this.submitted = true;
    if (this.signupForm.valid) {
      const formValue = this.signupForm.value;
      delete formValue.confirmPassword;
      console.table(formValue);

      this.bmarkerService.signupUser(formValue).subscribe(
        (response) => {
          if (response.ok) {
            this.router.navigate(["login"]);
          }
        },
        (err) => {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: err.error,
          });
        }
      );
    }
  }
}
