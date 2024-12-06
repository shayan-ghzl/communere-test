import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'daysArray'
})
export class DaysArrayPipe implements PipeTransform {

  transform(value: string[]): string {
    if (value.length === 7) {
      return 'Every day';
    }
    return value.join(', ');
  }

}
