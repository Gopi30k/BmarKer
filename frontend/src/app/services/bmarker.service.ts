import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { from, Observable, of, Subject } from "rxjs";
import {
  filter,
  map,
  mergeMap,
  reduce,
  startWith,
  switchMap,
  tap,
  toArray,
  partition,
} from "rxjs/operators";
import { Folder } from "../models";

@Injectable({
  providedIn: "root",
})
export class BmarkerService {
  private folderOnlyCollection: Subject<any> = new Subject<any>();
  folderOnlyCollection$: Observable<any> = this.folderOnlyCollection.asObservable();

  private commonCollection: Subject<any> = new Subject<any>();
  commonCollection$: Observable<any> = this.commonCollection.asObservable();

  // private bkFolderCollection: Subject<any> = new Subject<any>();
  // bkFolderCollection$: Observable<any> = this.bkFolderCollection.asObservable();

  // private bkURLLinkCollection: Subject<any> = new Subject<any>();
  // bkURLLinkCollection$: Observable<any> = this.bkURLLinkCollection.asObservable();
  constructor(private http: HttpClient) {}

  signupUser(userData: Object) {
    return this.http.post(
      "http://127.0.0.1:5000/signup",
      { signup: userData },
      { observe: "response" }
    );
  }

  loginUser(userData: Object) {
    return this.http.post(
      "http://127.0.0.1:5000/login",
      { login: userData },
      { observe: "response" }
    );
  }

  getAllBookmarks() {
    return this.http
      .get<Folder[]>("http://127.0.0.1:5000/")
      .pipe(map((data) => data["data"]));
  }

  getFolderOnlyObs(userBmarkObj) {
    this.http
      .post<Folder[]>("http://127.0.0.1:5000/", userBmarkObj)
      // .pipe(
      //   map((d) =>
      //     d["data"][0]["children"].filter((f) => f.feature == "folder")
      //   ),
      //   tap((api_data) => console.log(api_data))
      // )
      .subscribe((data) => {
        // console.log(data);
        this.folderOnlyCollection.next(data["data"]);
        // this.folderOnlyCollections.next(data);
      });

    // [this.bkFolderCollection$, this.bkURLLinkCollection$] = partition(
    //   this.folderOnlyCollections,
    //   (bmark: Folder) => {
    //     // console.log(bmark);
    //     return bmark.feature === "folder";
    //   }
    // );

    // this.bkFolderCollection$ = this.folderOnlyCollections$.pipe(
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

    // this.bkURLLinkCollection$ = this.folderOnlyCollections$.pipe(
    //   filter((bmarkData) => {
    //     return (bmarkData["children"] = bmarkData["children"].filter(
    //       (childData) => childData.feature === "URLlink"
    //     ));
    //   })
    // );

    // this.bkFolderCollection$.subscribe((d) => console.log(d));
    // this.bkURLLinkCollection$.subscribe((d) => console.log(d));
  }
  getFolderSubCollections(key: string) {
    if (key !== null) {
      return this.http
        .post<Folder[]>("http://127.0.0.1:5000/", {
          user_id: localStorage.getItem("user"),
          bookmark_key: key,
          b_type: "all",
        })
        .pipe(map((data) => data["data"]));
      // .subscribe((data) => console.log(data));
    }
  }

  getSubCollectionOfFolderObs(key: string) {
    if (key !== null) {
      this.http
        .post<Folder[]>("http://127.0.0.1:5000/", {
          user_id: localStorage.getItem("user"),
          bookmark_key: key,
          b_type: "all",
        })
        .subscribe((data) => this.commonCollection.next(data));
    }

    // this.commonCollection$.subscribe((d) => console.log(d));

    // this.folderOnlyCollections$.pipe(tap((data) => console.log(data)));

    // this.commonCollection$
    //   // .pipe(tap(({ ...data }) => console.log(data)))
    //   .subscribe((data) => {
    //     // console.log(data["data"][0]);

    //     data["data"][0].children.forEach((d) => {
    //       d.feature === "folder"
    //         ? this.bkFolderCollection.next(d)
    //         : this.bkURLLinkCollection.next(d);
    //     });
    //   });

    // [
    //   this.bkFolderCollection$,
    //   this.bkURLLinkCollection$,
    // ] = this.commonCollection.pipe(partition((d) => d.feature === "folder"));
  }

  addNewBmarkFolder(newFolder: Folder) {
    return this.http.post<Folder>("http://127.0.0.1:5000/addFolder", {
      folder: newFolder,
    });
  }

  renameBmarkFolder(
    folderToRenameKey: string,
    user: string,
    renameFolder: Folder
  ) {
    return this.http.post<Folder>("http://127.0.0.1:5000/renameFolder", {
      key: folderToRenameKey,
      user,
      renameFolder,
    });
  }

  deleteBmarkFolder(folderToDelKey: string, user: string) {
    return this.http.post<Folder>("http://127.0.0.1:5000/deleteFolder", {
      key: folderToDelKey,
      user,
    });
  }

  addNewBmarkURL(URLNode) {
    return this.http.post<any>("http://127.0.0.1:5000/addURL", {
      URLNode: URLNode,
    });
  }
}
