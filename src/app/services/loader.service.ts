import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class LoaderService {
  public status: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public reqCounter = 0;

  display(value: boolean) {
    if (value) {
      this.reqCounter++;
    } else {
      this.reqCounter--;
    }

    const newValue = this.reqCounter != 0;
    setTimeout(() => {
      this.status.next(newValue);
    });
  }
}
