import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'priceFormat'
})
export class PriceFormatPipe implements PipeTransform {

  transform(value: number | string): string {
    // Ensure the value is treated as a string
    let numberString = value.toString();
    
    // Handle values less than 1000
    if (numberString.length <= 3) {
      return numberString;
    }

    // Apply Indian numbering format
    let lastThree = numberString.slice(-3);
    let otherNumbers = numberString.slice(0, -3);
    if (otherNumbers !== '') {
      lastThree = ',' + lastThree;
    }
    let formattedValue = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;

    return formattedValue;
  }

}
