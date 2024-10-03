import { Pipe, PipeTransform } from '@angular/core';
import { format } from 'date-fns';
@Pipe({
  name: 'customDate'
})
export class CustomDatePipe implements PipeTransform {

  transform(value: Date | string | number): string {
    if (!value) return '';

    // Convert input to Date object if it's a string or number
    const date = new Date(value);
    
    // Format the date using date-fns
    return format(date, 'EEEE, dd MMMM, yyyy');
  }

}
