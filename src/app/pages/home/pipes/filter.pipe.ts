import { Pipe, PipeTransform } from '@angular/core';
import { Reminder } from '../models/models';

@Pipe({
  name: 'filter',
  standalone: true
})
export class FilterPipe implements PipeTransform {

  transform(value: Reminder[], searckKey: string | null): Reminder[] {
    if (searckKey === null) {
      return value;
    }

    const result = value.filter(item => item.title.includes(searckKey));
    return result;
  }

}