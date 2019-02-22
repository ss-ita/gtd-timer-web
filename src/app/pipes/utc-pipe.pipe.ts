import { Pipe, PipeTransform } from '@angular/core';
import {DatePipe} from '@angular/common'

@Pipe({
  name: 'utcPipe'
})
export class UtcPipePipe implements PipeTransform {

  transform(value: any, args?: any): any { 
    let datePipe: DatePipe = new DatePipe('en-US');
    let dateUtc = new Date(value);
    let dateMilisecondsUtc = Date.UTC(dateUtc.getFullYear(),dateUtc.getMonth(),dateUtc.getDate(),dateUtc.getHours(),dateUtc.getMinutes(),dateUtc.getSeconds(),dateUtc.getMilliseconds());
    let dateLocal = new Date(dateMilisecondsUtc);
    let dateLocaleString = datePipe.transform(dateLocal,args); 
    return dateLocaleString;
  }

}
