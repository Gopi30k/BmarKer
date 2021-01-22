import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  constructor(private router: Router) {}

  isUserLoggedIn() {
    return !!localStorage.getItem("bmarkerToken");
  }

  logOutUser(overlayPanel) {
    localStorage.removeItem("bmarkerToken");
    overlayPanel.hide();
    this.router.navigate(["login"]);
  }
}
