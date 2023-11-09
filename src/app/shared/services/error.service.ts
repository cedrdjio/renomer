import { Subject } from "rxjs";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class ErrorService {
  error = new Subject<string>();
  private errorListener = new Subject<boolean>();
  private errorM = new Subject<string>();
  private isErr = false;

  getErrorListener() {
    return this.errorListener.asObservable();
  }

  getErrorMessage(){
    return this.errorM.asObservable();
  }

  throwError(err: boolean) {
    this.errorListener.next(err);
  }

  throwErrorString(err: string) {
    this.errorM.next(err);
  }

  handleError() {
    this.errorListener.next(false);
  }
}
