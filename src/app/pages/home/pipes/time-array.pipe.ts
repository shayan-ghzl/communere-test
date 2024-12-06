import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeArray',
})
export class TimeArrayPipe implements PipeTransform {

  transform(value: string[] | Date[]): string {
    if (!value || value.length === 0) return '';

    const formattedTimes = value.map(item => {
      const date = new Date(item);

      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');

      return `${hours}:${minutes}`;
    });

    return `at ${formattedTimes.join(', ')}`;
  }

}
