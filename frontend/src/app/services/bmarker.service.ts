import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { from, Observable, of, Subject, partition } from "rxjs";
import {
  filter,
  map,
  mergeMap,
  reduce,
  startWith,
  switchMap,
  tap,
  toArray,
} from "rxjs/operators";
import { Folder } from "../models";

@Injectable({
  providedIn: "root",
})
export class BmarkerService {
  private bmarkerCollections: Subject<any> = new Subject<any>();
  bmarkerCollections$: Observable<any> = this.bmarkerCollections.asObservable();
  folderCollections = new Subject<Folder>();
  folderCollections$: Observable<any>;
  urlLinkCollections$: Observable<any>;
  constructor(private http: HttpClient) {}

  signupUser(userData: Object) {
    return this.http.post("http://127.0.0.1:5000/signup", { signup: userData });
  }

  getAllBookmarks() {
    return this.http
      .get<Folder[]>("http://127.0.0.1:5000/")
      .pipe(map((data) => data["data"]));
  }

  getAllBookmarksObs() {
    this.http
      .get<Folder[]>("http://127.0.0.1:5000/")
      .subscribe((data) => this.bmarkerCollections.next(data["data"]));

    // [this.folderCollections$, this.urlLinkCollections$] = partition(
    //   this.bmarkerCollections,
    //   (bmark: Folder) => {
    //     // console.log(bmark);
    //     return bmark.feature === "folder";
    //   }
    // );

    // this.folderCollections$ = this.bmarkerCollections$.pipe(
    //   filter((bmarkData) => {
    //     console.log(bmarkData);
    //     let test = JSON.parse(JSON.stringify(bmarkData));
    //     test["children"] = test["children"].filter(
    //       (childData) => childData.feature === "folder"
    //     );
    //     console.log(test);
    //     return test;
    //   })
    // );

    // this.urlLinkCollections$ = this.bmarkerCollections$.pipe(
    //   filter((bmarkData) => {
    //     return (bmarkData["children"] = bmarkData["children"].filter(
    //       (childData) => childData.feature === "URLlink"
    //     ));
    //   })
    // );

    // this.folderCollections$.subscribe((d) => console.log(d));
    // this.urlLinkCollections$.subscribe((d) => console.log(d));
  }
  getFolderSubCollections(key: string) {
    if (key !== null) {
      return this.http
        .post<Folder[]>("http://127.0.0.1:5000/", {
          bookmark: key,
        })
        .pipe(map((data) => data["data"]));
      // .subscribe((data) => console.log(data));
    }
  }

  getFolderSubCollectionsObs(key: string) {
    if (key !== null) {
      this.http
        .post<Folder[]>("http://127.0.0.1:5000/", { bookmark: key })
        .subscribe((data) => {
          this.bmarkerCollections.next(data["data"][0]);
        });
    }
    // this.bmarkerCollections$.pipe(tap((data) => console.log(data)));

    // this.bmarkerCollections$
    //   .pipe(tap(({ ...data }) => console.log(data)))
    //   .subscribe();
  }

  addNewBmarkFolder(newFolder: Folder) {
    return this.http.post<Folder>("http://127.0.0.1:5000/addFolder", {
      folder: newFolder,
    });
  }

  renameBmarkFolder(folderToRenameKey: string, renameFolder: Folder) {
    return this.http.post<Folder>("http://127.0.0.1:5000/renameFolder", {
      key: folderToRenameKey,
      renameFolder: renameFolder,
    });
  }

  deleteBmarkFolder(folderToDelKey: string) {
    return this.http.post<Folder>("http://127.0.0.1:5000/deleteFolder", {
      key: folderToDelKey,
    });
  }

  addNewBmarkURL(URLNode) {
    return this.http.post<any>("http://127.0.0.1:5000/addURL", {
      URLNode: URLNode,
    });
  }
}
