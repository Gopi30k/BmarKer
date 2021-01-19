import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { BmarkerService } from "../services/bmarker.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  constructor(private bmarkerService: BmarkerService, private router: Router) {}

  ngOnInit() {}

  loginUser(userCreds: Object) {
    this.bmarkerService.loginUser(userCreds).subscribe((response) => {
      if (response.ok) {
        console.log(response.body);
        let responseObj = response.body;
        localStorage.setItem("user", responseObj["user_id"]);
        // this.router.navigate(["bookmarks", responseObj["root_bookmark_key"]]);
        this.router.navigate(["bookmarks"]);
      }
    });
  }
}
