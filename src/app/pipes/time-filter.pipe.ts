import { Pipe, PipeTransform } from '@angular/core';
import {DecimalPipe } from '@angular/common';

@Pipe({
  name: 'timeFilter'
})
export class TimeFilterPipe implements PipeTransform {

  transform(milliseconds: any, args?: any): any {
    let valueToReturn:string;
    let milisecondsInHour: number = 3600000;
    let milisecondsInMinute: number = 60000;
    let milisecondsInSecond: number = 1000;

    let hours = Math.floor(Number(milliseconds) / milisecondsInHour);
    let minutes = Math.floor((Number(milliseconds) - hours * milisecondsInHour) / milisecondsInMinute);
    let seconds = Math.floor((Number(milliseconds) - hours * milisecondsInHour - minutes * milisecondsInMinute) / milisecondsInSecond);
    
    const dec = new DecimalPipe('en-au');
    valueToReturn = dec.transform(hours,'2.0-0') + ':' +  dec.transform(minutes,'2.0-0') + ':' + dec.transform(seconds, '2.0');

    return valueToReturn;
  }

}
