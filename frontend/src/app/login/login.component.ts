import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { BmarkerService } from "../services/bmarker.service";
import {
  Validators,
  FormGroup,
  FormBuilder,
  FormControl,
} from "@angular/forms";
import { CustomFormValidationService } from "../services/custom-form-validation.service";
import { MessageService } from "primeng/api";
@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
  providers: [MessageService],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted: boolean = false;
  constructor(
    private bmarkerService: BmarkerService,
    private router: Router,
    private fb: FormBuilder,
    private customValidator: CustomFormValidationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ["", Validators.required],
      password: ["", Validators.required],
    });
  }

  loginUser() {
    const loginFormValue = this.loginForm.value;
    this.bmarkerService.loginUser(loginFormValue).subscribe(
      (response) => {
        if (response.ok) {
          console.log(response.body);
          let responseObj = response.body;
          localStorage.setItem("bmarkerToken", responseObj["token"]);
          // this.router.navigate(["bookmarks", responseObj["root_bookmark_key"]]);
          this.router.navigate(["bookmarks"]);
        } else {
          console.log(response);
        }
      },

      (err) => {
        this.showError(err["error"]);
      }
    );
  }

  showError(message: string) {
    this.messageService.add({
      severity: "error",
      summary: "Error",
      detail: message,
    });
  }
}
