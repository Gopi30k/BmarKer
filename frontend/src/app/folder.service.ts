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

  getFolderCollectionsJSON() {
    return this.http
      .get<TreeNode>("assets/folders.json")
      .toPromise()
      .then((res) => res.data);
  }

  getFolderCollections() {
    return this.http
      .get<Folder[]>("http://127.0.0.1:5000/")
      .pipe(map((data) => data["data"]));
  }

  addNewFolder(newFolder: Folder) {
    console.log(newFolder);
    return this.http
      .post<Folder>("http://127.0.0.1:5000/addFolder", { folder: newFolder })
      .subscribe((data) => console.log(data));
  }

  renameNewFolder(folderToRename: Folder, renameString: string) {
    folderToRename["parent"] = folderToRename["parent"]["label"];
    console.log(folderToRename, renameString);
    return this.http
      .post<Folder>("http://127.0.0.1:5000/renameFolder", {
        folder: folderToRename,
        renameString: renameString,
      })
      .subscribe((data) => console.log(data));
  }

  deleteFolder(folderToDel: Folder) {
    folderToDel["parent"] = folderToDel["parent"]["label"];
    console.log(folderToDel);

    return this.http
      .post<Folder>("http://127.0.0.1:5000/deleteFolder", {
        folder: folderToDel,
      })
      .subscribe((data) => console.log(data));
  }
  // getFirebaseData() {
  //   return this.bmarkerRef
  //     .valueChanges()
  //     .pipe(tap((data) => console.log(data)));
  // }

  // getFirebaseData() {
  //   this.bmarkerDoc.get().subscribe((d) => console.log(d));

  //   return this.bmarkerDoc
  //   .valueChanges()
  //   .pipe(tap((data) => console.log(data)));

  // }

  // setFirebaseData(bmarks: TreeNode[]) {
  //   this.bmarkerRef.set("bookmarks", { test: "hey" });
  // }
}
