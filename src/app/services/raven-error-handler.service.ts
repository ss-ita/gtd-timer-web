import { Injectable, ErrorHandler } from '@angular/core';
import * as Raven from 'raven-js';


@Injectable({
  providedIn: 'root'
})
export class RavenErrorHandlerService implements ErrorHandler {

  constructor() { }

  handleError(error:any): void{
    Raven.captureException(error);
  }
}
