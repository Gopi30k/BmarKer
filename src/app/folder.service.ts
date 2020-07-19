import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { TreeNode } from "primeng/api";
import { Folder, folderData } from "./models";

@Injectable({
  providedIn: "root",
})
export class FolderService {
  constructor(private http: HttpClient) {}

  getFolderCollections() {
    return this.http
      .get<folderData>("assets/folders.json")
      .toPromise()
      .then((res) => <TreeNode[]>res.data);
  }
}
