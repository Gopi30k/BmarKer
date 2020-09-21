import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { Folder } from "../models";

@Injectable({
  providedIn: "root",
})
export class BmarkerService {
  constructor(private http: HttpClient) {}

  getAllBookmarks() {
    return this.http
      .get<Folder[]>("http://127.0.0.1:5000/")
      .pipe(map((data) => data["data"]));
  }

  getFolderSubCollections(key: string) {
    if (key !== null) {
      return this.http.post<any>("http://127.0.0.1:5000/", { bookmark: key });
      // .subscribe((data) => console.log(data));
    }
  }

  addNewBmarkFolder(newFolder: Folder) {
    console.log(newFolder);

    return this.http
      .post<Folder>("http://127.0.0.1:5000/addFolder", { folder: newFolder })
      .subscribe((data) => console.log(data));
  }

  renameBmarkFolder(folderToRenameKey: string, renameFolder: Folder) {
    return this.http
      .post<Folder>("http://127.0.0.1:5000/renameFolder", {
        key: folderToRenameKey,
        renameFolder: renameFolder,
      })
      .subscribe((data) => console.log(data));
  }

  deleteBmarkFolder(folderToDelKey: string) {
    return this.http
      .post<Folder>("http://127.0.0.1:5000/deleteFolder", {
        key: folderToDelKey,
      })
      .subscribe((data) => console.log(data));
  }

  addNewBmarkURL(urlLink: string) {
    return this.http
      .post<any>("http://127.0.0.1:5000/addURL", {
        url_link: urlLink,
      })
      .subscribe((d) => console.log(d));
  }
}
