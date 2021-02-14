import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { from, Observable, of, Subject, throwError } from "rxjs";
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
  catchError,
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

  private bkFolderCollection: Subject<any> = new Subject<any>();
  bkFolderCollection$: Observable<any> = this.bkFolderCollection.asObservable();

  private bkURLLinkCollection: Subject<any> = new Subject<any>();
  bkURLLinkCollection$: Observable<any> = this.bkURLLinkCollection.asObservable();
  constructor(private http: HttpClient, private router: Router) {}

  private api_url: string = "http://127.0.0.1:8080/bmarker/";
  signupUser(userData: Object) {
    return this.http
      .post(
        `${this.api_url}signup`,
        { signup: userData },
        { observe: "response" }
      )
      .pipe(catchError(this.handleError));
  }

  loginUser(userData: Object) {
    return this.http
      .post(
        `${this.api_url}login`,
        { login: userData },
        { observe: "response" }
      )
      .pipe(catchError(this.handleError));
  }

  getAllBookmarks() {
    return this.http
      .get<Folder[]>(`${this.api_url}`)
      .pipe(map((data) => data["data"]));
  }

  getFolderOnlyObs(userBmarkObj) {
    this.http
      .post<Folder[]>(`${this.api_url}`, userBmarkObj)
      .pipe(catchError(this.handleError))
      // .pipe(
      //   map((d) =>
      //     d["data"][0]["children"].filter((f) => f.feature == "folder")
      //   ),
      //   tap((api_data) => console.log(api_data))
      // )
      .subscribe(
        (data) => {
          // console.log(data);
          this.folderOnlyCollection.next(data["data"]);
          // this.folderOnlyCollections.next(data);
        },
        (err) => {
          this.router.navigate(["/login"]);
          // console.log(err);
        }
      );

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
        .post<Folder[]>(this.api_url, {
          // user_id: localStorage.getItem("user"),
          bookmark_key: key,
          b_type: "all",
        })
        .pipe(map((data) => data["data"]));
      // .subscribe((data) => console.log(data));
    }
  }

  // getSubCollectionOfFolderObs(key: string) {
  //   if (key !== null) {
  //     this.http
  //       .post<Folder[]>("http://127.0.0.1:5000/", {
  //         user_id: localStorage.getItem("user"),
  //         bookmark_key: key,
  //         b_type: "all",
  //       })
  //       .subscribe((data) => this.commonCollection.next(data));
  //   }

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
  // }

  setCurrentBmarkChildren(obj: Folder[]) {
    console.log(obj);

    // this.commonCollection.next(obj);
    let folders = [];
    let links = [];

    obj.forEach((element) => {
      element.feature === "folder"
        ? folders.push(element)
        : links.push(element);
    });

    this.bkFolderCollection.next(folders);
    this.bkURLLinkCollection.next(links);
  }

  addNewBmarkFolder(newFolder: Folder) {
    return this.http.post<Folder>(`${this.api_url}addFolder`, {
      folder: newFolder,
    });
  }

  renameBmarkFolder(folderToRenameKey: string, renameFolder: Folder) {
    return this.http.post<Folder>(`${this.api_url}renameFolder`, {
      key: folderToRenameKey,
      renameFolder,
    });
  }

  deleteBmarkFolder(folderToDelKey: string) {
    return this.http.post<Folder>(`${this.api_url}deleteFolder`, {
      key: folderToDelKey,
    });
  }

  addNewBmarkURL(URLNode) {
    return this.http.post<any>(`${this.api_url}addURL`, {
      URLNode: URLNode,
    });
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error("An error occurred:", error.error.message);
    }
    // else {
    // The backend returned an unsuccessful response code.
    // The response body may contain clues as to what went wrong.
    //   console.error(
    //     `Backend returned code ${error.status}, ` +
    //       `body was: ${JSON.stringify(error.error)}`
    //   );
    // }
    // Return an observable with a user-facing error message.
    return throwError(error.error);
  }
}
