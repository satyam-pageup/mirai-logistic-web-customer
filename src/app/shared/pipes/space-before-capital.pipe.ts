import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'spaceBeforeCapital'
})
export class SpaceBeforeCapitalPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) {
      return value;
    }
    return value.replace(/([A-Z])/g, ' $1').trim();
  }

}
