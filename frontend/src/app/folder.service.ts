import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { TreeNode } from "primeng/api";
import { Folder } from "./models";
import { tap, map, filter } from "rxjs/operators";
import {
  AngularFireDatabase,
  AngularFireObject,
  AngularFireList,
} from "@angular/fire/database";
import {
  AngularFirestore,
  AngularFirestoreDocument,
  AngularFirestoreCollection,
} from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { Tree } from "primeng/tree";

@Injectable({
  providedIn: "root",
})
export class FolderService {
  // bmarkerRef: AngularFireList<any>;
  // bmarkerDoc: AngularFirestoreCollection<TreeNode>;
  bmarkerDoc: AngularFirestoreCollection<TreeNode>;
  constructor(
    private http: HttpClient,
    private db: AngularFireDatabase,
    private afs: AngularFirestore
  ) {
    // this.bmarkerRef = db.list("bookmarks");
    // this.bmarkerDoc = afs.collection<TreeNode>("bookmarks");
  }

  getFolderCollections() {
    return this.http
      .get<Folder[]>("http://127.0.0.1:5000/")
      .pipe(map((data) => data["data"]));
  }

  getFolderDependants(key: string) {
    if (key !== null) {
      return this.http.post<any>("http://127.0.0.1:5000/", { bookmark: key });
      // .subscribe((data) => console.log(data));
    }
  }

  addNewFolder(newFolder: Folder) {
    console.log(newFolder);

    return this.http
      .post<Folder>("http://127.0.0.1:5000/addFolder", { folder: newFolder })
      .subscribe((data) => console.log(data));
  }

  renameNewFolder(folderToRenameKey: string, renameFolder: Folder) {
    return this.http
      .post<Folder>("http://127.0.0.1:5000/renameFolder", {
        key: folderToRenameKey,
        renameFolder: renameFolder,
      })
      .subscribe((data) => console.log(data));
  }

  deleteFolder(folderToDelKey: string) {
    return this.http
      .post<Folder>("http://127.0.0.1:5000/deleteFolder", {
        key: folderToDelKey,
      })
      .subscribe((data) => console.log(data));
  }
}
