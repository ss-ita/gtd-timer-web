import { Pipe, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Pipe({
  name: 'timeFilter'
})
export class TimeFilterPipe implements PipeTransform {

  transform(milliseconds: any, args?: any): any {
    let valueToReturn: string;
    const milisecondsInHour = 3600000;
    const milisecondsInMinute = 60000;
    const milisecondsInSecond = 1000;

    const hours = Math.floor(Number(milliseconds) / milisecondsInHour);
    const minutes = Math.floor((Number(milliseconds) - hours * milisecondsInHour) / milisecondsInMinute);
    const seconds = Math.floor((Number(milliseconds) - hours * milisecondsInHour - minutes * milisecondsInMinute) / milisecondsInSecond);

    const dec = new DecimalPipe('en-au');
    valueToReturn = dec.transform(hours, '2.0-0') + ':' + dec.transform(minutes, '2.0-0') + ':' + dec.transform(seconds, '2.0');

    return valueToReturn;
  }

}
