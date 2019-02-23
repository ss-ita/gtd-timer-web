import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'utcPipe'
})
export class UtcPipePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    const datePipe: DatePipe = new DatePipe('en-US');
    const dateUtc = new Date(value);
    const dateMilisecondsUtc = Date.UTC(dateUtc.getFullYear(), dateUtc.getMonth(),
     dateUtc.getDate(), dateUtc.getHours(), dateUtc.getMinutes(), dateUtc.getSeconds(), dateUtc.getMilliseconds());
     const dateLocal = new Date(dateMilisecondsUtc);
     const dateLocaleString = datePipe.transform(dateLocal, args);
    return dateLocaleString;
  }

}
