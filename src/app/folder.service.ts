import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { TreeNode } from "primeng/api";
import { Folder, folderData } from "./models";
import { tap, map } from "rxjs/operators";
import {
  AngularFireDatabase,
  AngularFireObject,
  AngularFireList,
} from "@angular/fire/database";
import { Observable } from "rxjs";
import { Tree } from "primeng/tree";

@Injectable({
  providedIn: "root",
})
export class FolderService {
  bmarkerRef: AngularFireList<any>;
  constructor(private http: HttpClient, private db: AngularFireDatabase) {
    this.bmarkerRef = db.list("bookmarks");
  }

  // getFolderCollections() {
  //   return this.http
  //     .get<folderData>("assets/folders.json")
  //     .toPromise()
  //     .then((res) => <TreeNode[]>res.data);
  // }

  getFirebaseData() {
    return this.bmarkerRef
      .valueChanges()
      .pipe(tap((data) => console.log(data)));
  }

  setFirebaseData(bmarks: TreeNode[]) {
    this.bmarkerRef.set("bookmarks", { test: "hey" });
  }
}
