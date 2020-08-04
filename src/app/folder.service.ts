import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { TreeNode } from "primeng/api";
import { Folder} from "./models";
import { tap, map } from "rxjs/operators";
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
      .get<TreeNode>("assets/folders.json")
      .toPromise()
      .then((res) => res.data);
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
